const pages = [...document.querySelectorAll('[data-tab]')];
const links = [...document.querySelectorAll('[data-tab-link]')];
const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');

function closeMenu() {
  if (!nav || !menuToggle) return;
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function showTab(tabName, shouldPush = true) {
  const target = pages.some(page => page.dataset.tab === tabName) ? tabName : 'accueil';
  pages.forEach(page => page.classList.toggle('is-active', page.dataset.tab === target));
  links.forEach(link => link.classList.toggle('is-active', link.dataset.tabLink === target));
  document.body.dataset.page = target;

  if (shouldPush) history.pushState({ tab: target }, '', `#${target}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMenu();
}

links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showTab(link.dataset.tabLink);
  });
});

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

window.addEventListener('popstate', () => {
  showTab(location.hash.replace('#', '') || 'accueil', false);
});

showTab(location.hash.replace('#', '') || 'accueil', false);

const newsButtons = [...document.querySelectorAll('[data-filter]')];
const newsCards = [...document.querySelectorAll('.news-card')];
newsButtons.forEach(button => {
  button.addEventListener('click', () => {
    newsButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    newsCards.forEach(card => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const galleryButtons = [...document.querySelectorAll('[data-gallery]')];
const galleryItems = [...document.querySelectorAll('.gallery-item')];
galleryButtons.forEach(button => {
  button.addEventListener('click', () => {
    galleryButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.gallery;
    galleryItems.forEach(item => {
      item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.type !== filter);
    });
  });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || 'Demande PAEB');
    const message = String(data.get('message') || '').trim();
    const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`);
    const mailto = `mailto:secretariatpaeb@adpme.bj?subject=${encodeURIComponent(subject)}&body=${body}`;
    formStatus.textContent = 'Votre client email va s’ouvrir avec le message préparé.';
    window.location.href = mailto;
  });
}

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal');
      });
    }, { threshold: 0.08 })
  : null;

if (observer) {
  document.querySelectorAll('.page article, .page figure, .page aside, .intro-block').forEach(el => observer.observe(el));
}
