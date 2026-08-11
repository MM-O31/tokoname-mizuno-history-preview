const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'メニューを開く' : 'メニューを閉じる';
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'メニューを開く';
  });
});

const fadeTargets = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  fadeTargets.forEach((target) => observer.observe(target));
} else {
  fadeTargets.forEach((target) => target.classList.add('is-visible'));
}

document.getElementById('current-year').textContent = new Date().getFullYear();

const archiveDialog = document.getElementById('archive-dialog');
const archiveDialogImage = document.getElementById('archive-dialog-image');
const archiveDialogTitle = document.getElementById('archive-dialog-title');
const archiveDialogDescription = document.getElementById('archive-dialog-description');
const archiveDialogClose = document.querySelector('.archive-dialog-close');
let archiveDialogTrigger = null;

document.querySelectorAll('.archive-gallery-button').forEach((button) => {
  button.addEventListener('click', () => {
    const thumbnail = button.querySelector('img');
    archiveDialogTrigger = button;
    archiveDialogImage.src = thumbnail.src;
    archiveDialogImage.alt = thumbnail.alt;
    archiveDialogTitle.textContent = button.dataset.title;
    archiveDialogDescription.textContent = button.dataset.description;
    archiveDialog.showModal();
  });
});

archiveDialogClose.addEventListener('click', () => archiveDialog.close());
archiveDialog.addEventListener('click', (event) => {
  if (event.target === archiveDialog) archiveDialog.close();
});
archiveDialog.addEventListener('close', () => {
  archiveDialogImage.removeAttribute('src');
  archiveDialogTrigger?.focus();
});
