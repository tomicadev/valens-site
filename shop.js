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

  function cardHTML(p) {
    var sizes = (p.sizes || []).map(function (s) {
      return '<button type="button" class="size" data-size="' + s + '">' + s + '</button>';
    }).join('');
    return '' +
      '<article class="product" data-sku="' + p.sku + '">' +
      '  <div class="product__media"><img loading="lazy" src="' + esc(p.image) + '" alt="' + esc(p.name) + '"></div>' +
      '  <h4 class="product__name">' + esc(p.name) + '</h4>' +
      '  <p class="product__desc">' + esc(p.desc || '') + '</p>' +
      (sizes ? '  <div class="product__sizes" data-sizes>' + sizes + '</div>' : '') +
      '  <div class="product__buy"><span class="product__price">' + eur(p.price_eur) + '</span>' +
      '  <button type="button" class="btn-pill product__add" data-add' + (sizes ? ' disabled' : '') + '>Add to cart</button></div>' +
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
        window.VALENS_CART.add(sku, chosen); // defined in Task 7
      });
    });
  }

  fetch('products.json').then(function (r) { return r.json(); }).then(function (data) {
    CATALOG = data.products || [];
    window.VALENS_SHOP.catalog = CATALOG;
    renderCatalog();
    if (window.VALENS_CART) window.VALENS_CART.refresh();
  });
})();

(function () {
  'use strict';
  var KEY = 'valens_cart';
  var S = window.VALENS_SHOP;

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
    if (found) found.qty += 1; else cart.push({ sku: sku, size: size || null, qty: 1 });
    save(cart); refresh(); open();
  }
  function setQty(sku, size, qty) {
    var k = lineKey(sku, size);
    cart = cart.filter(function (l) { if (lineKey(l.sku, l.size) !== k) return true; l.qty = qty; return qty > 0; });
    save(cart); refresh();
  }

  var drawer = document.querySelector('[data-cart-drawer]');
  var backdrop = document.querySelector('[data-cart-backdrop]');
  var itemsEl = document.querySelector('[data-cart-items]');
  var subEl = document.querySelector('[data-cart-subtotal]');
  var countEl = document.querySelector('[data-cart-count]');

  function open() { if (drawer) { drawer.hidden = false; backdrop.hidden = false; document.body.style.overflow = 'hidden'; } }
  function close() { if (drawer) { drawer.hidden = true; backdrop.hidden = true; document.body.style.overflow = ''; } }

  function refresh() {
    if (countEl) { var n = count(); countEl.textContent = n; countEl.hidden = n === 0; }
    if (subEl) subEl.textContent = S.eur(subtotal());
    if (!itemsEl) return;
    if (!cart.length) { itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>'; return; }
    itemsEl.innerHTML = cart.map(function (l) {
      var p = S.bySku(l.sku); if (!p) return '';
      return '<div class="cart-line" data-sku="' + l.sku + '" data-size="' + (l.size || '') + '">' +
        '<img src="' + p.image + '" alt=""><div class="cart-line__info"><strong>' + p.name + '</strong>' +
        (l.size ? '<span>Size ' + l.size + '</span>' : '') + '<span>' + S.eur(p.price_eur) + '</span></div>' +
        '<div class="cart-line__qty"><button data-dec>−</button><span>' + l.qty + '</span><button data-inc>+</button>' +
        '<button class="cart-line__rm" data-rm aria-label="Remove">×</button></div></div>';
    }).join('');
    itemsEl.querySelectorAll('.cart-line').forEach(function (row) {
      var sku = row.dataset.sku, size = row.dataset.size || null;
      var cur = 0; cart.forEach(function (l) { if (l.sku === sku && (l.size || '') === (size || '')) cur = l.qty; });
      row.querySelector('[data-inc]').addEventListener('click', function () { setQty(sku, size, cur + 1); });
      row.querySelector('[data-dec]').addEventListener('click', function () { setQty(sku, size, cur - 1); });
      row.querySelector('[data-rm]').addEventListener('click', function () { setQty(sku, size, 0); });
    });
  }

  var toggle = document.querySelector('[data-cart-toggle]');
  if (toggle) toggle.addEventListener('click', open);
  document.querySelectorAll('[data-cart-close]').forEach(function (b) { b.addEventListener('click', close); });
  if (backdrop) backdrop.addEventListener('click', close);

  window.VALENS_CART = { add: add, refresh: refresh, open: open, close: close, items: function () { return cart.slice(); }, subtotal: subtotal, clear: function () { cart = []; save(cart); refresh(); } };
  refresh();
})();

(function () {
  'use strict';
  var S = window.VALENS_SHOP, C = window.VALENS_CART, cfg = window.VALENS_CONFIG || {};
  var section = document.getElementById('checkout');
  var form = document.querySelector('[data-checkout-form]');
  if (!section || !form || !C) return;
  var summary = document.querySelector('[data-checkout-summary]');
  var statusEl = document.querySelector('[data-co-status]');
  var submit = document.querySelector('[data-co-submit]');
  var checkoutBtn = document.querySelector('[data-cart-checkout]');

  function status(msg, kind) { if (statusEl) { statusEl.textContent = msg; statusEl.dataset.kind = kind; } }
  function val(sel) { var el = form.querySelector(sel); return el ? el.value.trim() : ''; }

  function renderSummary() {
    var items = C.items(), sub = C.subtotal();
    summary.innerHTML =
      items.map(function (l) { var p = S.bySku(l.sku); return p ? '<div class="co-row"><span>' + l.qty + '× ' + p.name + (l.size ? ' (' + l.size + ')' : '') + '</span><span>' + S.eur(p.price_eur * l.qty) + '</span></div>' : ''; }).join('') +
      '<div class="co-row co-total"><span>Total</span><strong>' + S.eur(sub) + '</strong></div>' +
      '<div class="co-rsd">≈ ' + S.rsd(sub) + ' — paid to the courier</div>' +
      '<div class="co-ship">Free shipping</div>';
  }

  function openCheckout() {
    if (!C.items().length) return;
    C.close(); section.hidden = false; renderSummary();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (val('[data-co-honeypot]')) return;
    var name = val('[data-co-name]'), phone = val('[data-co-phone]'),
        address = val('[data-co-address]'), city = val('[data-co-city]'), postal = val('[data-co-postal]');
    if (!name || !phone || !address || !city || !postal) { status('Please fill name, phone and address.', 'error'); return; }
    if (!C.items().length) { status('Your cart is empty.', 'error'); return; }
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) { status('Ordering is not configured yet.', 'error'); return; }

    var items = C.items().map(function (l) { var p = S.bySku(l.sku); return { sku: l.sku, name: p.name, size: l.size, qty: l.qty, price_eur: p.price_eur }; });
    var order = {
      order_ref: S.makeOrderRef(), items: items, subtotal_eur: C.subtotal(),
      customer_name: name, phone: phone, address: address, city: city, postal_code: postal,
      email: val('[data-co-email]') || null, note: val('[data-co-note]') || null,
    };
    submit.disabled = true; status('Placing your order…', 'pending');
    fetch(cfg.SUPABASE_URL + '/rest/v1/orders', {
      method: 'POST',
      headers: { apikey: cfg.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + cfg.SUPABASE_ANON_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(order),
    }).then(function (res) {
      if (res.ok) {
        section.innerHTML = '<div class="container"><div class="checkout-done"><h2>Order ' + order.order_ref + ' received</h2><p>We\'ll call you on ' + phone + ' to confirm your order and delivery. You pay the courier in cash on arrival.</p></div></div>';
        C.clear();
      } else { status('Something went wrong. Try again in a moment.', 'error'); submit.disabled = false; }
    }).catch(function () { status('Network error. Try again in a moment.', 'error'); submit.disabled = false; });
  });
})();
