// Basic UI behavior + contact form (no-backend) handling

(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Stats counter animation
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-count')) || 0;
    const duration = 900;
    const start = performance.now();
    const from = 0;

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      el.textContent = String(v);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.35 });

    counters.forEach(c => io.observe(c));
  }

  // Contact form
  const form = document.getElementById('contactForm');
  if (!form) return;

  const els = {
    name: document.getElementById('cfName'),
    email: document.getElementById('cfEmail'),
    subject: document.getElementById('cfSubject'),
    message: document.getElementById('cfMessage'),
    status: document.getElementById('cfStatus'),
    submit: document.getElementById('cfSubmit'),
    hints: {
      name: document.getElementById('cfNameHint'),
      email: document.getElementById('cfEmailHint'),
      subject: document.getElementById('cfSubjectHint'),
      message: document.getElementById('cfMessageHint'),
    }
  };

  const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email).trim());

  function setFieldState(input, hintEl, msg) {
    const hasError = Boolean(msg);
    input.classList.toggle('input-error', hasError);
    hintEl.classList.toggle('error', hasError);
    hintEl.textContent = msg || '';
  }

  function clearStatus() {
    els.status.className = 'form-status';
    els.status.textContent = '';
  }

  function setStatus(type, msg) {
    els.status.className = 'form-status ' + (type === 'success' ? 'is-success' : 'is-error');
    els.status.textContent = msg;
  }

  function validate() {
    let ok = true;
    clearStatus();

    const name = els.name.value.trim();
    const email = els.email.value.trim();
    const subject = els.subject.value.trim();
    const message = els.message.value.trim();

    setFieldState(els.name, els.hints.name, name ? '' : 'Please enter your name.');
    setFieldState(els.email, els.hints.email, email ? (emailOk(email) ? '' : 'Please enter a valid email address.') : 'Please enter your email.');
    setFieldState(els.subject, els.hints.subject, subject ? '' : 'Please add a subject.');
    setFieldState(els.message, els.hints.message, message ? '' : 'Please write a message.');

    if (!name || !email || !emailOk(email) || !subject || !message) ok = false;
    return ok;
  }

  // Live validation on blur
  ['blur', 'input'].forEach(evt => {
    [els.name, els.email, els.subject, els.message].forEach(input => {
      input.addEventListener(evt, () => {
        // Validate just this field lightly
        if (evt === 'input') clearStatus();
        validate();
      });
    });
  });

  form.addEventListener('reset', () => {
    clearStatus();
    Object.values(els.hints).forEach(h => { h.textContent = ''; h.classList.remove('error'); });
    [els.name, els.email, els.subject, els.message].forEach(i => i.classList.remove('input-error'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatus('error', 'Please fix the highlighted fields and try again.');
      // focus first error
      const first = [els.name, els.email, els.subject, els.message].find(i => i.classList.contains('input-error'));
      if (first) first.focus();
      return;
    }

    // If user configured Netlify or Formspree, they can add an action attribute.
    // When action is present and not mailto, submit normally.
    const action = form.getAttribute('action');
    if (action && !action.startsWith('mailto:')) {
      form.submit();
      return;
    }

    // Default no-backend: mailto fallback
    const to = 'jugal.k.mahendra@gmail.com';
    const name = els.name.value.trim();
    const email = els.email.value.trim();
    const subject = els.subject.value.trim();
    const message = els.message.value.trim();

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // success message before opening mail client
    setStatus('success', 'Opening your email app… If it does not open, please email directly at jugal.k.mahendra@gmail.com.');
    window.location.href = mailto;
  });
})();
