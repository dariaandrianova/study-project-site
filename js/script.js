/* ========================================================
   01. КАРТОЧКИ HERO — изображения, подписи и якоря
   Меняйте данные здесь. href соответствует id раздела в HTML.
   ======================================================== */
const heroCards = [
  {
    title: 'О\u00A0курсе',
    description: 'Контекст и\u00A0моя роль',
    image: 'assets/images/hero-about-course.png',
    href: '#course',
  },
  {
    title: 'Исследования',
    description: 'Гипотезы, интервью и\u00A0методологии',
    image: 'assets/images/hero-research.png',
    href: '#research',
  },
  {
    title: 'Проект',
    description: 'Сценарии, интерфейсы и\u00A0метрики',
    image: 'assets/images/hero-project.png',
    href: '#project',
  },
  {
    title: 'Команда',
    description: 'Люди, роли и\u00A0совместная работа',
    image: 'assets/images/hero-team.png',
    href: '#team',
  },
  {
    title: 'Выводы',
    description: 'Командная работа, ИИ и\u00A0личные инсайты',
    image: 'assets/images/hero-conclusions.png',
    href: '#insights',
  },
];

/* ========================================================
   02. СОЗДАНИЕ КАРТОЧЕК
   Обычные ссылки: работают с клавиатуры, мышью и на телефоне.
   ======================================================== */
const cardContainer = document.querySelector('#hero-cards');
const cardTemplate = document.querySelector('#hero-card-template');

heroCards.forEach((card, index) => {
  const fragment = cardTemplate.content.cloneNode(true);
  const link = fragment.querySelector('a');
  link.href = card.href;
  link.classList.add(`hero-card--${index + 1}`);
  link.setAttribute('aria-label', `${card.title}. ${card.description}`);
  fragment.querySelector('img').src = card.image;
  fragment.querySelector('.hero-card__title').textContent = card.title;
  fragment.querySelector('.hero-card__description').textContent = card.description;
  cardContainer.append(fragment);
});

/* ========================================================
   03. ЯКОРНАЯ НАВИГАЦИЯ — перенос фокуса в выбранный раздел
   Само перемещение выполняет браузер; плавность задаётся в CSS.
   ======================================================== */
function focusAnchorTarget(hash) {
  const target = document.getElementById(hash.slice(1));
  if (target && target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
}
// Та же передача фокуса используется после закрытия адаптивной навигации.
globalThis.SiteAnchors = { focusTarget: focusAnchorTarget };
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (link.hasAttribute('data-drawer-link')) return;
  link.addEventListener('click', () => focusAnchorTarget(link.hash));
});

/* ========================================================
   04. ПОДСКАЗКА HERO — один показ при открытии на первом экране
   pageshow + короткая пауза дают браузеру восстановить прокрутку.
   При возвращении к Hero показ не повторяется. Общая длительность: 2,4 с.
   ======================================================== */
(() => {
  const adaptive = window.matchMedia('(max-width: 1100px)');
  if (adaptive.matches) return;
  const hero = document.querySelector('#top');
  const firstCard = cardContainer.querySelector('.hero-card');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let decided = false;
  let cancelled = false;
  const timers = [];
  let cursor;

  function stopHint() {
    cancelled = true;
    timers.forEach(window.clearTimeout);
    firstCard.classList.remove('hero-card--hint');
    cursor?.remove();
    window.removeEventListener('pointerdown', stopHint);
    window.removeEventListener('keydown', stopHint);
    window.removeEventListener('wheel', stopHint);
    window.removeEventListener('touchstart', stopHint);
    window.removeEventListener('scroll', stopHint);
    window.removeEventListener('pagehide', stopHint);
    cardContainer.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.removeEventListener('change', stopHint);
    adaptive.removeEventListener('change', onLayoutChange);
  }

  function onLayoutChange() {
    if (adaptive.matches) stopHint();
  }

  function onVisibilityChange() {
    if (document.hidden) {
      // Фоновое открытие вкладки не должно расходовать единственный показ.
      if (cursor) stopHint();
    } else if (document.readyState === 'complete' && !decided) {
      considerHint();
    }
  }

  function onPointerMove(event) {
    // pointerover возникает и при появлении/масштабировании элементов под
    // неподвижным курсором. Отменяем только при реальном движении мыши.
    if (event.movementX || event.movementY) stopHint();
  }

  // Любое намеренное взаимодействие отменяет подсказку, даже до её старта.
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'pagehide'].forEach((event) => {
    window.addEventListener(event, stopHint, { passive: true });
  });
  cardContainer.addEventListener('pointermove', onPointerMove);
  document.addEventListener('visibilitychange', onVisibilityChange);
  reducedMotion.addEventListener('change', stopHint);
  adaptive.addEventListener('change', onLayoutChange);

  function considerHint(event) {
    if (decided) return;
    if (document.hidden && !event?.persisted) return;
    decided = true;
    if (event?.persisted || cancelled || reducedMotion.matches || document.hidden) {
      stopHint();
      return;
    }

    timers.push(window.setTimeout(() => {
      // Решение принимается один раз после восстановления позиции, не при скролле.
      const rect = firstCard.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      const visibleWidth = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
      const visibleRatio = (visibleHeight * visibleWidth) / (rect.width * rect.height);
      const startsElsewhere = location.hash && !['#top', '#main'].includes(location.hash);
      if (cancelled || startsElsewhere || window.scrollY > 120 || visibleRatio < 0.25 || visibleHeight < 48 || hero.getBoundingClientRect().bottom <= 0) {
        stopHint();
        return;
      }

      // Декоративный курсор не перехватывает клики и скрыт от скринридеров.
      cursor = document.createElement('span');
      cursor.className = 'hero-hint-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2L24 18L14 19L9 28L3 2Z" fill="white" stroke="#242424" stroke-width="2" stroke-linejoin="round"/></svg>';
      firstCard.append(cursor);
      window.addEventListener('scroll', stopHint, { passive: true });
      timers.push(window.setTimeout(() => firstCard.classList.add('hero-card--hint'), 400));
      timers.push(window.setTimeout(() => firstCard.classList.remove('hero-card--hint'), 1920));
      timers.push(window.setTimeout(stopHint, 2400));
    }, 200));
  }

  window.addEventListener('pageshow', considerHint, { once: true });
  if (document.readyState === 'complete') considerHint();
})();

/* ========================================================
   05. О КУРСЕ — пояснение формальной роли в команде
   Кнопка доступна с клавиатуры. Popover остаётся внутри окна.
   ======================================================== */
(() => {
  const button = document.querySelector('.course-role-button');
  const panel = document.querySelector('#course-role-popover');
  if (!button || !panel) return;

  function positionPanel() {
    const anchor = button.getBoundingClientRect();
    const gap = 12;
    const edge = 16;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const left = Math.max(edge, Math.min(anchor.right - width, innerWidth - width - edge));
    const preferredTop = anchor.bottom + gap;
    const top = preferredTop + height <= innerHeight - edge
      ? preferredTop
      : Math.max(edge, anchor.top - gap - height);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }

  function closePanel() {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', () => {
    if (!panel.hidden) {
      closePanel();
      return;
    }
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    positionPanel();
  });

  document.addEventListener('click', (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !button.contains(event.target)) closePanel();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel();
      button.focus({ preventScroll: true });
    }
  });

  // При уходе фокуса с пояснения оно больше не закрывает содержание страницы.
  document.addEventListener('focusin', (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !button.contains(event.target)) closePanel();
  });
  window.addEventListener('resize', () => {
    if (!panel.hidden) positionPanel();
  });
  document.addEventListener('scroll', (event) => {
    if (!panel.hidden && !panel.contains(event.target)) closePanel();
  }, { capture: true, passive: true });
})();

/* ========================================================
   06. ТАБЫ ИССЛЕДОВАНИЙ
   Содержимое находится в HTML: research-panel-ideas … research-panel-tone-of-voice.
   JS сохраняет переключение и клавиатуру; активный таб раскрывается внутри горизонтальной ленты.
   ======================================================== */
(() => {
  const root = document.querySelector('#research .research-tabs');
  if (!root) return;
  const navigation = root.querySelector('.research-tabs__navigation');
  const list = root.querySelector('[role="tablist"]');
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  // Подпись остаётся в HTML; техническая копия нужна только для стабильной ширины.
  tabs.forEach((tab) => tab.setAttribute('data-tab-label', tab.textContent.trim()));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let moduleAnimations = [];

  function cancelModuleAnimations() {
    moduleAnimations.forEach((animation) => animation.cancel());
    moduleAnimations = [];
  }

  // Находим только внешние модули, не анимируя вложенные тексты и карточки.
  // Панель-placeholder сама является .tile и участвует как один модуль.
  function getPanelModules(panel) {
    const selector = '.tile, [data-tab-module]';
    if (panel.matches(selector)) return [panel];
    const modules = [...panel.querySelectorAll(selector)].filter((module) => {
      const parentModule = module.parentElement.closest(selector);
      return !parentModule || !panel.contains(parentModule);
    });
    return modules.length ? modules : [panel];
  }

  function animatePanelModules(panel) {
    cancelModuleAnimations();
    if (reducedMotion.matches) return;
    getPanelModules(panel).forEach((module, index) => {
      if (typeof module.animate !== 'function') return;
      // Базовые стили всегда видимы. При отмене/ошибке анимации контент не скрывается.
      const animation = module.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], {
        duration: 400,
        delay: index * 90,
        easing: 'ease-out',
        fill: 'backwards',
      });
      moduleAnimations.push(animation);
    });
  }

  // Затухание отражает фактическое переполнение, включая ручной свайп.
  function updateEdgeFades() {
    const maximum = Math.max(0, list.scrollWidth - list.clientWidth);
    navigation.classList.toggle('has-hidden-before', maximum > 1 && list.scrollLeft > 1);
    navigation.classList.toggle('has-hidden-after', maximum > 1 && list.scrollLeft < maximum - 1);
  }

  list.addEventListener('scroll', updateEdgeFades, { passive: true });
  window.addEventListener('resize', updateEdgeFades);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(updateEdgeFades).observe(list);
  document.fonts?.ready.then(updateEdgeFades);

  // Только горизонтальная лента: края открывают соседние этапы с запасом,
  // программный переход центрирует таб, начальная загрузка лишь проверяет видимость.
  function revealSelectedTab(selected, position = 'edge') {
    const viewport = list.getBoundingClientRect();
    const button = selected.getBoundingClientRect();
    const width = list.clientWidth;
    const maximum = Math.max(0, list.scrollWidth - width);
    if (!width || !maximum) return;
    const current = list.scrollLeft;
    const centerInViewport = (button.left + button.right) / 2 - viewport.left;
    const centerInContent = current + centerInViewport;
    let target = current;
    if (position === 'center') target = centerInContent - width / 2;
    else if (position === 'visible') {
      if (button.left < viewport.left + 4) target = current + button.left - viewport.left - 4;
      else if (button.right > viewport.right - 4) target = current + button.right - viewport.right + 4;
    } else if (selected === tabs[0]) target = 0;
    else if (selected === tabs[tabs.length - 1]) target = maximum;
    else if (centerInViewport >= width * 0.75 || button.right > viewport.right - 4) {
      target = centerInContent - width * 0.28;
    } else if (centerInViewport <= width * 0.25 || button.left < viewport.left + 4) {
      target = centerInContent - width * 0.72;
    }
    target = Math.max(0, Math.min(target, maximum));
    if (Math.abs(target - current) > 1) {
      list.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  }

  // Ручное взаимодействие прерывает текущую анимацию прокрутки без смещения.
  list.addEventListener('pointerdown', () => {
    list.scrollTo({ left: list.scrollLeft, behavior: 'instant' });
  });
  list.addEventListener('wheel', (event) => {
    list.scrollTo({ left: list.scrollLeft, behavior: 'instant' });
    // Shift + обычное колесо — явное намерение прокрутить горизонтальную ленту.
    // Вертикальное колесо без Shift и нативный deltaX остаются браузеру.
    if (!event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? list.clientWidth : 1;
    const maximum = Math.max(0, list.scrollWidth - list.clientWidth);
    const target = Math.max(0, Math.min(list.scrollLeft + event.deltaY * unit, maximum));
    if (target !== list.scrollLeft) {
      event.preventDefault();
      list.scrollLeft = target;
    }
  }, { passive: false });

  function selectTab(selected, focus = false, position = 'edge') {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) selected.focus({ preventScroll: true });
    revealSelectedTab(selected, position);
    animatePanelModules(document.getElementById(selected.getAttribute('aria-controls')));
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[target], true);
    });
  });

  // Ссылки на следующие этапы вызывают тот же selectTab, что и навигация.
  root.addEventListener('click', (event) => {
    const link = event.target.closest('[data-research-tab]');
    if (!link || !root.contains(link)) return;
    const targetTab = tabs.find((tab) => tab.id === link.dataset.researchTab);
    if (!targetTab) return;
    event.preventDefault();
    selectTab(targetTab, false, 'center');
    const panel = document.getElementById(targetTab.getAttribute('aria-controls'));
    panel.focus({ preventScroll: true });
    // Контейнер не анимируется, поэтому translateY панели не смещает цель прокрутки.
    root.querySelector('.research-tabs__panels').scrollIntoView({
      block: 'start',
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  });

  // Изменение системной настройки сразу завершает эффекты и показывает модули.
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) cancelModuleAnimations();
  });
  const initialTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
  if (initialTab) {
    revealSelectedTab(initialTab, 'visible');
    animatePanelModules(document.getElementById(initialTab.getAttribute('aria-controls')));
  }
  updateEdgeFades();
})();


/* ========================================================
   ВЫВОДЫ — однократное появление внешних модулей при прокрутке
   Параметры те же, что у модулей проекта: 400 мс / 90 мс / 16 px.
   Без JS содержимое видно; скрывающие CSS-классы не используются.
   ======================================================== */
(() => {
  const modules = [...document.querySelectorAll('#insights .insights-grid > .tile')];
  if (!modules.length || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => modules.indexOf(a.target) - modules.indexOf(b.target));
    visible.forEach(({ target }, index) => {
      observer.unobserve(target);
      if (motion.matches || typeof target.animate !== 'function') return;
      const animation = target.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 400, delay: index * 90, easing: 'ease-out', fill: 'backwards' });
      running.add(animation);
      animation.finished.catch(() => {}).finally(() => running.delete(animation));
    });
  }, { threshold: 0.08 });
  modules.forEach((module) => observer.observe(module));
  motion.addEventListener('change', () => {
    if (motion.matches) running.forEach((animation) => animation.cancel());
  });
})();


/* ========================================================
   HERO TABLET / MOBILE — однократное появление при прокрутке
   Общий характер сайта: 400 мс, 90 мс между соседями, 16 px.
   Без JS и WAAPI карточки видны; desktop не анимируем заново.
   ======================================================== */
(() => {
  const cards = [...document.querySelectorAll('#hero-cards .hero-card')];
  if (!cards.length || !('IntersectionObserver' in window)) return;
  const adaptive = window.matchMedia('(max-width: 1100px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new Set();
  const running = new Map();
  const observer = new IntersectionObserver((entries) => {
    if (!adaptive.matches) return;
    entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => cards.indexOf(a.target) - cards.indexOf(b.target))
      .forEach(({ target }, index) => {
        observer.unobserve(target);
        if (seen.has(target)) return;
        seen.add(target);
        if (motion.matches || typeof target.animate !== 'function') return;
        const animation = target.animate([
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 400, delay: index * 90, easing: 'ease-out', fill: 'backwards' });
        running.set(target, animation);
        animation.finished.catch(() => {}).finally(() => {
          if (running.get(target) === animation) running.delete(target);
        });
      });
  }, { threshold: 0.08 });

  function cancelAnimations() {
    running.forEach((animation) => animation.cancel());
    running.clear();
  }
  function updateLayout() {
    observer.disconnect();
    cancelAnimations();
    if (adaptive.matches) cards.forEach((card) => {
      if (!seen.has(card)) observer.observe(card);
    });
  }
  cards.forEach((card) => card.addEventListener('focus', () => {
    running.get(card)?.cancel();
  }));
  adaptive.addEventListener('change', updateLayout);
  motion.addEventListener('change', () => {
    if (motion.matches) cancelAnimations();
  });
  updateLayout();
})();
