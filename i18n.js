(function () {
  'use strict';

  var LS_KEY = 'valens_lang';

  // ---- SR rečnik. EN živi u HTML-u / na call-site-ovima kao fallback. ----
  // Ključevi: dot-notacija po stranici/sekciji. {x} = interpolacija na call-site-u.
  var SR = {
    // --- shared (reusable across pages) ---
    'nav.features': 'Mogućnosti',
    'nav.screens': 'Ekrani',
    'nav.ebooks': 'E-knjige',
    'nav.store': 'Prodavnica',
    'nav.cta': 'Preuzmi aplikaciju',
    'cat.training': 'Trening',
    'cat.nutrition': 'Ishrana',
    'cat.merch': 'Odeća',
    'cat.accessories': 'Oprema',
    'badge.soon': 'Uskoro',
    'footer.privacy': 'Privatnost',
    'footer.deletion': 'Brisanje naloga',
    'footer.contact': 'Kontakt',

    // --- index ---
    'meta.title.home': 'VALENS — Dnevnik treninga',
    'meta.desc.home': 'Beleži svaki trening, obaraj lične rekorde i treniraj rame uz rame sa društvom.',

    'hero.line1': 'Treniraj pametnije.',
    'hero.line2': 'Prati sve.',
    'hero.line3': 'Napreduj brže.',
    'hero.subtitle': 'Beleži svaki trening, obaraj lične rekorde i treniraj rame uz rame sa društvom.',
    'hero.trust.exercises': '700+ vežbi',
    'hero.trust.meta': 'Besplatno · Kupovina u aplikaciji · PEGI 3',

    'feat.eyebrow': 'Mogućnosti',
    'feat.title': 'Sve što ti treba za pametniji trening',
    'feat.track.title': 'Beleži sve',
    'feat.track.desc': 'Beleži serije, ponavljanja, kilažu, drop setove i kardio. Gledaj kako ti lični rekordi rastu.',
    'feat.coach.title': 'Pametni trener',
    'feat.coach.desc': 'Tvoj trener uočava zapostavljene mišićne grupe i predlaže šta da treniraš sledeće.',
    'feat.library.title': '700+ vežbi',
    'feat.library.desc': 'Kompletna biblioteka sa ciljanim mišićima, opremom i uputstvima za izvođenje.',
    'feat.routines.title': 'Rutine i programi',
    'feat.routines.desc': 'Napravi svoju ili prati strukturiran program koji je napisao profesionalni trener.',
    'feat.friends.title': 'Treniraj sa društvom',
    'feat.friends.desc': 'Prati treninge svog društva, lajkuj njihove sesije i penji se na rang-listi.',
    'feat.achievements.title': 'Dostignuća i rezimei',
    'feat.achievements.desc': 'Osvajaj bedževe, održavaj nizove i dobij nedeljni rezime svog napretka.',

    'showcase.eyebrow': 'Ekrani',
    'showcase.title': 'Pogledaj VALENS na delu',

    'reviews.eyebrow': 'Recenzije',
    'reviews.title': 'Prve recenzije stižu',
    'reviews.sub': 'VALENS je tek izašao. Kako dizači budu ocenjivali aplikaciju na Google Play-u, prave recenzije stižu pravo ovde — bez izmišljenih citata i lažnih zvezdica.',
    'reviews.pending.1': 'Čeka se prva recenzija',
    'reviews.pending.2': 'Ovde mogu da stoje tvoje reči',
    'reviews.pending.3': 'Tvoja bi mogla da bude prva',
    'reviews.cta.text': 'Već treniraš uz VALENS?',
    'reviews.cta.btn': '★ Oceni nas na Google Play-u',

    'teaser.ebooks.eyebrow': 'E-knjige',
    'teaser.ebooks.title': 'Programi napravljeni da se prate',
    'teaser.ebooks.text': 'Programi treninga, planovi ishrane i 1-na-1 coaching — napisani da rade ruku pod ruku sa VALENS aplikacijom.',
    'teaser.ebooks.cta': 'Pogledaj e-knjige',
    'teaser.store.eyebrow': 'Prodavnica',
    'teaser.store.title': 'Obuci VALENS',
    'teaser.store.text': 'Brendirana odeća i oprema za trening, napravljena za teretanu. Plaćanje pouzećem, besplatna dostava širom Srbije.',
    'teaser.store.cta': 'Poseti prodavnicu',

    'capture.eyebrow': 'Novosti o lansiranju',
    'capture.title': 'Saznaj prvi kad VALENS izbaci nove funkcije',
    'capture.sub': 'Bez spama — samo vesti o lansiranju i po koji novi program.',
    'capture.label': 'Imejl adresa',
    'capture.placeholder': 'ti@primer.com',
    'capture.btn': 'Prijavi se',

    'cta.title': 'Počni da treniraš uz VALENS'
  };

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
      if (!attr) return;
      var store = attrOrig.get(el);
      if (!store) { store = {}; attrOrig.set(el, store); }
      if (lang === 'sr') {
        if (!(attr in store)) store[attr] = el.getAttribute(attr);
        if (has(key)) el.setAttribute(attr, SR[key]);
      } else if (attr in store) {
        if (store[attr] == null) el.removeAttribute(attr); else el.setAttribute(attr, store[attr]);
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
