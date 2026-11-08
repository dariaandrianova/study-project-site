/* КОМАНДА — однократное последовательное появление портретов.
   Без JS или поддержки анимации фотографии остаются видимыми. */
(() => {
  const portraits = [...document.querySelectorAll('.team-member__figure')];
  if (!portraits.length || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach(({ target }) => {
      observer.unobserve(target);
      if (motion.matches || !target.animate) return;
      const animation = target.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 450, delay: portraits.indexOf(target) * 100,
        easing: 'ease-out', fill: 'backwards' });
      running.add(animation);
      animation.finished.catch(() => {}).finally(() => running.delete(animation));
    });
  }, { threshold: 0.08 });
  portraits.forEach((portrait) => observer.observe(portrait));
  motion.addEventListener('change', () => {
    if (motion.matches) running.forEach((animation) => animation.cancel());
  });
})();
