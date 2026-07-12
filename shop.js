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
