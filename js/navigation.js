/* ========================================================
   ПОЛНОЭКРАННАЯ НАВИГАЦИЯ — native dialog, общий набор якорей.
   Один контрол меняет бургер на X; движение только у поверхности.
   ======================================================== */
(() => {
  const drawer = document.querySelector('#site-nav-drawer');
  const toggle = document.querySelector('#site-menu-toggle');
  const links = [...drawer.querySelectorAll('[data-drawer-link]')];
  const sections = links.map((link) => document.querySelector(link.hash));
  const homeMarker = document.createComment('Позиция фиксированной навигации в порядке Tab');
  document.querySelector('main').before(homeMarker);
  const adaptive = window.matchMedia('(max-width: 1100px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let closeTimer;
  let destination = null;
  let savedScroll = 0;
  let savedBodyStyle;
  let savedHtmlStyle;
  let activeHash = '#top';
  let scrollFrame;

  function contentDialogs() {
    return [...document.querySelectorAll('dialog[open]')].filter((dialog) => dialog !== drawer);
  }
  // Только собственное меню переносит контрол в top layer.
  // Содержательные шторки оставляют бургер на фоне, под затемнением.
  function placeToggle() {
    const parent = drawer.open ? drawer : document.body;
    if (parent === document.body) {
      if (toggle.previousSibling !== homeMarker) homeMarker.after(toggle);
    } else if (toggle.parentElement !== parent) parent.append(toggle);
  }
  function setActive(hash) {
    activeHash = hash;
    links.forEach((link) => {
      if (link.hash === hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function updateActive() {
    scrollFrame = null;
    if (drawer.open || contentDialogs().length) return;
    // Последний раздел может не достигнуть верхней четверти из-за конца страницы.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      setActive(`#${sections[sections.length - 1].id}`);
      return;
    }
    const marker = window.innerHeight * .25;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });
    setActive(`#${current.id}`);
  }
  function scheduleActive() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActive);
  }
  function lockPage() {
    savedScroll = window.scrollY;
    savedBodyStyle = document.body.getAttribute('style');
    savedHtmlStyle = document.documentElement.getAttribute('style');
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    Object.assign(document.body.style, {
      position: 'fixed', top: `-${savedScroll}px`, left: '0', right: '0',
      overflow: 'hidden', paddingRight: `${padding + scrollbar}px`,
    });
    document.documentElement.style.overflow = 'hidden';
  }
  function unlockPage() {
    if (savedBodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', savedBodyStyle);
    if (savedHtmlStyle === null) document.documentElement.removeAttribute('style');
    else document.documentElement.setAttribute('style', savedHtmlStyle);
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
  }
  function openMenu() {
    if (!adaptive.matches || drawer.open) return;
    updateActive();
    destination = null;
    closing = false;
    drawer.classList.remove('is-closing');
    lockPage();
    drawer.showModal();
    placeToggle();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть навигацию');
    drawer.querySelector('.site-drawer__nav').scrollTop = 0;
    (links.find((link) => link.hash === activeHash) || links[0]).focus({ preventScroll: true });
  }
  function finishClose() {
    clearTimeout(closeTimer);
    if (drawer.open) drawer.close();
  }
  function requestClose(hash = null) {
    if (!drawer.open || closing) return;
    destination = hash;
    closing = true;
    if (motion.matches) finishClose();
    else {
      drawer.classList.add('is-closing');
      closeTimer = setTimeout(finishClose, 340);
    }
  }
  toggle.addEventListener('click', () => {
    if (drawer.open) requestClose();
    else if (!contentDialogs().length) openMenu();
  });
  links.forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActive(link.hash);
    requestClose(link.hash);
  }));
  drawer.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestClose();
  });
  drawer.addEventListener('close', () => {
    clearTimeout(closeTimer);
    drawer.classList.remove('is-closing');
    closing = false;
    unlockPage();
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть навигацию');
    placeToggle();
    if (adaptive.matches) toggle.focus({ preventScroll: true });
    const hash = destination;
    destination = null;
    if (hash) {
      const sameLocation = location.hash === hash;
      location.hash = hash;
      globalThis.SiteAnchors.focusTarget(hash);
      if (sameLocation) document.querySelector(hash).scrollIntoView({
        block: 'start', behavior: motion.matches ? 'instant' : 'smooth',
      });
    }
    scheduleActive();
  });

  function visibleControls(root) {
    return [...root.querySelectorAll('button:not([disabled]),a[href],[tabindex]')]
      .filter((element) => element.tabIndex >= 0 && element.getClientRects().length);
  }
  drawer.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = visibleControls(drawer);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  new MutationObserver(placeToggle).observe(document.body, {
    subtree: true, attributes: true, attributeFilter: ['open'],
  });
  adaptive.addEventListener('change', () => {
    if (!adaptive.matches && drawer.open) finishClose();
    placeToggle();
    scheduleActive();
  });
  motion.addEventListener('change', () => { if (motion.matches && closing) finishClose(); });
  window.addEventListener('scroll', scheduleActive, { passive: true });
  window.addEventListener('resize', scheduleActive);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(scheduleActive, { rootMargin: '-15% 0px -60% 0px' });
    sections.forEach((section) => observer.observe(section));
  }
  placeToggle();
  updateActive();
})();
