(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- Nav solid-on-scroll ---
  var nav = document.querySelector('[data-nav]');
  var NAV_SOLID_OFFSET = 24;
  function updateNavState() {
    if (!nav) return;
    nav.classList.toggle('is-solid', window.scrollY > NAV_SOLID_OFFSET);
  }
  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  // --- Mobile nav (hamburger) ---
  var navToggle = document.querySelector('[data-nav-toggle]');
  if (nav && navToggle) {
    var navMenu = document.querySelector('[data-nav-menu]');
    var closeNav = function () {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (navMenu) {
      navMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeNav);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
        closeNav();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 720 && nav.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  // --- Scroll-reveal (with stagger groups) ---
  var revealEls = document.querySelectorAll('[data-reveal]');
  document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
    var kids = group.querySelectorAll('[data-reveal]');
    kids.forEach(function (kid, i) {
      kid.style.transitionDelay = (i * 90) + 'ms';
      kid.addEventListener('transitionend', function clear(event) {
        if (event.target !== kid || event.propertyName !== 'transform') return;
        kid.style.transitionDelay = '';
        kid.removeEventListener('transitionend', clear);
      });
    });
  });
  if ('IntersectionObserver' in window && revealEls.length && !reducedMotion) {
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

  // --- Showcase carousel: center focus, dots, buttons, drag ---
  var track = document.querySelector('[data-showcase-track]');
  var prevBtn = document.querySelector('[data-showcase-prev]');
  var nextBtn = document.querySelector('[data-showcase-next]');
  var dotsWrap = document.querySelector('[data-showcase-dots]');
  var slides = track ? Array.prototype.slice.call(track.children) : [];

  if (track && slides.length && dotsWrap) {
    var currentIndex = -1;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase__dot';
      dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
      dot.addEventListener('click', function () { scrollToIndex(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function scrollToIndex(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      slides[i].scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    function updateCenter() {
      var r = track.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var best = 0;
      var bestDist = Infinity;
      slides.forEach(function (slide, i) {
        var sr = slide.getBoundingClientRect();
        var d = Math.abs(sr.left + sr.width / 2 - cx);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best !== currentIndex) {
        currentIndex = best;
        slides.forEach(function (s, i) { s.classList.toggle('is-center', i === best); });
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === best); });
      }
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { updateCenter(); ticking = false; });
      }
    }, { passive: true });
    window.addEventListener('resize', updateCenter);
    updateCenter();

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollToIndex(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollToIndex(currentIndex + 1); });

    // Drag-to-scroll (mouse only; touch keeps native scrolling)
    if (finePointer) {
      var dragState = null;
      track.addEventListener('dragstart', function (e) { e.preventDefault(); });
      track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        dragState = { startX: e.clientX, startScroll: track.scrollLeft };
        track.classList.add('is-dragging');
        track.setPointerCapture(e.pointerId);
      });
      track.addEventListener('pointermove', function (e) {
        if (!dragState) return;
        track.scrollLeft = dragState.startScroll - (e.clientX - dragState.startX);
      });
      var endDrag = function () {
        if (!dragState) return;
        dragState = null;
        track.classList.remove('is-dragging');
      };
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
    }
  }

  // --- Hero phone 3D tilt (desktop, motion allowed) ---
  var tiltEl = document.querySelector('[data-tilt]');
  var hero = document.querySelector('.hero');
  if (tiltEl && hero && finePointer && !reducedMotion) {
    var targetX = 0, targetY = 0, curX = 0, curY = 0, tiltRaf = null;
    var tiltStep = function () {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      tiltEl.style.transform =
        'perspective(900px) rotateX(' + curY.toFixed(2) + 'deg) rotateY(' + curX.toFixed(2) + 'deg)';
      if (Math.abs(targetX - curX) > 0.01 || Math.abs(targetY - curY) > 0.01) {
        tiltRaf = requestAnimationFrame(tiltStep);
      } else {
        tiltRaf = null;
      }
    };
    var kickTilt = function () { if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltStep); };
    hero.addEventListener('pointermove', function (e) {
      var r = tiltEl.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      targetX = Math.max(-1, Math.min(1, dx)) * 7;
      targetY = Math.max(-1, Math.min(1, -dy)) * 7;
      kickTilt();
    });
    hero.addEventListener('pointerleave', function () {
      targetX = 0;
      targetY = 0;
      kickTilt();
    });
  }

  // --- Feature card cursor spotlight (desktop) ---
  if (finePointer) {
    document.querySelectorAll('.feature-card').forEach(function (card) {
      var spotRaf = null, px = 0, py = 0;
      card.addEventListener('pointermove', function (e) {
        px = e.clientX;
        py = e.clientY;
        if (spotRaf) return;
        spotRaf = requestAnimationFrame(function () {
          spotRaf = null;
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (px - r.left) + 'px');
          card.style.setProperty('--my', (py - r.top) + 'px');
        });
      });
    });
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
