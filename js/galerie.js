/* Galerie photos : ouverture plein écran, navigation clavier / swipe */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal__item'));
  if (!items.length) return;

  var box = document.createElement('div');
  box.className = 'lbx';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo du cabinet en grand');
  box.innerHTML =
    '<button class="lbx__btn lbx__close" type="button" aria-label="Fermer">×</button>' +
    '<button class="lbx__btn lbx__prev" type="button" aria-label="Photo précédente">‹</button>' +
    '<figure class="lbx__fig"><img class="lbx__img" alt=""><figcaption class="lbx__cap"><span data-lbx-cap></span><span class="lbx__count" data-lbx-count></span></figcaption></figure>' +
    '<button class="lbx__btn lbx__next" type="button" aria-label="Photo suivante">›</button>';
  document.body.appendChild(box);

  var img = box.querySelector('.lbx__img'), cap = box.querySelector('[data-lbx-cap]'), cnt = box.querySelector('[data-lbx-count]');
  var group = [], i = 0, last = null;

  function show() {
    var it = group[i], th = it.querySelector('img');
    img.src = it.getAttribute('data-full');
    img.alt = th.alt;
    cap.textContent = th.alt;
    cnt.textContent = (i + 1) + ' / ' + group.length;
    // précharge la suivante
    var n = group[(i + 1) % group.length]; if (n) { var p = new Image(); p.src = n.getAttribute('data-full'); }
  }
  function open(it) {
    var grid = it.closest('.gal__grid');
    group = Array.prototype.slice.call(grid.querySelectorAll('.gal__item'));
    i = group.indexOf(it); last = it;
    show(); box.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    box.querySelector('.lbx__close').focus();
  }
  function close() {
    box.classList.remove('is-open'); img.removeAttribute('src');
    document.documentElement.style.overflow = '';
    if (last) last.focus();
  }
  function go(d) { i = (i + d + group.length) % group.length; show(); }

  items.forEach(function (it) { it.addEventListener('click', function () { open(it); }); });
  box.querySelector('.lbx__close').addEventListener('click', close);
  box.querySelector('.lbx__prev').addEventListener('click', function () { go(-1); });
  box.querySelector('.lbx__next').addEventListener('click', function () { go(1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Tab') { // garde le focus dans la visionneuse
      var f = box.querySelectorAll('button'), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });
})();
