// Shared by index.html and every page in /projects
(function () {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Theme toggle (remembered across pages)
  const label = $('#themeToggle .label');
  function setTheme(t) {
    root.dataset.theme = t;
    if (label) label.textContent = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  setTheme(saved === 'pink' ? 'pink' : 'blue');
  const toggle = $('#themeToggle');
  if (toggle) toggle.addEventListener('click', () => setTheme(root.dataset.theme === 'blue' ? 'pink' : 'blue'));

  // Cursor glow
  window.addEventListener('pointermove', e => {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
  });

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Scroll progress bar
  const bar = $('#progress');
  if (bar) {
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  // Card tilt
  if (matchMedia('(hover: hover)').matches) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Project filter chips
  $$('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      $$('#projectGrid .card').forEach(c => {
        const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
        c.classList.toggle('hide', !show);
      });
    });
  });

  // Cello / Matcha tabs
  $$('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab, .tab-panel').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      const panel = $('#tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
})();