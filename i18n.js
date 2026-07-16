(function () {
  'use strict';

  var LS_KEY = 'valens_lang';

  // ---- SR rečnik. EN živi u HTML-u / na call-site-ovima kao fallback. ----
  // Ključevi: dot-notacija po stranici/sekciji. {x} = interpolacija na call-site-u.
  var SR = {
    // --- shared (reusable across pages) ---
    'nav.features': 'Mogućnosti',
    'nav.screens': 'Ekrani',
    'nav.home': 'Početna',
    'nav.ebooks': 'E-knjige',
    'nav.store': 'Prodavnica',
    'nav.cta': 'Preuzmi aplikaciju',
    'cat.training': 'Trening',
    'cat.nutrition': 'Ishrana',
    'cat.merch': 'Odeća',
    'cat.accessories': 'Oprema',
    'badge.soon': 'Uskoro',
    'badge.soon.aria': 'Preuzimanje na App Store-u — uskoro',
    'a11y.skip': 'Preskoči na sadržaj',
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

    'cta.title': 'Počni da treniraš uz VALENS',

    // --- ebooks ---
    'meta.title.ebooks': 'VALENS E-knjige — Planovi treninga i ishrane',
    'meta.desc.ebooks': 'Programi treninga i planovi ishrane napravljeni da se prate — uz 1-na-1 online coaching sa tvorcem VALENS-a.',

    'nav.coaching': 'Coaching',
    'nav.about': 'O meni',

    'ebooks.hero.eyebrow': 'VALENS Prodavnica',
    'ebooks.hero.title': 'Programi napravljeni da se prate.',
    'ebooks.hero.sub': 'Strukturirani programi treninga i planovi ishrane — napisani da rade ruku pod ruku sa VALENS aplikacijom.',
    'ebooks.hero.cta.plan': 'Pronađi svoj plan',
    'ebooks.hero.cta.training': 'Planovi treninga',
    'ebooks.hero.cta.nutrition': 'Planovi ishrane',

    // calkulator
    'calc.eyebrow': 'Pronađi svoj plan',
    'calc.title': 'Nisi siguran odakle da počneš?',
    'calc.sub': 'Odgovori na nekoliko kratkih pitanja — izračunaću tvoje dnevne kalorije i preporučiti pravi program treninga i plan ishrane za tvoj cilj.',
    'calc.label.sex': 'Pol',
    'calc.opt.male': 'Muško',
    'calc.opt.female': 'Žensko',
    'calc.label.age': 'Godine',
    'calc.label.height': 'Visina (cm)',
    'calc.label.weight': 'Težina (kg)',
    'calc.label.activity': 'Nivo aktivnosti',
    'calc.act.sedentary': 'Sedentaran — kancelarijski posao, malo ili nimalo vežbanja',
    'calc.act.light': 'Lako aktivan — trening 1–3 dana nedeljno',
    'calc.act.moderate': 'Umereno aktivan — trening 3–5 dana nedeljno',
    'calc.act.very': 'Veoma aktivan — trening 6–7 dana nedeljno',
    'calc.act.extreme': 'Ekstremno aktivan — fizički posao + svakodnevni trening',
    'calc.goals.aria': 'Tvoj cilj',
    'calc.goal.fatloss': 'Skidanje masti',
    'calc.goal.muscle': 'Rast mišića',
    'calc.goal.maintain': 'Održavanje',
    'calc.goal.recomp': 'Rekompozicija',
    'calc.goal.gain': 'Dobijanje mase',
    'calc.submit': 'Pronađi svoj plan',
    'calc.stat.maintenance': 'Kalorije održavanja',
    'calc.stat.target': 'Dnevni cilj kcal',
    'calc.disclaimer': 'Procene su samo orijentacione — nisu medicinski savet.',

    // trening
    'ebooks.training.title': 'Planovi treninga',
    'book.details': 'Detaljnije',
    'books.mrv.title': 'Mr. VALENS — Petodnevna hipertrofija',
    'books.mrv.desc': 'Naš najzahtevniji flagship — projektovan seriju po seriju.',
    'books.bev.title': 'Be VALENS — Uspon kroz 4 nedelje',
    'books.bev.desc': 'Četiri nedelje. Kilaža ostaje ista. Napor raste.',
    'books.lop.title': 'Learn or Perish — Blok temelja',
    'books.lop.desc': 'Nauči da ponoviš ponavljanje. Nauči kako izgleda kad je teško.',
    'books.apex.title': 'Apex PPL — Šestodnevni Push/Pull/Legs',
    'books.apex.desc': 'Svaki mišić, dvaput nedeljno, za nemilosrdan rast.',
    'books.iron.title': 'Iron Foundation — Snaga 5×5',
    'books.iron.desc': 'Tri treninga. Tri vežbe. Pet serija po pet.',
    'books.phul.title': 'PHUL — Snaga i hipertrofija',
    'books.phul.desc': 'Dva dana snage, dva dana hipertrofije, jedna jaka nedelja.',

    // ishrana
    'ebooks.nutrition.title': 'E-knjige o ishrani',
    'ebooks.nutrition.sub': 'Izaberi svoje dnevne kalorije. Svaki paket sadrži 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane — na srpskom ili engleskom.',
    'books.n1800.title': 'Paket ishrane — 1800 kcal',
    'books.n1800.desc': 'Plan sa kontrolisanim kalorijama za postepeno skidanje masti.',
    'books.n2000.title': 'Paket ishrane — 2000 kcal',
    'books.n2000.desc': 'Vitko i uravnoteženo — svakodnevna osnova.',
    'books.n2200.title': 'Paket ishrane — 2200 kcal',
    'books.n2200.desc': 'Malo više goriva za aktivne dane treninga.',
    'books.n2500.title': 'Paket ishrane — 2500 kcal',
    'books.n2500.desc': 'Održavanje i veće energetske potrebe, precizno podešeno.',
    'books.n2800.title': 'Paket ishrane — 2800 kcal',
    'books.n2800.desc': 'Napravljen da podrži rast mišića.',
    'books.n3000.title': 'Paket ishrane — 3000 kcal',
    'books.n3000.desc': 'Visokokalorijski plan za ozbiljan čist bulk.',

    // preskoči čitanje (CTA)
    'ebooks.skip.eyebrow': 'Radije bi preskočio čitanje?',
    'ebooks.skip.title': 'Prepusti plan meni',
    'ebooks.skip.text': 'E-knjige, planovi ishrane, beleženje svakog treninga — mnogo je toga da sam izguraš. Radi sa mnom 1-na-1 i ja preuzimam sve: tvoj trening, tvoju ishranu, nedeljna prilagođavanja. Ti se samo pojaviš.',
    'ebooks.skip.cta': 'Prijavi se za coaching',

    // coaching
    'coach.eyebrow': '1-na-1 Coaching',
    'coach.title': 'Online coaching, direktno sa mnom',
    'coach.price.from': 'od ',
    'coach.price.per': '/mes',
    'coach.sub': 'Personalizovan trening i ishrana, nedeljne provere kroz VALENS aplikaciju, i plan koji se prilagođava tvom životu — a ne obrnuto. Ograničen broj mesta.',
    'coach.inc.1': 'Personalizovan program treninga',
    'coach.inc.2': 'Prilagođen plan ishrane',
    'coach.inc.3': 'Nedeljne provere kroz VALENS aplikaciju',
    'coach.inc.4': 'Direktan chat pristup meni',
    'coach.inc.5': 'Video analize tehnike',
    'coach.inc.6': 'Prilagođavanja plana kako napreduješ',
    'coach.about': 'O meni',
    'coach.label.name': 'Tvoje ime',
    'coach.ph.name': 'Tvoje ime',
    'coach.label.email': 'Imejl adresa',
    'coach.ph.email': 'ti@primer.com',
    'coach.label.goal': 'Tvoj cilj',
    'coach.ph.message': 'Reci mi nešto o svom cilju…',
    'coach.submit': 'Prijavi se za coaching',

    // o meni
    'about.photo.alt': 'Tvoj trener u teretani',
    'about.eyebrow': 'O meni',
    'about.title': 'Upoznaj svog trenera',
    'about.bio': 'Ceo život dižem tegove i online sam trener — napravio sam VALENS da treniram onako kako bih voleo da su me učili od prvog dana: strukturirano, iskreno i sa fokusom na napredak. Godinama pomažem ljudima da preseku buku u teretani, isprave tehniku i zaista dostignu svoje ciljeve. Trening sa mnom je direktan, ličan i skrojen prema tvom životu.',
    'about.stat.years': 'godine trenerskog rada',
    'about.stat.clients': 'istreniranih klijenata',
    'about.stat.cert.value': 'Sertifikovan',
    'about.stat.cert.label': 'snaga i ishrana'
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
