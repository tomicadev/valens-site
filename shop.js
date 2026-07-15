(function () {
  'use strict';
  var cfg = window.VALENS_CONFIG || {};
  var RATE = cfg.EUR_TO_RSD || 117.5;

  // ---- pure helpers (verifiable) ----
  function eur(n) { return '€' + (Math.round(n * 100) / 100); }
  function rsd(n) { return Math.round(n * RATE).toLocaleString('sr-RS') + ' RSD'; }
  function makeOrderRef() {
    var s = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '';
    for (var i = 0; i < 6; i++) r += s[Math.floor(Math.random() * s.length)];
    return 'VLN-' + r;
  }
  window.VALENS_SHOP = { eur: eur, rsd: rsd, makeOrderRef: makeOrderRef, RATE: RATE };

  var CATALOG = [];
  function bySku(sku) { for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].sku === sku) return CATALOG[i]; return null; }
  window.VALENS_SHOP.bySku = bySku;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  var I = window.VALENS_I18N || { t: function (k, f) { return f; }, lang: function () { return 'en'; } };
  function pName(p) { return I.lang() === 'sr' && p.name_sr ? p.name_sr : p.name; }
  function pDesc(p) { return I.lang() === 'sr' && p.desc_sr ? p.desc_sr : (p.desc || ''); }
  window.VALENS_SHOP.pName = pName;
  window.VALENS_SHOP.esc = esc;

  function cardHTML(p) {
    var sizes = (p.sizes || []).map(function (s) {
      return '<button type="button" class="size" data-size="' + s + '">' + s + '</button>';
    }).join('');
    return '' +
      '<article class="product" data-sku="' + p.sku + '">' +
      '  <span class="product__ribbon" aria-hidden="true">' + esc(I.t('store.soon', 'Coming soon')) + '</span>' +
      '  <div class="product__media"><img loading="lazy" src="' + esc(p.image) + '" alt="' + esc(pName(p)) + '"></div>' +
      '  <h4 class="product__name">' + esc(pName(p)) + '</h4>' +
      '  <p class="product__desc">' + esc(pDesc(p)) + '</p>' +
      (sizes ? '  <div class="product__sizes" data-sizes>' + sizes + '</div>' : '') +
      '  <div class="product__buy"><span class="product__price">' + eur(p.price_eur) + '</span>' +
      '  <button type="button" class="btn-pill product__add" data-add' + (sizes ? ' disabled' : '') + '>' + esc(I.t('store.add', 'Add to cart')) + '</button></div>' +
      '</article>';
  }

  function renderCatalog() {
    ['Apparel', 'Accessories'].forEach(function (cat) {
      var grid = document.querySelector('[data-products-grid="' + cat + '"]');
      if (!grid) return;
      grid.innerHTML = CATALOG.filter(function (p) { return p.active && p.category === cat; }).map(cardHTML).join('');
    });
    wireCards();
  }

  function wireCards() {
    document.querySelectorAll('.product').forEach(function (card) {
      var sku = card.dataset.sku;
      var chosen = null;
      var addBtn = card.querySelector('[data-add]');
      card.querySelectorAll('.size').forEach(function (b) {
        b.addEventListener('click', function () {
          card.querySelectorAll('.size').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          chosen = b.dataset.size;
          if (addBtn) addBtn.disabled = false;
        });
      });
      if (addBtn) addBtn.addEventListener('click', function () {
        var p = bySku(sku);
        if (p && p.sizes && p.sizes.length && !chosen) return;
        window.VALENS_CART.add(sku, chosen);
        // micro-feedback: brief "Added" state so the click visibly lands
        addBtn.textContent = I.t('store.added', '✓ Added');
        setTimeout(function () { addBtn.textContent = I.t('store.add', 'Add to cart'); }, 1200);
      });
    });
  }

  fetch('products.json').then(function (r) { return r.json(); }).then(function (data) {
    CATALOG = data.products || [];
    window.VALENS_SHOP.catalog = CATALOG;
    renderCatalog();
    if (window.VALENS_CART) window.VALENS_CART.refresh();
  });

  document.addEventListener('valens:langchange', function () {
    if (CATALOG.length) renderCatalog();
  });
})();

(function () {
  'use strict';
  var KEY = 'valens_cart';
  var MAX_QTY = 9;
  var S = window.VALENS_SHOP;
  var I = window.VALENS_I18N || { t: function (k, f) { return f; }, lang: function () { return 'en'; } };
  var TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11.5v5M14 11.5v5M6 7l1 13h10l1-13M9.2 7V4h5.6v3"/></svg>';

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(c) { localStorage.setItem(KEY, JSON.stringify(c)); }
  var cart = load();

  function lineKey(sku, size) { return sku + '|' + (size || ''); }
  function subtotal() {
    return cart.reduce(function (t, l) { var p = S.bySku(l.sku); return t + (p ? p.price_eur * l.qty : 0); }, 0);
  }
  function count() { return cart.reduce(function (t, l) { return t + l.qty; }, 0); }

  function add(sku, size) {
    var k = lineKey(sku, size), found = null;
    cart.forEach(function (l) { if (lineKey(l.sku, l.size) === k) found = l; });
    if (found) found.qty = Math.min(MAX_QTY, found.qty + 1); else cart.push({ sku: sku, size: size || null, qty: 1 });
    save(cart); refresh(); open();
    if (countEl) { countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }
  }
  function setQty(sku, size, qty) {
    qty = Math.min(qty, MAX_QTY);
    var k = lineKey(sku, size);
    cart = cart.filter(function (l) { if (lineKey(l.sku, l.size) !== k) return true; l.qty = qty; return qty > 0; });
    save(cart); refresh();
  }

  var drawer = document.querySelector('[data-cart-drawer]');
  var backdrop = document.querySelector('[data-cart-backdrop]');
  var itemsEl = document.querySelector('[data-cart-items]');
  var subEl = document.querySelector('[data-cart-subtotal]');
  var countEl = document.querySelector('[data-cart-count]');
  var checkoutBtn = document.querySelector('[data-cart-checkout]');
  var toggle = document.querySelector('[data-cart-toggle]');

  function open() { if (drawer) { drawer.hidden = false; backdrop.hidden = false; document.body.style.overflow = 'hidden'; } }
  function close() { if (drawer) { drawer.hidden = true; backdrop.hidden = true; document.body.style.overflow = ''; } }
  // UI-initiated close (X, backdrop, Continue shopping, Escape) returns focus to the cart button
  function uiClose() { close(); if (toggle) toggle.focus(); }

  function refresh() {
    var n = count();
    if (countEl) { countEl.textContent = n; countEl.hidden = n === 0; }
    if (subEl) subEl.textContent = S.eur(subtotal());
    if (checkoutBtn) checkoutBtn.textContent = I.t('cart.checkout', 'Checkout') + (n ? ' (' + n + ')' : '');
    if (!itemsEl) return;
    if (!cart.length) { itemsEl.innerHTML = '<p class="cart-empty">' + S.esc(I.t('cart.empty', 'Your cart is empty.')) + '</p>'; return; }
    itemsEl.innerHTML = cart.map(function (l) {
      var p = S.bySku(l.sku); if (!p) return '';
      return '<div class="cart-line" data-sku="' + l.sku + '" data-size="' + (l.size || '') + '">' +
        '<img src="' + p.image + '" alt=""><div class="cart-line__info"><strong>' + S.esc(S.pName(p)) + '</strong>' +
        (l.size ? '<span>' + S.esc(I.t('cart.size', 'Size')) + ' ' + l.size + '</span>' : '') + '<span>' + S.eur(p.price_eur) + (l.qty > 1 ? S.esc(I.t('cart.each', ' each')) : '') + '</span></div>' +
        '<div class="cart-line__right"><span class="cart-line__total">' + S.eur(p.price_eur * l.qty) + '</span>' +
        '<div class="cart-line__qty"><button data-dec aria-label="' + S.esc(I.t('cart.dec', 'Decrease quantity')) + '">−</button><span class="cart-line__num">' + l.qty + '</span>' +
        '<button data-inc aria-label="' + S.esc(I.t('cart.inc', 'Increase quantity')) + '"' + (l.qty >= MAX_QTY ? ' disabled' : '') + '>+</button>' +
        '<button class="cart-line__rm" data-rm aria-label="' + S.esc(I.t('cart.rm', 'Remove item')) + '">' + TRASH + '</button></div></div></div>';
    }).join('');
    itemsEl.querySelectorAll('.cart-line').forEach(function (row) {
      var sku = row.dataset.sku, size = row.dataset.size || null;
      var cur = 0; cart.forEach(function (l) { if (l.sku === sku && (l.size || '') === (size || '')) cur = l.qty; });
      row.querySelector('[data-inc]').addEventListener('click', function () { setQty(sku, size, cur + 1); });
      row.querySelector('[data-dec]').addEventListener('click', function () { setQty(sku, size, cur - 1); });
      row.querySelector('[data-rm]').addEventListener('click', function () { setQty(sku, size, 0); });
    });
  }

  if (toggle) toggle.addEventListener('click', open);
  document.querySelectorAll('[data-cart-close]').forEach(function (b) { b.addEventListener('click', uiClose); });
  if (backdrop) backdrop.addEventListener('click', uiClose);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && !drawer.hidden) uiClose(); });

  window.VALENS_CART = { add: add, refresh: refresh, open: open, close: close, items: function () { return cart.slice(); }, subtotal: subtotal, clear: function () { cart = []; save(cart); refresh(); } };
  refresh();

  document.addEventListener('valens:langchange', refresh);
})();

(function () {
  'use strict';
  var S = window.VALENS_SHOP, C = window.VALENS_CART, cfg = window.VALENS_CONFIG || {};
  var I = window.VALENS_I18N || { t: function (k, f) { return f; }, lang: function () { return 'en'; } };
  var section = document.getElementById('checkout');
  var form = document.querySelector('[data-checkout-form]');
  if (!section || !form || !C) return;
  var summary = document.querySelector('[data-checkout-summary]');
  var statusEl = document.querySelector('[data-co-status]');
  var submit = document.querySelector('[data-co-submit]');
  var checkoutBtn = document.querySelector('[data-cart-checkout]');
  var checkoutWrap = section.querySelector('.checkout');
  var successEl = section.querySelector('[data-checkout-success]');
  var doneRef = section.querySelector('[data-done-ref]');
  var doneSummary = section.querySelector('[data-done-summary]');
  var doneNote = section.querySelector('[data-done-note]');
  var doneContinue = section.querySelector('[data-done-continue]');
  var confettiEl = section.querySelector('[data-confetti]');

  function status(msg, kind) { if (statusEl) { statusEl.textContent = msg; statusEl.dataset.kind = kind; } }
  function val(sel) { var el = form.querySelector(sel); return el ? el.value.trim() : ''; }

  function confetti() {
    if (!confettiEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['#6F4DB3', '#9B78D4', '#B79BE6', '#E6E6EB', '#8259C9'];
    confettiEl.innerHTML = '';
    for (var i = 0; i < 90; i++) {
      var b = document.createElement('span');
      b.className = 'confetti-bit';
      b.style.left = (Math.random() * 100) + '%';
      b.style.background = colors[i % colors.length];
      b.style.animationDelay = (Math.random() * 0.9).toFixed(2) + 's';
      b.style.transform = 'scale(' + (0.7 + Math.random() * 0.8).toFixed(2) + ')';
      confettiEl.appendChild(b);
    }
    setTimeout(function () { confettiEl.innerHTML = ''; }, 4200);
  }

  function renderSummary() {
    var items = C.items(), sub = C.subtotal();
    summary.innerHTML =
      items.map(function (l) { var p = S.bySku(l.sku); return p ? '<div class="co-row"><span>' + l.qty + '× ' + S.esc(S.pName(p)) + (l.size ? ' (' + l.size + ')' : '') + '</span><span>' + S.eur(p.price_eur * l.qty) + '</span></div>' : ''; }).join('') +
      '<div class="co-row co-total"><span>' + S.esc(I.t('co.total', 'Total')) + '</span><strong>' + S.eur(sub) + '</strong></div>' +
      '<div class="co-rsd">≈ ' + S.rsd(sub) + S.esc(I.t('co.rsd.suffix', ' — paid to the courier')) + '</div>' +
      '<div class="co-ship">' + S.esc(I.t('co.freeship', 'Free shipping')) + '</div>';
  }

  function openCheckout() {
    if (!C.items().length) return;
    C.close();
    // a previous order's success view gives way to a fresh form (re-ordering works)
    if (successEl) successEl.hidden = true;
    if (checkoutWrap) checkoutWrap.hidden = false;
    submit.disabled = false; status('', '');
    section.hidden = false; renderSummary();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (doneContinue) doneContinue.addEventListener('click', function () {
    section.hidden = true;
    var merch = document.getElementById('merch');
    if (merch) merch.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (val('[data-co-honeypot]')) return;
    var name = val('[data-co-name]'), phone = val('[data-co-phone]'),
        address = val('[data-co-address]'), city = val('[data-co-city]'), postal = val('[data-co-postal]');
    if (!name || !phone || !address || !city || !postal) { status(I.t('co.err.fields', 'Please fill name, phone and address.'), 'error'); return; }
    if (!C.items().length) { status(I.t('cart.empty', 'Your cart is empty.'), 'error'); return; }
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) { status(I.t('co.err.config', 'Ordering is not configured yet.'), 'error'); return; }

    // Absolute image URL (not a relative path) so the notify-order email — sent
    // from a backend with no notion of the site's origin — can embed a thumbnail.
    var items = C.items().map(function (l) {
      var p = S.bySku(l.sku);
      var img = p.image ? new URL(p.image, location.href).href : null;
      return { sku: l.sku, name: p.name, name_sr: p.name_sr || null, size: l.size, qty: l.qty, price_eur: p.price_eur, image: img };
    });
    var order = {
      order_ref: S.makeOrderRef(), items: items, subtotal_eur: C.subtotal(),
      customer_name: name, phone: phone, address: address, city: city, postal_code: postal,
      email: val('[data-co-email]') || null, note: val('[data-co-note]') || null,
    };
    submit.disabled = true; status(I.t('co.status.placing', 'Placing your order…'), 'pending');
    fetch(cfg.SUPABASE_URL + '/rest/v1/orders', {
      method: 'POST',
      headers: { apikey: cfg.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + cfg.SUPABASE_ANON_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(order),
    }).then(function (res) {
      if (res.ok) {
        // swap the form for the success view (form stays in the DOM so re-ordering works)
        if (doneRef) doneRef.textContent = order.order_ref;
        if (doneSummary) doneSummary.innerHTML =
          order.items.map(function (i) { return '<div class="co-row"><span>' + i.qty + '× ' + S.esc(S.pName(i)) + (i.size ? ' (' + i.size + ')' : '') + '</span><span>' + S.eur(i.price_eur * i.qty) + '</span></div>'; }).join('') +
          '<div class="co-row co-total"><span>' + S.esc(I.t('co.total', 'Total')) + '</span><strong>' + S.eur(order.subtotal_eur) + '</strong></div>' +
          '<div class="co-rsd">≈ ' + S.rsd(order.subtotal_eur) + S.esc(I.t('co.done.rsd', ' — cash on delivery')) + '</div>';
        if (doneNote) doneNote.textContent = I.t('co.done.note', "We'll call you on {phone} to confirm your order and arrange delivery. You pay the courier in cash when it arrives — shipping is free.").replace('{phone}', phone);
        if (checkoutWrap) checkoutWrap.hidden = true;
        if (successEl) successEl.hidden = false;
        form.reset(); submit.disabled = false; status('', '');
        C.clear();
        confetti();
        if (successEl) successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else { status(I.t('common.err.generic', 'Something went wrong. Try again in a moment.'), 'error'); submit.disabled = false; }
    }).catch(function () { status(I.t('common.err.network', 'Network error. Try again in a moment.'), 'error'); submit.disabled = false; });
  });

  document.addEventListener('valens:langchange', function () {
    if (!section.hidden && checkoutWrap && !checkoutWrap.hidden) renderSummary();
  });
})();
