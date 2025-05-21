// === DOM Elements ===
const toggleBtn = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links'); // changed from getElementById to querySelector for class
const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const themeIcon = document.querySelector('.theme-icon i');
const skillBars = document.querySelectorAll('.skill-level');
const cursorTrail = document.querySelector('.cursor-trail');
const scrollIndicator = document.querySelector('.scroll-indicator');
const profileImg = document.querySelector('.hero-image img');
const typedTextContainer = document.querySelector('.typed-text');

// === Mobile Menu Toggle ===
const toggleMenu = () => {
  if (!navLinks || !toggleBtn) return;

  const isOpen = navLinks.classList.toggle('show');
  const icon = toggleBtn.querySelector('i');

  if (icon) {
    // Adjust icon classes depending on your Font Awesome version
    icon.classList.toggle('fa-bars', !isOpen);
    icon.classList.toggle('fa-times', isOpen);
  }

  toggleBtn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';

  if (isOpen) {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.addEventListener('click', toggleMenu);
    document.body.appendChild(overlay);

    navLinks.querySelectorAll('a').forEach((link, i) => {
      link.style.transform = 'translateY(0)';
      link.style.opacity = '1';
      link.style.transitionDelay = `${i * 0.1}s`;
      link.style.filter = `hue-rotate(${i * 30}deg)`;
    });
  } else {
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) overlay.remove();

    navLinks.querySelectorAll('a').forEach(link => {
      link.style.transform = '';
      link.style.opacity = '';
      link.style.transitionDelay = '';
      link.style.filter = '';
    });
  }
};

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when a nav link is clicked (optional)
  navLinks.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) toggleMenu();
    })
  );
}

// === Theme Switch ===
const applyTheme = (darkMode) => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
    if (themeIcon) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
  } else {
    document.documentElement.classList.remove('dark');
    if (themeIcon) {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  }
  localStorage.setItem('darkTheme', darkMode);
};

if (themeSwitch && themeIcon) {
  const savedTheme = localStorage.getItem('darkTheme');
  if (savedTheme !== null) {
    themeSwitch.checked = savedTheme === 'true';
  } else {
    themeSwitch.checked = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme(themeSwitch.checked);

  themeSwitch.addEventListener('change', () => {
    applyTheme(themeSwitch.checked);
  });
}

// === Skill Bars Animation ===
const animateSkillBars = () => {
  if (!skillBars.length) return;

  skillBars.forEach(bar => {
    const progress = bar.querySelector('.skill-progress');
    if (!progress) return;

    const maxValue = parseInt(bar.dataset.level, 10) || 0;
    let current = 0;

    progress.style.width = '0%';

    const interval = setInterval(() => {
      if (current >= maxValue) {
        clearInterval(interval);
      } else {
        current++;
        progress.style.width = `${current}%`;
        progress.textContent = `${current}%`;
      }
    }, 15);
  });
};

// Animate skill bars when they come into view
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add('active');
      if (el.classList.contains('skills')) {
        animateSkillBars();
      }
    } else {
      el.classList.remove('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// === Scroll Progress Indicator ===
const updateScrollIndicator = () => {
  if (!scrollIndicator) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  scrollIndicator.style.width = `${scrollPercent}%`;
};

window.addEventListener('scroll', updateScrollIndicator);
window.addEventListener('load', updateScrollIndicator);

// === Cursor Trail Effect ===
if (cursorTrail) {
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  const updateCursorTrail = () => {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    cursorTrail.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(updateCursorTrail);
  };

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  requestAnimationFrame(updateCursorTrail);
}

// === Profile Image Hover Effects ===
if (profileImg) {
  profileImg.addEventListener('mouseenter', () => {
    profileImg.style.filter = 'hue-rotate(90deg)';
    profileImg.style.transition = 'filter 0.5s ease';
  });
  profileImg.addEventListener('mouseleave', () => {
    profileImg.style.filter = '';
  });
}

// === Typed Text Effect ===
const typedWords = ['Software Engineer', 'Web Developer', 'Tech Enthusiast', 'Open Source Contributor'];
let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 120;
const deletingSpeed = 60;
const delayBetweenWords = 2000;

const type = () => {
  if (!typedTextContainer) return;

  const currentWord = typedWords[typedIndex];
  let displayedText;

  if (isDeleting) {
    charIndex--;
    displayedText = currentWord.substring(0, charIndex);
  } else {
    charIndex++;
    displayedText = currentWord.substring(0, charIndex);
  }

  typedTextContainer.textContent = displayedText;

  if (!isDeleting && charIndex === currentWord.length) {
    setTimeout(() => {
      isDeleting = true;
      type();
    }, delayBetweenWords);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typedIndex = (typedIndex + 1) % typedWords.length;
    type();
  } else {
    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
  }
};

window.addEventListener('load', () => {
  if (typedTextContainer) {
    type();
  }
});



