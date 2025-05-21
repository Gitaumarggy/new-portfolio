document.addEventListener('DOMContentLoaded', function() {
  // === DOM Elements ===
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const themeIcon = document.querySelector('.theme-icon i');
  const skillBars = document.querySelectorAll('.skill-level');
  const cursorTrail = document.createElement('div');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const profileImg = document.querySelector('.hero-image img');
  const typedTextContainer = document.querySelector('.typed-text');

  // Add cursor trail element if it doesn't exist
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);

  // === Mobile Menu Toggle ===
  const toggleMenu = () => {
    if (!navLinks || !toggleBtn) return;

    const isOpen = navLinks.classList.toggle('show');
    const icon = toggleBtn.querySelector('i');

    // Toggle icon between bars and times
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
    }

    // Toggle aria-expanded for accessibility
    toggleBtn.setAttribute('aria-expanded', isOpen);
    
    // Toggle body scroll
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Add or remove overlay
    if (isOpen) {
      const overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      overlay.addEventListener('click', toggleMenu);
      document.body.appendChild(overlay);

      // Animate menu items
      navLinks.querySelectorAll('a').forEach((link, i) => {
        link.style.transform = 'translateX(0)';
        link.style.opacity = '1';
        link.style.transitionDelay = `${i * 0.1}s`;
      });
    } else {
      const overlay = document.querySelector('.menu-overlay');
      if (overlay) overlay.remove();

      // Reset menu items animation
      navLinks.querySelectorAll('a').forEach(link => {
        link.style.transform = '';
        link.style.opacity = '';
        link.style.transitionDelay = '';
      });
    }
  };

  // Initialize mobile menu
  if (toggleBtn && navLinks) {
    // Add event listener for menu toggle
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking on nav links (mobile only)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside (mobile only)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          navLinks.classList.contains('show') && 
          !e.target.closest('.nav-links') && 
          !e.target.closest('#menu-toggle')) {
        toggleMenu();
      }
    });

    // Close menu when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
        toggleMenu();
      }
    });
  }

  // === Theme Switch ===
  const applyTheme = (darkMode) => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkTheme', 'true');
      if (themeIcon) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      }
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkTheme', 'false');
      if (themeIcon) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
    }
  };

  if (themeSwitch && themeIcon) {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
      themeSwitch.checked = savedTheme === 'true';
    } else {
      themeSwitch.checked = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme(themeSwitch.checked);

    // Add event listener for theme switch
    themeSwitch.addEventListener('change', () => {
      applyTheme(themeSwitch.checked);
    });
  }

  // === Skill Bars Animation ===
  const animateSkillBars = () => {
    skillBars.forEach(bar => {
      const width = bar.dataset.width || '0%';
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  };

  // === Scroll Reveal Animation ===
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - 100) {
        el.classList.add('active');
        // Animate skill bars when skills section is visible
        if (el.classList.contains('skills')) {
          animateSkillBars();
        }
      }
    });
  };

  // Set up scroll event listeners
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
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  const updateCursorTrail = () => {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    cursorTrail.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(updateCursorTrail);
  };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  requestAnimationFrame(updateCursorTrail);

  // === Profile Image Hover Effects ===
  if (profileImg) {
    profileImg.addEventListener('mouseenter', () => {
      profileImg.style.transform = 'scale(1.05) rotate(5deg)';
      profileImg.style.filter = 'brightness(1.1)';
      profileImg.style.transition = 'all 0.3s ease';
    });
    
    profileImg.addEventListener('mouseleave', () => {
      profileImg.style.transform = 'scale(1) rotate(0)';
      profileImg.style.filter = 'none';
    });
  }

  // === Typed Text Effect ===
  const typedWords = ['Software Engineer', 'Web Developer', 'Tech Enthusiast', 'Problem Solver'];
  let typedIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1500;

  const type = () => {
    if (!typedTextContainer) return;
    
    const currentWord = typedWords[typedIndex];
    let displayedText = isDeleting 
      ? currentWord.substring(0, charIndex - 1)
      : currentWord.substring(0, charIndex + 1);
    
    typedTextContainer.textContent = displayedText;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, delayBetweenWords);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typedIndex = (typedIndex + 1) % typedWords.length;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
  };

  // Start typing effect
  if (typedTextContainer) {
    type();
  }

  // === Mobile Menu Styles ===
  const mobileMenuStyles = document.createElement('style');
  mobileMenuStyles.textContent = `
    /* Mobile menu styles */
    @media (max-width: 768px) {
      .navbar {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        background: var(--navbar-bg);
        padding: 1rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      #menu-toggle {
        display: block;
        position: absolute;
        right: 1rem;
        top: 1rem;
        background: transparent;
        border: none;
        color: var(--text-color);
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1001;
      }
      
      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 70%;
        height: 100vh;
        background: var(--navbar-bg);
        flex-direction: column;
        padding: 5rem 2rem 2rem;
        transition: right 0.3s ease;
        z-index: 1000;
      }
      
      .nav-links.show {
        right: 0;
      }
      
      .nav-links a {
        display: block;
        padding: 1rem;
        color: var(--text-color);
        text-decoration: none;
        font-size: 1.2rem;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
      }
      
      .nav-links.show a {
        opacity: 1;
        transform: translateX(0);
      }
      
      .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        backdrop-filter: blur(5px);
      }
    }
    
    /* Desktop styles */
    @media (min-width: 769px) {
      #menu-toggle {
        display: none;
      }
      
      .nav-links {
        display: flex;
        gap: 1.5rem;
      }
      
      .nav-links a {
        color: var(--text-color);
        transition: color 0.3s ease;
      }
      
      .nav-links a:hover {
        color: var(--accent-color);
      }
    }
    
    /* Cursor trail styles */
    .cursor-trail {
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    }
  `;
  document.head.appendChild(mobileMenuStyles);
});


