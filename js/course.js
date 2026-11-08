/* ========================================================
   О КУРСЕ — desktop HTML является единственным источником полных текстов.
   Полные подробности формируются из исходных карточек.
   ======================================================== */
(() => {
  const section = document.querySelector('#course');
  const adaptiveRoot = section?.querySelector('.course-adaptive');
  const dialog = document.querySelector('#course-details-modal');
  if (!section || !adaptiveRoot || !dialog || !globalThis.SiteDialog) return;
  const sourceCards = [...section.querySelectorAll('.course-grid > .tile')];
  const summaryCard = adaptiveRoot.querySelector('.course-summary-card');
  const content = dialog.querySelector('.course-details-content');
  const openButton = adaptiveRoot.querySelector('.course-details-open');
  const adaptive = window.matchMedia('(max-width: 1024px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  sourceCards.forEach((source, index) => {
    const label = source.querySelector('.eyebrow');
    const heading = source.querySelector('h3');
    const fullDescription = [...source.children].find((node) => node.matches('p:not(.eyebrow)'));
    const tags = source.querySelector(':scope > .tags');
    const list = source.querySelector(':scope > .plain-list');
    const role = source.querySelector('.course-role-popover');

    // В панели — только текстовые группы, без вложенных больших карточек.
    const group = document.createElement('section');
    group.className = 'course-details-group';
    const groupLabel = label.cloneNode(true);
    groupLabel.textContent = `${String(index + 1).padStart(2, '0')} / ${label.textContent}`;
    const groupHeading = heading.cloneNode(true);
    groupHeading.id = `course-details-group-${index + 1}`;
    group.setAttribute('aria-labelledby', groupHeading.id);
    group.append(groupLabel, groupHeading);
    if (fullDescription) group.append(fullDescription.cloneNode(true));
    if (list) group.append(list.cloneNode(true));
    if (tags) group.append(tags.cloneNode(true));
    if (role) {
      const note = document.createElement('div');
      note.className = 'course-details-role';
      const title = document.createElement('h4');
      title.textContent = role.querySelector('h3').textContent;
      note.append(title, role.querySelector('p').cloneNode(true));
      group.append(note);
    }
    content.append(group);
  });
  globalThis.SiteTypography?.apply(adaptiveRoot);
  globalThis.SiteTypography?.apply(content);
  globalThis.SiteDialog.connect(dialog, openButton);
  // В закрытом dialog браузер может игнорировать scrollTop: сбрасываем после showModal.
  openButton.addEventListener('click', () => { content.scrollTop = 0; });
  adaptiveRoot.hidden = false;
  section.classList.add('course-has-adaptive');

  // При смене компоновки не оставляем открытым скрытый desktop-popover.
  function updateLayout() {
    if (adaptive.matches) {
      const roleButton = section.querySelector('.course-role-button');
      if (roleButton?.getAttribute('aria-expanded') === 'true') roleButton.click();
    } else if (dialog.open) {
      dialog.close();
      section.focus({ preventScroll: true });
    }
  }
  adaptive.addEventListener('change', updateLayout);
  updateLayout();

  /* Однократное появление компактных карточек — 400 / 90 мс / 16 px. */
  if (!('IntersectionObserver' in window)) return;
  const tiles = [summaryCard];
  const seen = new Set();
  const running = new Set();
  const observer = new IntersectionObserver((entries) => {
    if (!adaptive.matches) return;
    entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => tiles.indexOf(a.target) - tiles.indexOf(b.target))
      .forEach(({ target }, index) => {
        observer.unobserve(target);
        if (seen.has(target)) return;
        seen.add(target);
        if (motion.matches || typeof target.animate !== 'function') return;
        const animation = target.animate([
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 400, delay: index * 90, easing: 'ease-out', fill: 'backwards' });
        running.add(animation);
        animation.finished.catch(() => {}).finally(() => running.delete(animation));
      });
  }, { threshold: 0.08 });
  function cancelAnimations() {
    running.forEach((animation) => animation.cancel());
    running.clear();
  }
  function observeLayout() {
    observer.disconnect();
    cancelAnimations();
    if (adaptive.matches) tiles.forEach((tile) => {
      if (!seen.has(tile)) observer.observe(tile);
    });
  }
  adaptive.addEventListener('change', observeLayout);
  motion.addEventListener('change', () => { if (motion.matches) cancelAnimations(); });
  observeLayout();
})();
