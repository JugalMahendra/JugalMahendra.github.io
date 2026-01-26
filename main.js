(function () {
  // 1. THEME TOGGLE LOGIC
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark

  // Set initial state
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '☀️';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
      }
    });
  }

  // 2. YEAR UPDATE
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 3. MOBILE NAV
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

  // 4. STATS COUNTER ANIMATION
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-count')) || 0;
    const duration = 1200; // Slightly slower for smoother look
    const start = performance.now();
    const from = 0;

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      // Ease out cubic function
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      el.textContent = String(v) + (el.hasAttribute('data-plus') ? '+' : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  // 5. CONTACT FORM HANDLING
  const form = document.getElementById('contactForm');
  if (form) {
    const els = {
      name: document.getElementById('cfName'),
      email: document.getElementById('cfEmail'),
      subject: document.getElementById('cfSubject'),
      message: document.getElementById('cfMessage'),
      status: document.getElementById('cfStatus'),
      hints: {
        name: document.getElementById('cfNameHint'),
        email: document.getElementById('cfEmailHint'),
        subject: document.getElementById('cfSubjectHint'),
        message: document.getElementById('cfMessageHint'),
      }
    };

    const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email).trim());

    function setFieldState(input, hintEl, msg) {
      if (!input || !hintEl) return;
      const hasError = Boolean(msg);
      input.classList.toggle('input-error', hasError);
      hintEl.classList.toggle('error', hasError);
      hintEl.textContent = msg || '';
    }

    function setStatus(type, msg) {
      els.status.className = 'form-status ' + (type === 'success' ? 'is-success' : 'is-error');
      els.status.textContent = msg;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      
      // Validate
      setFieldState(els.name, els.hints.name, els.name.value.trim() ? '' : 'Name is required.');
      setFieldState(els.email, els.hints.email, emailOk(els.email.value) ? '' : 'Valid email is required.');
      setFieldState(els.subject, els.hints.subject, els.subject.value.trim() ? '' : 'Subject is required.');
      setFieldState(els.message, els.hints.message, els.message.value.trim() ? '' : 'Message is required.');

      const firstError = form.querySelector('.input-error');
      if (firstError) {
        firstError.focus();
        setStatus('error', 'Please correct the errors above.');
        return;
      }

      // Handle Submit
      const to = 'jugal.k.mahendra@gmail.com';
      const body = `Name: ${els.name.value}\nEmail: ${els.email.value}\n\n${els.message.value}`;
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(els.subject.value)}&body=${encodeURIComponent(body)}`;
      
      setStatus('success', 'Opening your email client...');
      window.location.href = mailto;
    });
  }
})();
// Update this line inside your animateCounter function:
const symbol = el.hasAttribute('data-plus') ? '+' : el.hasAttribute('data-percent') ? '%' : '';
el.textContent = String(v) + symbol;
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous status
    setStatus('', '');
    
    // Validate fields before sending
    if (!validate()) {
      setStatus('error', 'Please correct the errors in the form.');
      return;
    }

    setStatus('info', 'Sending your message...');

    // Use Fetch API to send data to Formspree
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success', '✅ Success! Your message has been sent.');
        form.reset(); // Clear the form
      } else {
        const errorData = await response.json();
        setStatus('error', '❌ Oops! ' + (errorData.error || 'There was a problem.'));
      }
    } catch (error) {
      setStatus('error', '❌ Connection error. Please try LinkedIn instead.');
    }
  });
