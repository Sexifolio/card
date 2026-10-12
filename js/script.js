const nav=document.getElementById('mainNav');
const menuToggle=document.getElementById('menuToggle');
if(nav&&menuToggle){menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');}));}
const currentPath=location.pathname.replace(/\/$/,'/')||'/';document.querySelectorAll('.main-nav a').forEach(a=>{if(a.pathname===currentPath){a.classList.add('is-active');a.setAttribute('aria-current','page');}});
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
