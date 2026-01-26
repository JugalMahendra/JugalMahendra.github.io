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
function validateForm(els) {
    let ok = true;
    
    // Helper to clear existing errors
    const clearError = (input, hint) => {
        input.classList.remove('input-error');
        hint.textContent = '';
        hint.classList.remove('error');
    };

    // Name Check
    if (!els.name.value.trim()) {
        els.name.classList.add('input-error');
        els.hints.name.textContent = 'Name is required.';
        els.hints.name.classList.add('error');
        ok = false;
    } else {
        clearError(els.name, els.hints.name);
    }

    // Email Check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(els.email.value.trim())) {
        els.email.classList.add('input-error');
        els.hints.email.textContent = 'Please enter a valid email.';
        els.hints.email.classList.add('error');
        ok = false;
    } else {
        clearError(els.email, els.hints.email);
    }

    return ok;
}
form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    // Gather elements
    const els = {
        name: document.getElementById('cfName'),
        email: document.getElementById('cfEmail'),
        hints: {
            name: document.getElementById('cfNameHint'),
            email: document.getElementById('cfEmailHint')
        }
    };

    // Now 'validateForm' is defined and can be found
    if (!validateForm(els)) {
        return; 
    }

    // Proceed with Fetch/Formspree...
    const statusEl = document.getElementById('cfStatus');
    statusEl.textContent = 'Sending...';
    statusEl.style.display = 'block';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            statusEl.className = 'form-status is-success';
            statusEl.textContent = '✅ Message sent!';
            form.reset();
        } else {
            throw new Error();
        }
    } catch (err) {
        statusEl.className = 'form-status is-error';
        statusEl.textContent = '❌ Error sending message.';
    }
});
  }
})();
// Update this line inside your animateCounter function:
const symbol = el.hasAttribute('data-plus') ? '+' : el.hasAttribute('data-percent') ? '%' : '';
el.textContent = String(v) + symbol;

