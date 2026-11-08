/* ========================================================
   01. СОСТАВ MVP — шесть выбранных User Stories в исходном порядке
   Это план первой версии, а не описание запущенного продукта.
   Редактируйте id, title, description и value здесь.
   ======================================================== */
const mvpStories = [
  {
    "id": "US-2.1",
    "title": "Черновик поездки",
    "description": "После добавления билета пользователь получает первоначальный вариант поездки с недорогими и удобными вариантами дороги и жилья.",
    "value": "не начинать планирование с пустого экрана и ручного поиска по нескольким сервисам."
  },
  {
    "id": "US-2.2",
    "title": "Сквозные фильтры",
    "description": "Пользователь может подбирать варианты по цене, близости к площадке и продолжительности поездки.",
    "value": "быстро находить подходящее сочетание стоимости и удобства, не перебирая каждый сервис отдельно."
  },
  {
    "id": "US-1.2",
    "title": "Проверка продавца и стоимости",
    "description": "Пользователь получает информацию о продавце билета и видит его номинальную стоимость.",
    "value": "снизить риск переплаты и сделать покупку более прозрачной."
  },
  {
    "id": "US-3.1",
    "title": "День события",
    "description": "Пользователь получает информацию о транспорте, важных точках на карте и логистике мероприятия с возможностью офлайн-доступа.",
    "value": "заранее понимать, как добраться до площадки, сориентироваться на месте и вернуться обратно."
  },
  {
    "id": "US-1.1",
    "title": "Напоминания о событиях",
    "description": "Пользователь может получать напоминания об анонсах мероприятий и стартах продаж билетов.",
    "value": "не пропустить интересующее событие и вовремя узнать о начале продаж."
  },
  {
    "id": "US-4.1",
    "title": "Поделиться поездкой",
    "description": "Пользователь может отправить собранный план поездки в общий чат.",
    "value": "участники поездки получают необходимую информацию без ручной пересылки множества сообщений и скриншотов."
  }
];

/* ========================================================
   02. ДИАЛОГ — общие стили и механика исследовательских модальных окон
   ======================================================== */
(() => {
  const dialog = document.querySelector('#mvp-modal');
  const openButton = document.querySelector('.mvp-open');
  if (!dialog || !openButton) return;
  const closeButton = dialog.querySelector('.hypotheses-modal__close');
  const title = dialog.querySelector('#mvp-modal-title');
  const list = dialog.querySelector('#mvp-stories');
  const scrollArea = dialog.querySelector('.hypotheses-modal__scroll');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let closeTimer;
  let savedScroll = 0;
  let savedBodyStyle;
  let savedHtmlStyle;
  const format = (text) => globalThis.SiteTypography?.formatResearchText(text, true) ?? text;

  function renderList() {
    const fragment = document.createDocumentFragment();
    mvpStories.forEach((story) => {
      const item = document.createElement('li');
      const heading = document.createElement('h3');
      const code = document.createElement('span');
      code.className = 'mvp-stories__code';
      code.textContent = story.id;
      const title = document.createElement('span');
      title.textContent = format(story.title);
      heading.append(code, title);
      const description = document.createElement('p');
      description.textContent = format(story.description);
      const value = document.createElement('p');
      value.className = 'mvp-stories__value';
      const label = document.createElement('strong');
      label.textContent = 'Ценность: ';
      const wording = document.createElement('span');
      wording.textContent = format(story.value);
      value.append(label, wording);
      item.append(heading, description, value);
      fragment.append(item);
    });
    list.replaceChildren(fragment);
    scrollArea.scrollTop = 0;
  }

  /* ======================================================
     03. БЛОКИРОВКА ФОНА — сохраняем позицию и ширину страницы
     Native dialog в top layer делает фон неактивным (inert).
     ====================================================== */
  // Подготовка исходных данных для раскрытия внутри общей исследовательской шторки.
  globalThis.SiteResearchMaterials ??= {};
  globalThis.SiteResearchMaterials['mvp-modal'] = renderList;

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
    // Позиция восстанавливается сразу, независимо от CSS scroll-behavior.
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
  }

  function finishClose() {
    window.clearTimeout(closeTimer);
    dialog.close();
  }

  function requestClose() {
    if (!dialog.open || closing) return;
    closing = true;
    if (reducedMotion.matches) finishClose();
    else {
      dialog.classList.add('is-closing');
      closeTimer = window.setTimeout(finishClose, 320);
    }
  }

  openButton.addEventListener('click', () => {
    if (dialog.open) return;
    renderList();
    closing = false;
    dialog.classList.remove('is-closing');
    lockPage();
    dialog.showModal();
    title.focus({ preventScroll: true });
  });

  closeButton.addEventListener('click', requestClose);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestClose();
  });
  let pressedOutside = false;
  dialog.addEventListener('pointerdown', (event) => {
    pressedOutside = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pressedOutside) requestClose();
    pressedOutside = false;
  });
  dialog.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    closing = false;
    unlockPage();
    openButton.focus({ preventScroll: true });
  });

  // Дополнение к native dialog: предсказуемое кольцо Tab/Shift+Tab.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [closeButton, scrollArea];
    const index = focusable.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      scrollArea.focus();
    } else if (!event.shiftKey && (index === -1 || index === focusable.length - 1)) {
      event.preventDefault();
      closeButton.focus();
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && closing) finishClose();
  });
})();
