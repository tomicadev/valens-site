(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var config = window.VALENS_CONFIG || {};
  var I = window.VALENS_I18N || { t: function (k, f) { return f; } };
  var T = window.VALENS_TRACK || function () {};

  // GA4 item for an e-book card. Identity comes from .book__cover-title, which the
  // dictionary deliberately leaves untranslated ("Mr. VALENS", "1800 kcal") — the
  // .book__title does get translated, so reading that would split one product into
  // two names depending on the visitor's language.
  function bookItem(book) {
    var mark = book.querySelector('.book__cover-title');
    var id = mark ? mark.textContent.trim() : '';
    var price = (book.dataset.price || '').match(/[\d.]+/);
    return {
      item_id: id,
      item_name: id,
      item_category: /kcal/i.test(id) ? 'Nutrition e-book' : 'Training e-book',
      price: price ? parseFloat(price[0]) : undefined,
      quantity: 1
    };
  }

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message;
    el.dataset.kind = kind;
  }

  function supabasePost(path, body) {
    return fetch(config.SUPABASE_URL + path, {
      method: 'POST',
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + config.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body),
    });
  }

  // --- Book detail modal ---
  var modal = document.querySelector('[data-modal]');
  if (modal) {
    var panel = modal.querySelector('.modal__panel');
    var modalCover = modal.querySelector('[data-modal-cover]');
    var modalTitle = modal.querySelector('[data-modal-title]');
    var modalContent = modal.querySelector('[data-modal-content]');
    var modalPrice = modal.querySelector('[data-modal-price]');
    var modalAction = modal.querySelector('[data-modal-action]');
    var closeBtn = modal.querySelector('.modal__close');
    var lastFocus = null;

    var FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

    function onKeydown(e) {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key !== 'Tab') return;
      var els = Array.prototype.filter.call(
        panel.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!els.length) return;
      var first = els[0];
      var last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function openModal(book, trigger) {
      lastFocus = trigger;
      var cover = book.querySelector('.book__cover');
      modalCover.innerHTML = '';
      if (cover) modalCover.appendChild(cover.cloneNode(true));
      modalTitle.textContent = book.querySelector('.book__title').textContent;
      modalPrice.textContent = book.dataset.price || '';
      var extra = book.querySelector('.book__extra');
      modalContent.innerHTML = extra ? extra.innerHTML : '';

      modalAction.innerHTML = '';
      var url = book.dataset.lsUrl;
      if (url) {
        var buy = document.createElement('a');
        buy.className = 'btn-pill lemonsqueezy-button';
        buy.href = url;
        buy.rel = 'noopener';
        buy.textContent = I.t('modal.buy', 'Buy now');
        // Checkout happens on Lemon Squeezy, so this is the last step we can see:
        // intent, not a completed purchase. Real revenue needs an LS webhook.
        buy.addEventListener('click', function () {
          var it = bookItem(book);
          T('begin_checkout', { currency: 'EUR', value: it.price, items: [it] });
        });
        modalAction.appendChild(buy);
      } else {
        var soon = document.createElement('button');
        soon.type = 'button';
        soon.className = 'btn-pill';
        soon.disabled = true;
        soon.textContent = I.t('modal.soon', 'Coming soon');
        modalAction.appendChild(soon);
      }

      var item = bookItem(book);
      T('view_item', { currency: 'EUR', value: item.price, items: [item] });

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeydown);
      closeBtn.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-book-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var book = btn.closest('.book');
        if (book) openModal(book, btn);
      });
    });
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

  }

  // --- Coaching application form → coaching_requests ---
  var coachForm = document.querySelector('[data-coach-form]');
  if (coachForm) {
    var coachName = coachForm.querySelector('[data-coach-name]');
    var coachEmail = coachForm.querySelector('[data-coach-email]');
    var coachMessage = coachForm.querySelector('[data-coach-message]');
    var coachHoneypot = coachForm.querySelector('[data-coach-honeypot]');
    var coachSubmit = coachForm.querySelector('[data-coach-submit]');
    var coachStatus = coachForm.querySelector('[data-coach-status]');

    coachForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (coachHoneypot && coachHoneypot.value) {
        return;
      }
      var name = coachName.value.trim();
      var email = coachEmail.value.trim();
      var message = coachMessage.value.trim();
      if (!name) {
        setStatus(coachStatus, I.t('coach.err.name', 'Enter your name.'), 'error');
        return;
      }
      if (!EMAIL_RE.test(email)) {
        setStatus(coachStatus, I.t('common.err.email', 'Enter a valid email address.'), 'error');
        return;
      }
      if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        setStatus(coachStatus, I.t('coach.err.config', 'Applications are not configured yet.'), 'error');
        return;
      }

      coachSubmit.disabled = true;
      setStatus(coachStatus, I.t('common.sending', 'Sending…'), 'pending');

      supabasePost('/rest/v1/coaching_requests', {
        name: name,
        email: email,
        message: message || null,
      })
        .then(function (response) {
          if (response.ok) {
            setStatus(coachStatus, I.t('coach.ok', "Application received — I'll get back to you within 48 hours."), 'success');
            T('generate_lead', { method: 'coaching_form' });
            coachForm.reset();
          } else {
            setStatus(coachStatus, I.t('common.err.generic', 'Something went wrong. Try again in a moment.'), 'error');
          }
        })
        .catch(function () {
          setStatus(coachStatus, I.t('common.err.network', 'Network error. Try again in a moment.'), 'error');
        })
        .finally(function () {
          coachSubmit.disabled = false;
        });
    });
  }
})();
