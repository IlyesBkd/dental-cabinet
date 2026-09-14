/* =====================================================================
   nav.js — menu mobile partagé par les six pages.
   Le markup (bouton .navburger + panneau .mobilenav) vit dans le HTML :
   sans JS les liens restent lisibles et indexables, le script n'ajoute
   que l'ouverture/fermeture.
   ===================================================================== */
(function () {
  'use strict';

  var D = document;
  var burger = D.querySelector('.navburger');
  var panel = D.getElementById('mobilenav');
  if (!burger || !panel) return;

  var closeBtn = panel.querySelector('.mobilenav__close');
  var lastFocus = null;

  /* ---------- page courante ---------- */
  function markCurrent() {
    var here = location.pathname.split('/').pop() || 'index.html';
    var links = panel.querySelectorAll('.mobilenav__list a');
    var i, href;
    for (i = 0; i < links.length; i++) {
      href = (links[i].getAttribute('href') || '').split('#')[0].split('/').pop();
      if (href && href === here) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
  }

  /* ---------- verrou de scroll ----------
     Lenis pilote le scroll de la page : il faut l'arrêter, sinon la
     molette/le doigt continuent de défiler derrière le panneau. */
  function lockScroll(on) {
    D.documentElement.classList.toggle('nav-open', on);
    var l = window.__lenis;
    if (l) { if (on) { l.stop(); } else { l.start(); } }
  }

  function isOpen() { return panel.getAttribute('data-open') === 'true'; }

  function open() {
    if (isOpen()) return;
    lastFocus = D.activeElement;
    panel.setAttribute('data-open', 'true');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    lockScroll(true);
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!isOpen()) return;
    panel.setAttribute('data-open', 'false');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    else burger.focus();
  }

  burger.addEventListener('click', function () { isOpen() ? close() : open(); });
  if (closeBtn) closeBtn.addEventListener('click', close);

  /* clic sur un lien : on ferme avant la navigation (et pour les ancres) */
  panel.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (a) close();
    /* clic sur le fond hors panneau */
    else if (e.target === panel) close();
  });

  /* Échap ferme, et le focus reste piégé dans le panneau ouvert */
  D.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var f = panel.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && D.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && D.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* repasser en desktop pendant que le menu est ouvert ne doit pas
     laisser la page verrouillée */
  var mq = window.matchMedia('(min-width: 1041px)');
  var onMQ = function (e) { if (e.matches) close(); };
  if (mq.addEventListener) mq.addEventListener('change', onMQ);
  else if (mq.addListener) mq.addListener(onMQ);

  markCurrent();
})();
