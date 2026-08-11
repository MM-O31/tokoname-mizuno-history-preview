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
const archiveDialogModern = document.getElementById('archive-dialog-modern');
const archiveDialogResearchBox = document.querySelector('.archive-dialog-research');
const archiveDialogResearch = document.getElementById('archive-dialog-research');
const archiveDialogClose = document.querySelector('.archive-dialog-close');
const archiveZoomPane = document.querySelector('.archive-zoom-pane');
const canHoverZoom = window.matchMedia('(hover: hover) and (pointer: fine)');
let archiveDialogTrigger = null;

const resetArchiveZoom = () => {
  archiveZoomPane.classList.remove('is-zoomed');
  archiveZoomPane.style.removeProperty('--zoom-x');
  archiveZoomPane.style.removeProperty('--zoom-y');
};

const updateArchiveZoom = (event) => {
  const bounds = archiveZoomPane.getBoundingClientRect();
  const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
  const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
  archiveZoomPane.style.setProperty('--zoom-x', `${x}%`);
  archiveZoomPane.style.setProperty('--zoom-y', `${y}%`);
};

archiveZoomPane.addEventListener('pointerenter', (event) => {
  if (!canHoverZoom.matches) return;
  archiveZoomPane.classList.add('is-zoomed');
  updateArchiveZoom(event);
});
archiveZoomPane.addEventListener('pointermove', (event) => {
  if (archiveZoomPane.classList.contains('is-zoomed')) updateArchiveZoom(event);
});
archiveZoomPane.addEventListener('pointerleave', resetArchiveZoom);

document.querySelectorAll('.archive-gallery-button').forEach((button) => {
  button.addEventListener('click', () => {
    const thumbnail = button.querySelector('img');
    resetArchiveZoom();
    archiveDialogTrigger = button;
    archiveDialogImage.src = thumbnail.src;
    archiveDialogImage.alt = thumbnail.alt;
    archiveDialogTitle.textContent = button.dataset.title;
    archiveDialogDescription.textContent = button.dataset.description;
    archiveDialogModern.textContent = button.dataset.modern;
    const researchNote = button.dataset.research;
    archiveDialogResearchBox.hidden = !researchNote;
    archiveDialogResearch.textContent = researchNote || '';
    archiveDialog.showModal();
  });
});

archiveDialogClose.addEventListener('click', () => archiveDialog.close());
archiveDialog.addEventListener('click', (event) => {
  if (event.target === archiveDialog) archiveDialog.close();
});
archiveDialog.addEventListener('close', () => {
  resetArchiveZoom();
  archiveDialogImage.removeAttribute('src');
  archiveDialogTrigger?.focus();
});
