/* ========================================================
   03 / ПРОЕКТ — сценарии видео, палитра и однократная сборка
   Тексты модулей и метрик редактируются непосредственно в HTML.
   ======================================================== */
(() => {
  const section = document.querySelector('#project');
  if (!section) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const video = section.querySelector('#project-video');
  const caption = section.querySelector('#project-video-caption');
  const message = section.querySelector('#project-video-message');

  // Реальные имена и расширения. Порядок стрелок задаётся здесь.
  const scenarios = [
    { title: 'Онбординг', src: 'assets/video/onboarding-prototype.mp4' },
    { title: 'Карточка события', src: 'assets/video/event-demo.mov' },
    { title: 'Чат-конструктор', src: 'assets/video/scenario-chat.m4v' },
    { title: 'Мои поездки', src: 'assets/video/scenario-trips.m4v' },
    { title: 'Поделиться поездкой', src: 'assets/video/share-trip.mp4' },
  ];

  // Шкалы приложения из задания: это демонстрационные данные UI-kit,
  // а не переопределение глобальной палитры сайта-портфолио.
  const scales = [
    { title: 'Green Scale', colors: ['#F7FEE7', '#EAF8C8', '#D8F5A3', '#C0F06A', '#A8F62C', '#8CD81A', '#6CB410', '#4FA513', '#2F8A0F', '#1E5014'] },
    { title: 'Purple Scale', colors: ['#F5F3FF', '#E8E2FE', '#CDC3FD', '#A894FC', '#7C64FB', '#6349EA', '#4F37CC', '#3B3268', '#2D2350', '#1E173D'] },
    { title: 'Gray Scale', colors: ['#FAFAFA', '#F5F5F5', '#F2F2F7', '#ECEEF0', '#DCDEE3', '#AEADB2', '#8E8E93', '#6E6E73', '#48484A', '#2C2C2E'] },
    { title: 'System Scale', colors: ['#FF3B30', '#FF9500', '#FFCC00', '#007AFF', '#30B0C7'] },
  ];
  const palette = section.querySelector('#project-color-scales');
  scales.forEach(({ title, colors }) => {
    const row = document.createElement('div');
    row.className = 'project-color-scale';
    const heading = document.createElement('h4');
    heading.textContent = title;
    const list = document.createElement('ul');
    list.className = 'project-color-scale__swatches';
    list.setAttribute('aria-label', title);
    colors.forEach((color) => {
      const swatch = document.createElement('li');
      swatch.style.setProperty('--swatch', color);
      swatch.setAttribute('aria-label', color);
      swatch.title = color;
      list.append(swatch);
    });
    row.append(heading, list);
    palette.append(row);
  });

  /* ВИДЕО — переключение без очереди устаревших таймеров и обещаний. */
  let current = 1;
  let revision = 0;
  let switchTimer;
  let visible = false;
  let resumeAfterVisibility = false;
  let autoStarted = false;
  video.muted = true;
  video.playsInline = true;

  function playIfAllowed() {
    if (!visible || document.hidden || motion.matches) return;
    const attempt = video.play();
    attempt?.catch(() => { /* Native controls остаются доступны при запрете autoplay. */ });
  }

  function changeVideo(delta) {
    const selected = ++revision;
    clearTimeout(switchTimer);
    current = (current + delta + scenarios.length) % scenarios.length;
    video.pause();
    // Сбрасываем предыдущий ролик до замены источника.
    try { video.currentTime = 0; } catch { /* Метаданные могли ещё не загрузиться. */ }
    video.classList.add('is-switching');
    switchTimer = window.setTimeout(() => {
      if (selected !== revision) return;
      const scenario = scenarios[current];
      video.removeAttribute('poster');
      video.src = scenario.src;
      video.setAttribute('aria-label', `Прототип: ${scenario.title}`);
      caption.textContent = scenario.title;
      message.hidden = true;
      video.load();
      // Fade не зависит от успешного декодирования: видео не останется скрытым.
      video.classList.remove('is-switching');
      autoStarted = visible;
      playIfAllowed();
    }, motion.matches ? 0 : 160);
  }
  // Тот же видеопереключатель временно используется внутри адаптивной шторки.
  globalThis.SiteProjectVideo = { reset: () => changeVideo(1 - current) };
  section.querySelector('.project-video-prev').addEventListener('click', () => changeVideo(-1));
  section.querySelector('.project-video-next').addEventListener('click', () => changeVideo(1));
  video.addEventListener('error', () => {
    video.classList.remove('is-switching');
    message.hidden = false;
    globalThis.SiteErrors.show(message, { focusTarget: video, retry: () => new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        video.removeEventListener('loadeddata', success);
        video.removeEventListener('error', failure);
      };
      const success = () => { cleanup(); playIfAllowed(); resolve(); queueMicrotask(() => { message.hidden = true; }); };
      const failure = () => { cleanup(); reject(new Error('Видео не загружено')); };
      const timer = setTimeout(failure, 20000);
      video.addEventListener('loadeddata', success);
      video.addEventListener('error', failure);
      video.load();
    }) });
  });
  video.addEventListener('loadeddata', () => {
    // Успешное переключение на другой сценарий также убирает прежнюю ошибку.
    if (!message.querySelector('[aria-busy="true"]')) {
      globalThis.SiteErrors.clear(message);
      message.hidden = true;
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeAfterVisibility = !video.paused;
      video.pause();
    } else if (resumeAfterVisibility) {
      resumeAfterVisibility = false;
      playIfAllowed();
    }
  });

  /* МОДАЛЬНОЕ ОКНО — та же оболочка и механика, что в исследованиях. */
  globalThis.SiteDialog?.connect(
    document.querySelector('#project-metrics-modal'),
    section.querySelector('.project-metrics-open'),
  );

  /* ПОЯВЛЕНИЕ — общий приём 400 / 90 мс, без скрывающих CSS-классов.
     При ошибке JS или отсутствии WAAPI все элементы остаются видимыми. */
  const modules = [...section.querySelectorAll('[data-project-module]')];
  const animated = new Set();
  const running = new Set();
  function animate(element, keyframes, options) {
    if (motion.matches || typeof element.animate !== 'function') return Promise.resolve();
    const animation = element.animate(keyframes, options);
    running.add(animation);
    return animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }
  function animateContents(module) {
    const swatches = [...module.querySelectorAll('.project-color-scale__swatches li')];
    const parts = [...module.querySelectorAll('[data-showcase-part]')];
    swatches.forEach((swatch, index) => animate(swatch,
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 300, delay: index * 24, easing: 'ease-out', fill: 'backwards' }));
    parts.forEach((part, index) => animate(part,
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 300, delay: index * 90, easing: 'ease-out', fill: 'backwards' }));
  }
  function reveal(module, index) {
    if (animated.has(module)) return;
    animated.add(module);
    animate(module,
      [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 400, delay: index * 90, easing: 'ease-out', fill: 'backwards' })
      .then(() => animateContents(module));
  }
  if ('IntersectionObserver' in window) {
    const moduleObserver = new IntersectionObserver((entries) => {
      const appearing = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => modules.indexOf(a.target) - modules.indexOf(b.target));
      appearing.forEach((entry, index) => {
        moduleObserver.unobserve(entry.target);
        reveal(entry.target, index);
      });
    }, { threshold: 0.08 });
    modules.forEach((module) => moduleObserver.observe(module));
    const videoObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        resumeAfterVisibility = !video.paused;
        video.pause();
      } else if (!autoStarted || resumeAfterVisibility) {
        autoStarted = true;
        resumeAfterVisibility = false;
        playIfAllowed();
      }
    }, { threshold: 0.2 });
    videoObserver.observe(video);
  }
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    running.forEach((animation) => animation.cancel());
    video.pause();
  });
})();
