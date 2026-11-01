(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · Rellena fotos y videos desde data-src */
  document.querySelectorAll('.ph[data-src]').forEach(function (ph) {
    var src = ph.getAttribute('data-src');
    if (!src) return;
    var inner = ph.querySelector('.ph-in');
    if (!inner) return;
    var el;
    if (/\.(mp4|webm|mov)$/i.test(src)) {
      el = document.createElement('video');
      el.src = src; el.muted = true; el.loop = true; el.autoplay = true;
      el.setAttribute('playsinline', ''); el.preload = 'metadata'; el.poster = src.replace(/\.\w+$/, '.jpg');
      var b = document.createElement('button'); b.className = 'snd'; b.type = 'button'; b.textContent = 'Sonido';
      b.addEventListener('click', function (e) { e.preventDefault(); el.muted = !el.muted; b.textContent = el.muted ? 'Sonido' : 'Silenciar'; });
      ph.appendChild(b);
      el.addEventListener('error', function () { el.remove(); b.remove(); ph.classList.remove('filled'); });
      el.addEventListener('loadeddata', function () { var a = ph.closest('a.reel-a'); if (a) { a.removeAttribute('href'); a.removeAttribute('target'); var c = a.querySelector('.reel-chip'); if (c) c.remove(); } });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { var p = el.play(); if (p && p.catch) p.catch(function () {}); } else el.pause(); }); }, { threshold: .25 }).observe(ph);
    } else {
      el = document.createElement('img');
      el.src = src; el.alt = ph.getAttribute('data-label') || '';
      el.addEventListener('error', function () { el.remove(); ph.classList.remove('filled'); });
    }
    inner.appendChild(el);
    ph.classList.add('filled');
  });

  /* 1b · Marca GW Studios en cada sección */
  document.querySelectorAll('section.tab').forEach(function (sec) {
    var m = document.createElement('img'); m.className = 'gw-corner'; m.src = (document.body.getAttribute('data-base')||'') + 'img/gw-mark.png'; m.alt = '';
    m.addEventListener('error', function () { m.remove(); });
    sec.appendChild(m);
  });

  /* 1c · Menú de contacto (WhatsApp / Instagram) */
  var chooses = document.querySelectorAll('.choose');
  function closeAll(except) { chooses.forEach(function (c) { if (c !== except) { c.classList.remove('open'); c.querySelector('button').setAttribute('aria-expanded', 'false'); } }); }
  chooses.forEach(function (c) {
    var btn = c.querySelector('button');
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); closeAll(c);
      var o = c.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* 2 · Enlaces internos con scroll suave */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var t = id ? document.getElementById(id) : document.body;
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  document.documentElement.classList.add('js');
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* 3 · Barra de progreso */
  var bar = document.getElementById('progress');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { bar.style.width = (s.progress * 100) + '%'; } });

  /* 4 · Entrada de la portada */
  var titleEl = document.querySelector('.hero-title .chars');
  var txt = titleEl.textContent;
  titleEl.textContent = '';
  titleEl.setAttribute('aria-label', txt);
  Array.from(txt).forEach(function (c) {
    var s = document.createElement('span');
    s.className = 'ch'; s.textContent = c; s.setAttribute('aria-hidden', 'true');
    titleEl.appendChild(s);
  });
  var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.awning', { yPercent: -100, duration: 1.2, ease: 'bounce.out' }, 0)
    .from('.hero-meta > *', { y: -14, opacity: 0, stagger: .08, duration: .9 }, .2)
    .from('.hero-title .ch', { yPercent: 120, rotateX: -80, opacity: 0, transformOrigin: '50% 100%', stagger: .055, duration: 1.3 }, .3)
    .fromTo('.hero .arch', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' }, .5)
    .from('.hero .badge', { scale: 0, rotate: -200, opacity: 0, duration: 1.4, ease: 'back.out(1.6)' }, 1.1)
    .from('.hero .polaroid', { y: 90, opacity: 0, duration: 1.2 }, 1)
    .from('[data-hero]', { y: 36, opacity: 0, stagger: .12, duration: 1 }, .9);

  /* Parallax de ratón en la portada */
  if (fine) {
    var hero = document.querySelector('.hero');
    var layers = Array.from(hero.querySelectorAll('[data-depth]')).map(function (el) {
      return { d: parseFloat(el.getAttribute('data-depth')), qx: gsap.quickTo(el, 'x', { duration: .9, ease: 'power3' }), qy: gsap.quickTo(el, 'y', { duration: .9, ease: 'power3' }) };
    });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      layers.forEach(function (l) { l.qx(-x * l.d); l.qy(-y * l.d); });
    });
  }

  /* 5 · Revelados al hacer scroll */
  document.querySelectorAll('[data-r]').forEach(function (el) {
    var t = el.getAttribute('data-r');
    var v = { opacity: 0, duration: 1.1, ease: 'power3.out', delay: parseFloat(el.getAttribute('data-d') || 0), clearProps: 'transform,opacity' };
    if (t === 'up') v.y = 56;
    if (t === 'left') v.x = -70;
    if (t === 'right') v.x = 70;
    if (t === 'scale') { v.scale = .6; v.rotate = -40; }
    if (t === 'rise') { v.y = 80; v.rotateX = 22; v.transformPerspective = 900; v.transformOrigin = '50% 100%'; }
    v.scrollTrigger = { trigger: el, start: 'top 90%', once: true };
    gsap.from(el, v);
  });
  document.querySelectorAll('[data-stagger]').forEach(function (g) {
    gsap.from(g.children, { y: 46, opacity: 0, duration: 1, ease: 'power3.out', stagger: .1, clearProps: 'transform,opacity', scrollTrigger: { trigger: g, start: 'top 88%', once: true } });
  });

  /* 6 · Subrayados ondulados que se dibujan */
  document.querySelectorAll('.h2 em, [data-ul]').forEach(function (el) {
    gsap.fromTo(el, { '--u': '100%' }, { '--u': '0%', duration: 1.2, ease: 'power2.inOut', delay: .35, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  /* 7 · Stickers: entrada con rebote y parallax */
  document.querySelectorAll('.stk, .bst').forEach(function (el) {
    gsap.from(el, { scale: 0, rotate: -140, opacity: 0, duration: 1.3, ease: 'elastic.out(1,.55)', delay: Math.random() * .35,
      scrollTrigger: { trigger: el, start: 'top 96%', once: true } });
  });
  document.querySelectorAll('[data-speed]').forEach(function (el) {
    gsap.to(el, { y: parseFloat(el.getAttribute('data-speed')), ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .8 } });
  });

  /* 8 · Parallax interno de fotos y videos */
  document.querySelectorAll('.ph .ph-in').forEach(function (inner) {
    gsap.fromTo(inner, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: inner.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* 9 · Palabra gigante que viaja con el scroll */
  document.querySelectorAll('[data-giant]').forEach(function (el) {
    gsap.fromTo(el, { xPercent: 4 }, { xPercent: -52, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });

  /* 10 · Polaroids que caen en su sitio */
  document.querySelectorAll('[data-pol]').forEach(function (p, i) {
    gsap.from(p, { rotation: (i % 2 ? -1 : 1) * 14, y: 110, opacity: 0, ease: 'none', scrollTrigger: { trigger: p, start: 'top 96%', end: 'top 55%', scrub: .8 } });
  });

  /* 11 · Fotos redondas que giran */
  document.querySelectorAll('.sticker .ph').forEach(function (s) {
    gsap.to(s, { rotation: 360, ease: 'none', scrollTrigger: { trigger: '#experiencia', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  /* 12 · Contadores */
  document.querySelectorAll('.count').forEach(function (el) {
    var to = parseFloat(el.getAttribute('data-to'));
    var o = { v: 0 };
    gsap.to(o, { v: to, duration: 2.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onStart: function () { el.textContent = '0'; }, onUpdate: function () { el.textContent = Math.round(o.v); }, onComplete: function () { el.textContent = to; } });
  });

  /* 13 · Credencial 3D */
  var scene = document.querySelector('.cred-scene');
  var cred = document.querySelector('.cred');
  if (scene && cred) {
    gsap.to(cred, { rotation: 2.5, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true });
    scene.addEventListener('pointermove', function (e) {
      var r = scene.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(cred, { rotateY: x * 36, rotateX: -y * 20, transformPerspective: 900, duration: .6, ease: 'power2.out' });
    });
    scene.addEventListener('pointerleave', function () { gsap.to(cred, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1,.5)' }); });
    gsap.from(cred, { rotateX: -70, y: -60, opacity: 0, transformPerspective: 900, duration: 1.6, ease: 'elastic.out(1,.6)', scrollTrigger: { trigger: scene, start: 'top 80%', once: true } });
  }

  /* 14 · Láminas que suben con ligera inclinación 3D */
  document.querySelectorAll('.tab').forEach(function (sec) {
    gsap.from(sec, { rotateX: 3, transformPerspective: 1600, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: { trigger: sec, start: 'top 100%', end: 'top 55%', scrub: true } });
  });

  /* 15 · Tarjetas con inclinación 3D al pasar el cursor */
  if (fine) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(el, { rotateY: x * 10, rotateX: -y * 10, y: -6, transformPerspective: 800, duration: .4, ease: 'power2.out', overwrite: 'auto' });
      });
      el.addEventListener('pointerleave', function () { gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: .6, ease: 'power3.out', overwrite: 'auto' }); });
    });

    /* Botones magnéticos */
    document.querySelectorAll('.pill').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3, ease: 'power2.out' });
      });
      b.addEventListener('pointerleave', function () { gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }); });
    });

    /* Rastro de destellos */
    var trail = document.getElementById('trail');
    var last = 0;
    var cols = ['#e0a4b0', '#ffd7e7', '#8fadd9', '#ffe58a'];
    window.addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (now - last < 55) return;
      last = now;
      var s = document.createElement('span');
      var c = cols[Math.floor(Math.random() * cols.length)];
      var size = 9 + Math.random() * 11;
      s.style.cssText = 'left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:' + size + 'px;height:' + size + 'px';
      s.innerHTML = '<svg viewBox="0 0 100 100" style="--a:' + c + '"><use href="#s-spark"/></svg>';
      trail.appendChild(s);
      gsap.fromTo(s, { scale: .3, opacity: 1, rotate: 0 }, { scale: 1, opacity: 0, rotate: (Math.random() - .5) * 200, x: (Math.random() - .5) * 40, y: 26 + Math.random() * 34, duration: .9 + Math.random() * .4, ease: 'power2.out', onComplete: function () { s.remove(); } });
    });
  }

  /* 16 · Confeti al pulsar un botón */
  var confCols = ['#7c0116', '#e0a4b0', '#ffd7e7', '#fffde9', '#8fadd9', '#ffe58a'];
  document.querySelectorAll('.pill').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = b.getBoundingClientRect();
      var ox = r.left + r.width / 2, oy = r.top + r.height / 2;
      for (var i = 0; i < 26; i++) {
        var p = document.createElement('i');
        var sz = 6 + Math.random() * 8;
        p.className = 'confetti-bit';
        p.style.cssText = 'left:' + ox + 'px;top:' + oy + 'px;width:' + sz + 'px;height:' + (Math.random() > .5 ? sz : sz * .5) + 'px;background:' + confCols[i % confCols.length] + ';border-radius:' + (Math.random() > .5 ? '50%' : '2px');
        document.body.appendChild(p);
        (function (el) {
          var dx = (Math.random() - .5) * 340, up = 70 + Math.random() * 130;
          gsap.timeline({ onComplete: function () { el.remove(); } })
            .to(el, { x: dx * .6, y: -up, rotation: Math.random() * 360, duration: .45, ease: 'power2.out' })
            .to(el, { x: dx, y: 220 + Math.random() * 120, rotation: '+=360', opacity: 0, duration: 1, ease: 'power1.in' });
        })(p);
      }
    });
  });

  /* 17 · Las marquesinas aceleran con el scroll */
  window.addEventListener('load', function () {
    var anims = [];
    document.querySelectorAll('.mq-track, .film-track').forEach(function (t) {
      var a = t.getAnimations && t.getAnimations()[0];
      if (a) anims.push(a);
    });
    if (!anims.length) return;
    var rate = 1;
    ScrollTrigger.create({ onUpdate: function (s) { rate = Math.max(rate, 1 + Math.min(Math.abs(s.getVelocity()) / 400, 7)); } });
    gsap.ticker.add(function () {
      rate += (1 - rate) * .06;
      anims.forEach(function (a) { a.updatePlaybackRate(rate); });
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { ScrollTrigger.refresh(); }); }
})();
