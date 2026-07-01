(function () {
  'use strict';

  // --- Nav solid-on-scroll ---
  var nav = document.querySelector('[data-nav]');
  var NAV_SOLID_OFFSET = 24;
  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle('is-solid', window.scrollY > NAV_SOLID_OFFSET);
  }
  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  // --- Scroll-reveal ---
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Showcase carousel ---
  var track = document.querySelector('[data-showcase-track]');
  var prevBtn = document.querySelector('[data-showcase-prev]');
  var nextBtn = document.querySelector('[data-showcase-next]');
  var dotsWrap = document.querySelector('[data-showcase-dots]');
  var slides = track ? Array.prototype.slice.call(track.children) : [];

  if (track && slides.length && dotsWrap) {
    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase__dot';
      dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
      dot.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    dots[0].classList.add('is-active');

    if ('IntersectionObserver' in window) {
      var dotObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var index = slides.indexOf(entry.target);
          if (entry.isIntersecting && index !== -1) {
            dots.forEach(function (d) { d.classList.remove('is-active'); });
            dots[index].classList.add('is-active');
          }
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach(function (slide) { dotObserver.observe(slide); });
    }

    function scrollByOne(dir) {
      var slideWidth = slides[0].getBoundingClientRect().width + 16;
      track.scrollBy({ left: dir * slideWidth, behavior: 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByOne(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByOne(1); });
  }

  // --- Email capture form ---
  var form = document.querySelector('[data-capture-form]');
  if (form) {
    var emailInput = form.querySelector('[data-capture-email]');
    var honeypot = form.querySelector('[data-capture-honeypot]');
    var status = document.querySelector('[data-capture-status]');
    var submitBtn = form.querySelector('[data-capture-submit]');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.dataset.kind = kind;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (honeypot && honeypot.value) {
        return;
      }
      var email = emailInput.value.trim();
      if (!EMAIL_RE.test(email)) {
        setStatus('Enter a valid email address.', 'error');
        return;
      }

      var config = window.VALENS_CONFIG || {};
      if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        setStatus('Signups are not configured yet.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending…', 'pending');

      fetch(config.SUPABASE_URL + '/rest/v1/newsletter_signups', {
        method: 'POST',
        headers: {
          apikey: config.SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + config.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email: email, source: 'landing' }),
      })
        .then(function (response) {
          if (response.ok || response.status === 409) {
            setStatus("You're in — we'll email you at launch.", 'success');
            form.reset();
          } else {
            setStatus('Something went wrong. Try again in a moment.', 'error');
          }
        })
        .catch(function () {
          setStatus('Network error. Try again in a moment.', 'error');
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
