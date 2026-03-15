const siteHeader = document.querySelector('.site-header');
const nav = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const revealItems = document.querySelectorAll('.reveal, .reveal-stagger');
const sections = document.querySelectorAll('main section, footer[id]');
const hero = document.querySelector('.hero');

const closeMobileMenu = () => {
  if (nav && nav.classList.contains('nav-open') && menuToggle) {
    nav.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
};

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.addEventListener('click', (event) => {
  if (!nav || !nav.classList.contains('nav-open')) {
    return;
  }

  const target = event.target;
  if (target instanceof Node && !nav.contains(target)) {
    closeMobileMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    const topPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

    window.scrollTo({ top: topPosition, behavior: 'smooth' });
    closeMobileMenu();
  });
});

const setActiveNavLink = () => {
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
  const scrollPoint = window.scrollY + headerHeight + 8;

  let activeSectionId = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollPoint >= sectionTop && scrollPoint < sectionBottom) {
      activeSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeSectionId}`;
    link.classList.toggle('active', isActive);
  });
};

const handleHeaderState = () => {
  if (!siteHeader) {
    return;
  }
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
};

const handleHeroParallax = () => {
  if (!hero) {
    return;
  }
  const offset = Math.min(window.scrollY * 0.18, 70);
  hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: '0px 0px -6% 0px',
  }
);

revealItems.forEach((item) => observer.observe(item));

window.addEventListener('scroll', () => {
  handleHeaderState();
  setActiveNavLink();
  handleHeroParallax();
});

window.addEventListener('resize', closeMobileMenu);

handleHeaderState();
setActiveNavLink();
handleHeroParallax();
