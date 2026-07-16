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
    'a11y.menu': 'Meni',
    'a11y.lang': 'Jezik',
    'a11y.close': 'Zatvori',
    'a11y.nav.primary': 'Glavna',
    'store.cart.aria': 'Korpa',
    'social.x.aria': 'X (uskoro)',
    'social.email.aria': 'Imejl',
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
    'about.stat.cert.label': 'snaga i ishrana',

    // --- ebooks: modalni sadržaj (12 knjiga) ---
    // zajednički redovi treninga
    'books.train.hb': 'Uključuje priručnik Osnove treninga',
    'books.train.app': 'Napravljeno za praćenje u VALENS aplikaciji',
    // zajednički redovi ishrane
    'books.nutri.recipes': '31 recept bogat proteinima, sa punim makroima',
    'books.nutri.fundamentals': 'Osnove ishrane — 20 poglavlja',
    'books.nutri.lang': 'Srpski ili engleski — izaberi jezik na naplati',
    'books.nutri.pdf': 'PDF spreman za štampu · trenutno preuzimanje',

    'books.mrv.extra.p': 'Petodnevni Upper/Lower/Push/Pull/Legs program za hipertrofiju, brušen kroz bezbroj treninga. Svaka vežba je pažljivo odabrana po odnosu stimulusa i zamora, svaka serija nosi ciljani broj ponavljanja i RIR smernicu, a izbor pokreta se oslanja na sajle i mašine za konstantnu tenziju i volumen prijatan zglobovima.',
    'books.mrv.extra.li1': '5-dnevni Upper/Lower/Push/Pull/Legs raspored',
    'books.mrv.extra.li2': '32 vežbe, ~108 zahtevnih serija nedeljno',
    'books.mrv.extra.li3': 'RIR ciljevi po vežbi za precizan napor',
    'books.mrv.extra.li4': 'Vođen sajlama i mašinama za konstantnu tenziju',

    'books.bev.extra.p': 'Četvoronedeljni blok hipertrofije sa rastućim naporom na 5-dnevnom Upper/Lower/Push/Pull/Legs rasporedu. Vežbe, serije i ponavljanja se ne menjaju — svake nedelje propisani napor raste, od ponavljanja u rezervi do sve-ili-ništa poslednje nedelje. Ti donosiš kilažu; blok te uči da guraš.',
    'books.bev.extra.li1': '5-dnevni Upper/Lower/Push/Pull/Legs raspored',
    'books.bev.extra.li2': '4-nedeljni blok sa rastućim naporom, pa deload',
    'books.bev.extra.li3': '26 vežbi sa nedeljnim RIR talasima',
    'books.bev.extra.li4': 'Fiksne vežbe — ti savladavaš progresiju',

    'books.lop.extra.p': 'Četvoronedeljni blok temelja na 5-dnevnom rasporedu. Uigrava tehniku na glavnim vežbama i gradi radni kapacitet pre nego što intenzitet poraste, nedelju po nedelju. Svaka serija propisuje ponavljanja i RIR smernicu da naučiš da proceniš pravi napor — iskreno mesto za početak ozbiljnog treniranja.',
    'books.lop.extra.li1': '5-dnevni raspored, prvo tehnika',
    'books.lop.extra.li2': '4-nedeljni blok temelja, pa deload',
    'books.lop.extra.li3': '26 vežbi sa smernicama napora zasnovanim na RIR-u',
    'books.lop.extra.li4': 'Gradi radni kapacitet pre nego što intenzitet poraste',

    'books.apex.extra.p': 'Šestodnevni push/pull/legs raspored za postojan rast i snagu. Svaki mišić se trenira dvaput nedeljno; A treninzi počinju teško, B treninzi počinju drugom vežbom i opsegom ponavljanja. Svaka serija nosi ciljani broj ponavljanja i RIR smernicu — ti donosiš radnu kilažu, program vodi napor.',
    'books.apex.extra.li1': '6-dnevni Push/Pull/Legs, dvaput nedeljno',
    'books.apex.extra.li2': '30 vežbi, ~112 serija nedeljno',
    'books.apex.extra.li3': 'A/B treninzi variraju vežbe i opsege ponavljanja',
    'books.apex.extra.li4': 'Hipertrofija izgrađena na osnovi snage',

    'books.iron.extra.p': 'Trodnevni blok snage usredsređen na 5×5 rad na čučnju, bench pressu i mrtvom dizanju, uz ciljane pomoćne vežbe. Uski RIR ciljevi na glavnim vežbama grade sirovu snagu; dodaješ kilažu kako napreduješ, a ponavljanja i napor su ti unapred zacrtani.',
    'books.iron.extra.li1': 'Trodnevni full-body blok snage',
    'books.iron.extra.li2': '5×5 na čučnju, bench pressu i mrtvom dizanju',
    'books.iron.extra.li3': '13 fokusiranih vežbi, uski RIR na glavnima',
    'books.iron.extra.li4': 'Dodaješ kilažu kako napreduješ',

    'books.phul.extra.p': 'Četvorodnevni Power/Hypertrophy Upper-Lower program: dva teža dana snage koji podižu snagu, dva dana hipertrofije sa većim volumenom koji podižu masu. Dani snage idu teže i uže; dani hipertrofije jure pumpu. Ti donosiš kilažu.',
    'books.phul.extra.li1': '4-dnevni Upper/Lower, snaga + hipertrofija',
    'books.phul.extra.li2': '2 dana snage plus 2 dana hipertrofije',
    'books.phul.extra.li3': '21 vežba — snaga i masa u jednoj nedelji',
    'books.phul.extra.li4': 'Teži rad na snazi, rad na pumpi sa većim volumenom',

    'books.n1800.extra.p': 'Kompletan sistem ishrane na 1800 kcal: strukturiran 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane. Izaberi srpski ili engleski na naplati.',
    'books.n1800.extra.li1': '7-dnevni plan ishrane na 1800 kcal, sa zamenama obroka',

    'books.n2000.extra.p': 'Kompletan sistem ishrane na 2000 kcal: strukturiran 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane. Izaberi srpski ili engleski na naplati.',
    'books.n2000.extra.li1': '7-dnevni plan ishrane na 2000 kcal, sa zamenama obroka',

    'books.n2200.extra.p': 'Kompletan sistem ishrane na 2200 kcal: strukturiran 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane. Izaberi srpski ili engleski na naplati.',
    'books.n2200.extra.li1': '7-dnevni plan ishrane na 2200 kcal, sa zamenama obroka',

    'books.n2500.extra.p': 'Kompletan sistem ishrane na 2500 kcal: strukturiran 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane. Izaberi srpski ili engleski na naplati.',
    'books.n2500.extra.li1': '7-dnevni plan ishrane na 2500 kcal, sa zamenama obroka',

    'books.n2800.extra.p': 'Kompletan sistem ishrane na 2800 kcal: strukturiran 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane. Izaberi srpski ili engleski na naplati.',
    'books.n2800.extra.li1': '7-dnevni plan ishrane na 2800 kcal, sa zamenama obroka',

    'books.n3000.extra.p': 'Kompletan sistem ishrane na 3000 kcal: strukturiran 7-dnevni plan ishrane, 31 recept bogat proteinima i kompletan vodič Osnove ishrane. Izaberi srpski ili engleski na naplati.',
    'books.n3000.extra.li1': '7-dnevni plan ishrane na 3000 kcal, sa zamenama obroka',

    // --- store ---
    'meta.title.store': 'VALENS Prodavnica — Odeća i oprema',
    'meta.desc.store': 'Brendirana VALENS odeća i oprema za trening — napravljena za teretanu.',

    'store.hero.eyebrow': 'VALENS Prodavnica',
    'store.hero.title': 'Nosi svoj trud.',
    'store.hero.sub': 'Brendirana odeća i oprema za trening, napravljena za teretanu. Plaćanje pouzećem, besplatna dostava širom Srbije.',
    'store.nav.merch': 'Odeća',
    'store.group.apparel': 'Odeća',
    'store.group.accessories': 'Oprema',

    'store.sec.eyebrow': 'Prodavnica',
    'store.sec.title': 'Obuci VALENS',
    'store.sec.sub': 'Odeća i oprema za trening, napravljena za teretanu. Plaćanje pouzećem, besplatna dostava širom Srbije.',

    'store.cart.open': 'Otvori korpu',
    'store.cart.close': 'Zatvori korpu',
    'store.cart.title': 'Tvoja korpa',
    'store.cart.subtotal': 'Ukupno',
    'store.continue': 'Nastavi kupovinu',

    'store.co.eyebrow': 'Poručivanje',
    'store.co.title': 'Plaćanje pouzećem',
    'store.co.sub': 'Plaćaš kuriru kešom kada porudžbina stigne. Besplatna dostava širom Srbije.',
    'store.co.name': 'Ime i prezime',
    'store.co.phone': 'Telefon',
    'store.co.address': 'Adresa (ulica i broj)',
    'store.co.city': 'Grad',
    'store.co.postal': 'Poštanski broj',
    'store.co.email': 'Email (opciono — za potvrdu porudžbine)',
    'store.co.note': 'Napomena (opciono)',
    'store.co.submit': 'Potvrdi porudžbinu',

    'store.done.title': 'Hvala na porudžbini!',
    'co.done.order': 'Porudžbina',

    // --- dynamic (JS t() keys) ---
    // common (main.js / store.js / shop.js)
    'common.sending': 'Šaljem…',
    'common.err.email': 'Unesi ispravnu email adresu.',
    'common.err.generic': 'Nešto je pošlo naopako. Pokušaj ponovo za koji trenutak.',
    'common.err.network': 'Greška u mreži. Pokušaj ponovo za koji trenutak.',

    // index: email capture + showcase (main.js)
    'capture.err.config': 'Prijave još nisu aktivne.',
    'capture.ok': 'Upisan si — javljamo ti se kad lansiramo.',
    'showcase.dot': 'Idi na snimak ekrana {n}',

    // ebooks: book modal + coaching form (store.js)
    'modal.buy': 'Kupi odmah',
    'modal.soon': 'Uskoro',
    'coach.err.name': 'Unesi svoje ime.',
    'coach.err.config': 'Prijave još nisu aktivne.',
    'coach.ok': 'Prijava primljena — javljam ti se u roku od 48 sati.',

    // store: catalog cards (shop.js)
    'store.soon': 'Uskoro',
    'store.add': 'Dodaj u korpu',
    'store.added': '✓ Dodato',

    // store: cart drawer (shop.js)
    'cart.empty': 'Tvoja korpa je prazna.',
    'cart.size': 'Veličina',
    'cart.each': ' po komadu',
    'cart.checkout': 'Poruči',
    'cart.dec': 'Smanji količinu',
    'cart.inc': 'Povećaj količinu',
    'cart.rm': 'Ukloni artikal',

    // store: checkout summary + flow (shop.js)
    'co.total': 'Ukupno',
    'co.rsd.suffix': ' — plaćaš kuriru',
    'co.freeship': 'Besplatna dostava',
    'co.err.fields': 'Popuni ime, telefon i adresu.',
    'co.err.config': 'Poručivanje još nije aktivno.',
    'co.status.placing': 'Šaljem porudžbinu…',
    'co.done.rsd': ' — plaćanje pouzećem',
    'co.done.note': 'Zvaćemo te na {phone} da potvrdimo porudžbinu i dogovorimo isporuku. Plaćaš kuriru kešom kad stigne — dostava je besplatna.',

    // ebooks: calculator (calc.js)
    'calc.loading.1': 'Analiziram tvoje podatke…',
    'calc.loading.2': 'Računam tvoje kalorije…',
    'calc.loading.3': 'Tražim tvoje planove…',
    'calc.bmi.under': 'Pothranjenost',
    'calc.bmi.normal': 'Normalna',
    'calc.bmi.over': 'Prekomerna',
    'calc.bmi.obese': 'Gojaznost',
    'calc.err.age': 'Unesi ispravne godine (14–90).',
    'calc.err.height': 'Unesi ispravnu visinu u cm (120–230).',
    'calc.err.weight': 'Unesi ispravnu težinu u kg (35–250).',
    'calc.note': 'Tvoj cilj je {t} kcal — uparen sa najbližim dostupnim planom ({l} kcal).',
    'calc.tag.training': 'Tvoj plan treninga',
    'calc.tag.nutrition': 'Tvoj plan ishrane',
    'calc.view': 'Detaljnije'
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
