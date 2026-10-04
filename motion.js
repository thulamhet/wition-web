// Created by Nguyễn Công Thư. Progressive enhancement: pages remain readable without JS.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;

  const targets = [...document.querySelectorAll('.section-heading, .card, .document > section, .faq, .faq-heading, footer')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  // Stagger only sibling cards; long policy sections never delay one another.
  targets.forEach(target => {
    if (target.classList.contains('card')) {
      const index = [...target.parentElement.children].indexOf(target);
      target.style.setProperty('--reveal-delay', `${index * 100}ms`);
    }
    target.classList.add('will-reveal');
    observer.observe(target);
  });

  // Keyboard focus and anchor navigation must never land on hidden content.
  const reveal = target => {
    if (!(target instanceof Element)) return;
    const container = target.closest('.will-reveal');
    if (container) {
      container.classList.add('is-visible');
      observer.unobserve(container);
    }
  };
  document.addEventListener('focusin', event => reveal(event.target));
  const revealAnchor = () => {
    if (!location.hash) return;
    try { reveal(document.getElementById(decodeURIComponent(location.hash.slice(1)))); }
    catch { /* A malformed incoming hash should not interrupt the page. */ }
  };
  window.addEventListener('hashchange', revealAnchor);
  revealAnchor();

  // Pause ambient motion in background tabs, and honor preference changes immediately.
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('motion-paused', document.hidden);
  });
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach(target => target.classList.remove('will-reveal'));
  });
})();
