/* ============================================================
   STANLEY IHEANYI — PORTFOLIO JS
   ============================================================ */

'use strict';

/* ── 1. Cursor glow ─────────────────────────────────────── */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function tick() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── 2. Navbar: scroll effect + active link ─────────────── */
(function () {
  const nav      = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // shrink / shadow on scroll
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // back-to-top button
    const backTop = document.getElementById('backTop');
    if (backTop) backTop.classList.toggle('show', window.scrollY > 400);

    // active nav link based on section in view
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-section') === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 3. Mobile menu ─────────────────────────────────────── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function open()  {
    btn.classList.add('open');
    menu.classList.add('open');
    menu.style.display = 'flex';
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { if (!menu.classList.contains('open')) menu.style.display = 'none'; }, 350);
  }

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  document.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', close));

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) close();
  });

  // init
  menu.style.display = 'none';
})();

/* ── 4. Scroll reveal ───────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = el.style.getPropertyValue('--delay') || '0s';
        setTimeout(() => el.classList.add('visible'), parseFloat(delay) * 1000);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
})();

/* ── 5. About tabs ──────────────────────────────────────── */
(function () {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active-tab');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active-tab');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(target);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
    });
  });
})();

/* ── 6. Skill bars animate on reveal ───────────────────── */
(function () {
  const bars = document.querySelectorAll('.bar-fill');
  const io   = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.getAttribute('data-width') + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();

/* ── 7. Counter animation (hero stats) ──────────────────── */
(function () {
  const counters = document.querySelectorAll('.count');
  const io       = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.getAttribute('data-target');
      const dur    = 1600;
      const step   = dur / target;
      let current  = 0;

      const timer = setInterval(() => {
        current++;
        el.textContent = current + '+';
        if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
      }, step);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ── 8. Typed text effect ───────────────────────────────── */
(function () {
  const el    = document.getElementById('typed-text');
  if (!el) return;
  const words = ['web Sites .', 'mobile apps.', 'UI/UX designs.', 'clean code.', 'great things.'];
  let wi = 0, ci = 0, deleting = false;
  const pause = 1600, speed = 90, delSpeed = 55;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, pause); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? delSpeed : speed);
  }
  type();
})();

/* ── 9. Portfolio filter ────────────────────────────────── */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'fadeIn .4s ease forwards';
        }
      });
    });
  });
})();

/* ── 10. Contact form validation ────────────────────────── */
(function () {
  const form    = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');
  const btnText = form.querySelector('.btn-text');
  const btnLoad = form.querySelector('.btn-loader');

  function validate(id, errId, test) {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el || !err) return true;
    const ok = test(el.value.trim());
    el.classList.toggle('error', !ok);
    err.textContent = ok ? '' : (id === 'email' ? 'Please enter a valid email.' : 'This field is required.');
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nameOk  = validate('name',    'nameError',    v => v.length > 1);
    const emailOk = validate('email',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const msgOk   = validate('message', 'messageError', v => v.length > 5);

    if (!nameOk || !emailOk || !msgOk) return;

    // Simulate sending
    btnText.hidden = true;
    btnLoad.hidden = false;

    setTimeout(() => {
      btnText.hidden = false;
      btnLoad.hidden = true;
      success.hidden = false;
      form.reset();
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 1600);
  });

  // Live validation clear
  ['name', 'email', 'message'].forEach(id => {
    const el  = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    if (el && err) {
      el.addEventListener('input', () => { el.classList.remove('error'); err.textContent = ''; });
    }
  });
})();

/* ── 11. Smooth scroll for anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── 12. Fade-in keyframe via JS ─────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`;
  document.head.appendChild(style);
})();
