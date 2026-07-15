(function () {
  'use strict';

  var LS_KEY = 'valens_lang';

  // ---- SR rečnik. EN živi u HTML-u / na call-site-ovima kao fallback. ----
  // Ključevi: dot-notacija po stranici/sekciji. {x} = interpolacija na call-site-u.
  var SR = {};

  var lang = 'en';
  try { if (localStorage.getItem(LS_KEY) === 'sr') lang = 'sr'; } catch (e) {}

  // Originalni EN sadržaj, upamćen pri prvom prelasku na SR (za povratak).
  var textOrig = new WeakMap();
  var htmlOrig = new WeakMap();
  var attrOrig = new WeakMap();

  function has(key) { return Object.prototype.hasOwnProperty.call(SR, key); }

  function t(key, fallback) {
    return lang === 'sr' && has(key) ? SR[key] : fallback;
  }

  function applyText(el) {
    var key = el.getAttribute('data-i18n');
    if (lang === 'sr') {
      if (!textOrig.has(el)) textOrig.set(el, el.textContent);
      if (has(key)) el.textContent = SR[key];
    } else if (textOrig.has(el)) {
      el.textContent = textOrig.get(el);
    }
  }

  function applyHtml(el) {
    var key = el.getAttribute('data-i18n-html');
    if (lang === 'sr') {
      if (!htmlOrig.has(el)) htmlOrig.set(el, el.innerHTML);
      if (has(key)) el.innerHTML = SR[key];
    } else if (htmlOrig.has(el)) {
      el.innerHTML = htmlOrig.get(el);
    }
  }

  function applyAttrs(el) {
    // format: "placeholder:kljuc;aria-label:kljuc2"
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var i = pair.indexOf(':');
      if (i < 0) return;
      var attr = pair.slice(0, i).trim();
      var key = pair.slice(i + 1).trim();
      var store = attrOrig.get(el);
      if (!store) { store = {}; attrOrig.set(el, store); }
      if (lang === 'sr') {
        if (!(attr in store)) store[attr] = el.getAttribute(attr);
        if (has(key)) el.setAttribute(attr, SR[key]);
      } else if (attr in store) {
        el.setAttribute(attr, store[attr]);
      }
    });
  }

  function applyAll() {
    document.documentElement.lang = lang === 'sr' ? 'sr-Latn' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(applyText);
    document.querySelectorAll('[data-i18n-html]').forEach(applyHtml);
    document.querySelectorAll('[data-i18n-attr]').forEach(applyAttrs);
  }

  function updateSwitch() {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setLang(l) {
    l = l === 'sr' ? 'sr' : 'en';
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem(LS_KEY, l); } catch (e) {}
    applyAll();
    updateSwitch();
    document.dispatchEvent(new CustomEvent('valens:langchange', { detail: { lang: l } }));
  }

  window.VALENS_I18N = { t: t, set: setLang, lang: function () { return lang; } };

  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-btn')); });
  });
  updateSwitch();
  if (lang === 'sr') applyAll();
})();
