// ===== JellyClaw shared behavior =====

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initParticles();
  initCopyButtons();
  initScrollReveal();
  initTerminal();
});

function initNav() {
  const toggle = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function initParticles() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.querySelector('.particles');
  if (!host || reduceMotion) return;

  const count = window.innerWidth < 768 ? 12 : 24;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${14 + Math.random() * 16}s`;
    p.style.animationDelay = `${Math.random() * 20}s`;
    p.style.background = i % 3 === 0 ? 'var(--teal)' : 'var(--pink)';
    host.appendChild(p);
  }
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      const text = target.innerText;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      } catch (err) {
        btn.textContent = 'Press Ctrl+C';
      }
    });
  });
}

function initTerminal() {
  // Types out the hero terminal log lines on loop. With prefers-reduced-motion,
  // the static lines in the markup are left untouched.
  const term = document.querySelector('.terminal-body');
  if (!term || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = Array.from(term.querySelectorAll('.terminal-line'));
  const texts = lines.map((l) => l.querySelector('.t-msg').textContent);
  if (!lines.length) return;

  // visibility (not display) keeps line heights reserved — no layout shift
  const reset = () => lines.forEach((l) => {
    l.style.visibility = 'hidden';
    l.classList.remove('typing');
    l.querySelector('.t-msg').textContent = '';
  });

  const typeLine = (i) => {
    if (i >= lines.length) {
      setTimeout(() => { reset(); typeLine(0); }, 4500);
      return;
    }
    const line = lines[i];
    const msg = line.querySelector('.t-msg');
    line.style.visibility = 'visible';
    line.classList.add('typing');
    let c = 0;
    const tick = setInterval(() => {
      msg.textContent = texts[i].slice(0, ++c);
      if (c >= texts[i].length) {
        clearInterval(tick);
        line.classList.remove('typing');
        setTimeout(() => typeLine(i + 1), 700);
      }
    }, 28);
  };

  reset();
  typeLine(0);
}

function initScrollReveal() {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el) => observer.observe(el));
}
