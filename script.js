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
