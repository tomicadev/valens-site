(function () {
  'use strict';

  var form = document.querySelector('[data-calc-form]');
  if (!form) return;

  var I = window.VALENS_I18N || { t: function (k, f) { return f; } };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var NUTRITION_LEVELS = [1800, 2000, 2200, 2500, 2800, 3000];
  // Calorie adjustment per goal + recommended training program. Every goal maps
  // to a real training e-book so the calculator always returns a training +
  // nutrition pair. Cards are matched by a substring of their .book__title text
  // (see findBook), so each key below must stay in sync with a title on
  // ebooks.html — a typo silently drops the training card.
  var GOALS = {
    fatloss: { mult: 0.8, training: 'Mr. VALENS' },      // Mr. VALENS — 5-Day Hypertrophy
    muscle: { mult: 1.1, training: 'Apex PPL' },         // Apex PPL — 6-Day Push/Pull/Legs
    maintain: { mult: 1.0, training: 'PHUL' },           // PHUL — Power & Hypertrophy
    recomp: { mult: 0.9, training: 'PHUL' },             // PHUL — Power & Hypertrophy
    gain: { mult: 1.2, training: 'Iron Foundation' },    // Iron Foundation — 5×5 Strength
  };
  function loadingMsgs() {
    return [
      I.t('calc.loading.1', 'Analyzing your input…'),
      I.t('calc.loading.2', 'Calculating your calories…'),
      I.t('calc.loading.3', 'Matching your plans…'),
    ];
  }
  var CONFETTI_COLORS = ['#9B78D4', '#6F4DB3', '#C77DD8', '#B79BE6', '#FFFFFF'];

  var sexEl = form.querySelector('[data-calc-sex]');
  var ageEl = form.querySelector('[data-calc-age]');
  var heightEl = form.querySelector('[data-calc-height]');
  var weightEl = form.querySelector('[data-calc-weight]');
  var activityEl = form.querySelector('[data-calc-activity]');
  var submitEl = form.querySelector('[data-calc-submit]');
  var statusEl = form.querySelector('[data-calc-status]');
  var goalBtns = form.querySelectorAll('.calc__goal');

  var loadingEl = document.querySelector('[data-calc-loading]');
  var loadingMsgEl = document.querySelector('[data-calc-loading-msg]');
  var resultsEl = document.querySelector('[data-calc-results]');
  var bmiEl = document.querySelector('[data-calc-bmi]');
  var bmiCatEl = document.querySelector('[data-calc-bmi-cat]');
  var tdeeEl = document.querySelector('[data-calc-tdee]');
  var targetEl = document.querySelector('[data-calc-target]');
  var noteEl = document.querySelector('[data-calc-note]');
  var cardsEl = document.querySelector('[data-calc-cards]');
  var confettiEl = document.querySelector('[data-calc-confetti]');

  var goal = 'fatloss';
  var lastData = null;
  goalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      goal = btn.dataset.goal;
      goalBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-checked', b === btn ? 'true' : 'false');
      });
    });
  });

  function setStatus(message) {
    statusEl.textContent = message;
    statusEl.dataset.kind = message ? 'error' : '';
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return I.t('calc.bmi.under', 'Underweight');
    if (bmi < 25) return I.t('calc.bmi.normal', 'Normal');
    if (bmi < 30) return I.t('calc.bmi.over', 'Overweight');
    return I.t('calc.bmi.obese', 'Obese');
  }

  function nearestLevel(target) {
    return NUTRITION_LEVELS.reduce(function (best, level) {
      return Math.abs(level - target) < Math.abs(best - target) ? level : best;
    });
  }

  function findBook(titleKey) {
    var titles = document.querySelectorAll('.book__title');
    for (var i = 0; i < titles.length; i++) {
      if (titles[i].textContent.indexOf(titleKey) !== -1) return titles[i].closest('.book');
    }
    return null;
  }

  // Compact recommendation card: cloned cover + title + price, "View details"
  // opens the source card's existing modal (with its Buy button and LS url).
  function buildCard(book, tagText) {
    var card = document.createElement('article');
    card.className = 'book';

    var tag = document.createElement('span');
    tag.className = 'calc__tag';
    tag.textContent = tagText;
    card.appendChild(tag);

    var cover = book.querySelector('.book__cover');
    if (cover) card.appendChild(cover.cloneNode(true));

    var body = document.createElement('div');
    body.className = 'calc-card__body';
    var title = document.createElement('h3');
    title.className = 'book__title';
    title.textContent = book.querySelector('.book__title').textContent;
    body.appendChild(title);
    card.appendChild(body);

    var meta = document.createElement('div');
    meta.className = 'book__meta';
    var price = document.createElement('span');
    price.className = 'book__price';
    price.textContent = book.dataset.price || '';
    meta.appendChild(price);
    var open = document.createElement('button');
    open.type = 'button';
    open.className = 'btn-ghost';
    open.textContent = I.t('calc.view', 'View details');
    open.addEventListener('click', function () {
      var trigger = book.querySelector('[data-book-open]');
      if (trigger) trigger.click();
    });
    meta.appendChild(open);
    card.appendChild(meta);

    return card;
  }

  function fireConfetti() {
    if (reducedMotion || !confettiEl || !cardsEl) return;
    var calcBox = confettiEl.getBoundingClientRect();
    var cardsBox = cardsEl.getBoundingClientRect();
    var originX = cardsBox.left - calcBox.left + cardsBox.width / 2;
    var originY = cardsBox.top - calcBox.top + Math.min(cardsBox.height / 3, 120);

    for (var i = 0; i < 70; i++) {
      var piece = document.createElement('span');
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.left = originX + 'px';
      piece.style.top = originY + 'px';
      confettiEl.appendChild(piece);

      var angle = Math.random() * Math.PI * 2;
      var distance = 90 + Math.random() * 260;
      var dx = Math.cos(angle) * distance;
      var dy = Math.sin(angle) * distance * 0.6 - 120;
      var rotate = (Math.random() - 0.5) * 720;
      var duration = 1300 + Math.random() * 900;

      var anim = piece.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + rotate + 'deg)', opacity: 1, offset: 0.55 },
          { transform: 'translate(' + dx * 1.15 + 'px, ' + (dy + 320) + 'px) rotate(' + rotate * 1.5 + 'deg)', opacity: 0 },
        ],
        { duration: duration, easing: 'cubic-bezier(0.17, 0.67, 0.3, 1)', fill: 'forwards' }
      );
      anim.onfinish = (function (el) {
        return function () { el.remove(); };
      })(piece);
    }
  }

  function showResults(data, rerender) {
    lastData = data;
    bmiEl.textContent = data.bmi.toFixed(1);
    bmiCatEl.textContent = bmiCategory(data.bmi);
    tdeeEl.textContent = String(data.tdee);
    targetEl.textContent = String(data.target);

    if (Math.abs(data.target - data.level) > 150) {
      noteEl.textContent = I.t('calc.note', 'Your target is {t} kcal — matched to the closest available plan ({l} kcal).').replace('{t}', data.target).replace('{l}', data.level);
      noteEl.hidden = false;
    } else {
      noteEl.hidden = true;
    }

    cardsEl.innerHTML = '';
    var trainingBook = findBook(GOALS[goal].training);
    var nutritionBook = findBook(data.level + ' kcal');
    if (trainingBook) cardsEl.appendChild(buildCard(trainingBook, I.t('calc.tag.training', 'Your training match')));
    if (nutritionBook) cardsEl.appendChild(buildCard(nutritionBook, I.t('calc.tag.nutrition', 'Your nutrition match')));

    resultsEl.hidden = false;
    if (!rerender) {
      resultsEl.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      fireConfetti();
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var age = parseInt(ageEl.value, 10);
    var height = parseInt(heightEl.value, 10);
    var weight = parseFloat(weightEl.value);
    if (!age || age < 14 || age > 90) return setStatus(I.t('calc.err.age', 'Enter a valid age (14–90).'));
    if (!height || height < 120 || height > 230) return setStatus(I.t('calc.err.height', 'Enter a valid height in cm (120–230).'));
    if (!weight || weight < 35 || weight > 250) return setStatus(I.t('calc.err.weight', 'Enter a valid weight in kg (35–250).'));
    setStatus('');

    // Mifflin-St Jeor BMR → TDEE → goal-adjusted daily target.
    var bmr = 10 * weight + 6.25 * height - 5 * age + (sexEl.value === 'm' ? 5 : -161);
    var tdee = Math.round((bmr * parseFloat(activityEl.value)) / 10) * 10;
    var target = Math.round((tdee * GOALS[goal].mult) / 10) * 10;
    var data = {
      bmi: weight / Math.pow(height / 100, 2),
      tdee: tdee,
      target: target,
      level: nearestLevel(target),
    };

    resultsEl.hidden = true;
    if (reducedMotion) return showResults(data);

    submitEl.disabled = true;
    loadingEl.hidden = false;
    var MSGS = loadingMsgs();
    loadingMsgEl.textContent = MSGS[0];
    loadingEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    var step = 0;
    var ticker = setInterval(function () {
      step++;
      if (step < MSGS.length) {
        loadingMsgEl.textContent = MSGS[step];
        return;
      }
      clearInterval(ticker);
      loadingEl.hidden = true;
      submitEl.disabled = false;
      showResults(data);
    }, 700);
  });

  document.addEventListener('valens:langchange', function () {
    if (lastData && !resultsEl.hidden) showResults(lastData, true);
  });
})();
