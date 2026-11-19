/* Consent Mode v2 + the cookie banner, and the one tracking helper the rest of
   the site calls. This file is loaded SYNCHRONOUSLY in <head>, before the
   Google tag: the consent default has to be in the dataLayer before the tag can
   store anything, otherwise the denied state arrives too late to matter. */
(function () {
  'use strict';

  // Read synchronously: document.currentScript is null once we are in a callback.
  // A page that only needs the denied-by-default state (e.g. the unsubscribe
  // confirmation, which ships no stylesheet) opts out of the banner with
  // <script src="consent.js" data-no-banner>.
  var me = document.currentScript;
  var wantsBanner = !(me && me.hasAttribute('data-no-banner'));

  var KEY = 'valens_consent';            // 'granted' | 'denied'
  var POLICY = 'https://tomicadev.github.io/valens-legal/privacy-policy.html';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // ---- Consent Mode v2 ------------------------------------------------------
  // Everything denied up front. functionality/security are the site working
  // (cart, language choice) rather than tracking, so they are not gated.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  if (read() === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });

  function decide(value) {
    var granted = value === 'granted';
    write(granted ? 'granted' : 'denied');
    gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    if (el) { el.remove(); el = null; }
  }

  // ---- event helper used by shop.js / store.js / calc.js / main.js ----------
  // Safe to call either way: with consent denied, Consent Mode sends cookieless
  // pings and stores nothing, so callers never have to check the state.
  window.VALENS_TRACK = function (name, params) {
    try { gtag('event', name, params || {}); } catch (e) {}
  };

  window.VALENS_CONSENT = {
    state: function () { return read() || 'unset'; },
    set: decide
  };

  // ---- banner ---------------------------------------------------------------
  var el = null;

  function t(key, fallback) {
    var I = window.VALENS_I18N;
    return I && I.t ? I.t(key, fallback) : fallback;
  }

  function render() {
    if (!el) return;
    el.setAttribute('aria-label', t('consent.aria', 'Cookie consent'));
    el.querySelector('[data-consent-text]').textContent =
      t('consent.text', 'We use analytics to see what works on the site. No ad tracking.');
    el.querySelector('[data-consent-more]').textContent = t('consent.more', 'Privacy');
    el.querySelector('[data-consent-decline]').textContent = t('consent.decline', 'Decline');
    el.querySelector('[data-consent-accept]').textContent = t('consent.accept', 'Accept');
  }

  function build() {
    if (read()) return;                    // already answered on a previous visit
    el = document.createElement('div');
    el.className = 'consent';
    el.setAttribute('role', 'region');
    el.innerHTML =
      '<p class="consent__text" data-consent-text></p>' +
      '<div class="consent__actions">' +
        '<a class="consent__more" data-consent-more href="' + POLICY + '" target="_blank" rel="noopener"></a>' +
        '<button type="button" class="btn-ghost" data-consent-decline></button>' +
        '<button type="button" class="btn-pill" data-consent-accept></button>' +
      '</div>';
    document.body.appendChild(el);
    render();
    el.querySelector('[data-consent-accept]').addEventListener('click', function () { decide('granted'); });
    el.querySelector('[data-consent-decline]').addEventListener('click', function () { decide('denied'); });
    document.addEventListener('valens:langchange', render);
  }

  if (!wantsBanner) return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
