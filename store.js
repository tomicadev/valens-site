(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var config = window.VALENS_CONFIG || {};

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
    var notifyForm = modal.querySelector('[data-notify-form]');
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
        buy.textContent = 'Buy now';
        modalAction.appendChild(buy);
        notifyForm.hidden = true;
      } else {
        var soon = document.createElement('button');
        soon.type = 'button';
        soon.className = 'btn-pill';
        soon.disabled = true;
        soon.textContent = 'Coming soon';
        modalAction.appendChild(soon);
        notifyForm.hidden = false;
        setStatus(notifyForm.querySelector('[data-notify-status]'), '', 'idle');
      }

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

    // --- Notify-me (coming-soon books) → newsletter_signups with source 'store' ---
    if (notifyForm) {
      var notifyEmail = notifyForm.querySelector('[data-notify-email]');
      var notifySubmit = notifyForm.querySelector('[data-notify-submit]');
      var notifyStatus = notifyForm.querySelector('[data-notify-status]');

      notifyForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var email = notifyEmail.value.trim();
        if (!EMAIL_RE.test(email)) {
          setStatus(notifyStatus, 'Enter a valid email address.', 'error');
          return;
        }
        if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
          setStatus(notifyStatus, 'Signups are not configured yet.', 'error');
          return;
        }
        notifySubmit.disabled = true;
        setStatus(notifyStatus, 'Sending…', 'pending');
        supabasePost('/rest/v1/newsletter_signups', { email: email, source: (modal && modal.dataset.notifySource) || 'store' })
          .then(function (response) {
            if (response.ok || response.status === 409) {
              setStatus(notifyStatus, "You're on the list — we'll email you at launch.", 'success');
              notifyForm.reset();
            } else {
              setStatus(notifyStatus, 'Something went wrong. Try again in a moment.', 'error');
            }
          })
          .catch(function () {
            setStatus(notifyStatus, 'Network error. Try again in a moment.', 'error');
          })
          .finally(function () {
            notifySubmit.disabled = false;
          });
      });
    }
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
        setStatus(coachStatus, 'Enter your name.', 'error');
        return;
      }
      if (!EMAIL_RE.test(email)) {
        setStatus(coachStatus, 'Enter a valid email address.', 'error');
        return;
      }
      if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        setStatus(coachStatus, 'Applications are not configured yet.', 'error');
        return;
      }

      coachSubmit.disabled = true;
      setStatus(coachStatus, 'Sending…', 'pending');

      supabasePost('/rest/v1/coaching_requests', {
        name: name,
        email: email,
        message: message || null,
      })
        .then(function (response) {
          if (response.ok) {
            setStatus(coachStatus, "Application received — I'll get back to you within 48 hours.", 'success');
            coachForm.reset();
          } else {
            setStatus(coachStatus, 'Something went wrong. Try again in a moment.', 'error');
          }
        })
        .catch(function () {
          setStatus(coachStatus, 'Network error. Try again in a moment.', 'error');
        })
        .finally(function () {
          coachSubmit.disabled = false;
        });
    });
  }
})();
