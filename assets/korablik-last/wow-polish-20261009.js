/* Кораблик: unobtrusive scroll polish; content always readable even without JS. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const selectors = [
    '.news-section .section-heading',
    '.news-section .news-card',
    '.resource-section .section-heading',
    '.resource-section .resource-card',
    '.parents-banner__content',
    '.legal-overview h2',
    '.legal-overview-grid a'
  ];
  const items = document.querySelectorAll(selectors.join(','));
  if (!items.length) return;
  const seen = new IntersectionObserver((entries, observer) => {
    if (document.body.classList.contains('accessible')) return;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('motion-entered');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.12, rootMargin: '0px 0px -18px 0px'});
  items.forEach(item => seen.observe(item));
})();
