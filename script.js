/**
 * AURELIUS — Premium Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initHeroParallax();
  initCounterAnimation();
  initTestimonialSlider();
  initContactForm();
  initFaqAccordion();
  initMagneticButtons();
  initServiceCardGlow();
});

/* ── Navigation ── */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link, .nav__cta');
  const hero = document.getElementById('hero');
  const darkSections = document.querySelectorAll('.section--dark, .showcase, .marquee, .footer');

  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    const heroBottom = hero.offsetTop + hero.offsetHeight;

    header.classList.toggle('header--scrolled', scrollY > 80);

    let overDark = false;
    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 70 && rect.bottom >= 70) overDark = true;
    });

    if (scrollY < heroBottom - 80) {
      header.classList.remove('header--dark');
    } else if (overDark) {
      header.classList.add('header--dark');
      header.classList.remove('header--scrolled');
    } else {
      header.classList.remove('header--dark');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  updateHeader();

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Hero Parallax ── */
function initHeroParallax() {
  const hero = document.getElementById('hero');
  const image = hero?.querySelector('.hero__image');
  const content = hero?.querySelector('.hero__content');
  if (!image || !content) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrollY < heroHeight) {
          const progress = scrollY / heroHeight;
          image.style.transform = `scale(${1.08 + progress * 0.08}) translateY(${scrollY * 0.35}px)`;
          content.style.transform = `translateY(${scrollY * 0.25}px)`;
          content.style.opacity = 1 - progress * 1.2;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll(':scope > .reveal, :scope > * > .reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx, 6) * 0.08}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* ── Counter Animation ── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.about__stat-number');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ── Testimonial Slider ── */
function initTestimonialSlider() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonials-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial');
  let current = 0;
  let autoplayInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonials__dot');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonials__dot');

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  function startAutoplay() {
    autoplayInterval = setInterval(() => goTo(current + 1), 7000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

/* ── FAQ Accordion ── */
function initFaqAccordion() {
  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq__item').forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
}

/* ── Contact Form ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const successMsg = document.getElementById('form-success');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, errorEl, message) {
    input.classList.add('error');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  nameInput.addEventListener('input', () => clearError(nameInput, nameError));
  emailInput.addEventListener('input', () => clearError(emailInput, emailError));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your name.');
      valid = false;
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const btnText = submitBtn.querySelector('span');
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      btnText.textContent = 'Request Consultation';
      submitBtn.disabled = false;
      successMsg.hidden = false;
      setTimeout(() => { successMsg.hidden = true; }, 5000);
    }, 1400);
  });
}

/* ── Magnetic Buttons ── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── Service Card Glow ── */
function initServiceCardGlow() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}
