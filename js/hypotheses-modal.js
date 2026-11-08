/* ========================================================
   01. ДАННЫЕ — 27 исходных исследовательских гипотез команды
   id сохраняет исходную нумерацию и не меняется при фильтрации.
   category задаёт тематическую группу.
   validationStatus — итог команды: confirmed / partial / rejected.
   validationSourceId — номер в исходной FigJam-матрице для сверки.
   Сопоставление проверено по содержанию: 6 / 12 / 9.
   validationReason добавлять только при наличии исходного обоснования.
   ======================================================== */
const hypotheses = [
  {
    id: 1,
    category: "Пользовательский путь",
    text: "Пользователи ищут события в течение года и самостоятельно заходят на сайты, чтобы проверить обновления",
    validationStatus: "confirmed",
    validationSourceId: 9,
  },
  {
    id: 2,
    category: "Пользовательский путь",
    text: "Пользователю важно посмотреть достопримечательности помимо посещения самого мероприятия",
    validationStatus: "partial",
    validationSourceId: 17,
  },
  {
    id: 3,
    category: "Пользовательский путь",
    text: "Поездка ради события длится примерно три дня, если мероприятие однодневное",
    validationStatus: "partial",
    validationSourceId: 19,
  },
  {
    id: 4,
    category: "Пользовательский путь",
    text: "Пользователи могут выбирать между несколькими событиями, например концертами любимой группы в разных городах или в разные даты",
    validationStatus: "partial",
    validationSourceId: 20,
  },
  {
    id: 5,
    category: "Пользовательский путь",
    text: "Пользователи ездят на мероприятия за рубеж, в том числе в страны, где требуется виза",
    validationStatus: "rejected",
    validationSourceId: 26,
  },
  {
    id: 6,
    category: "Инструменты и организация",
    text: "Пользователи используют несколько разных инструментов, чтобы организовать путешествие",
    validationStatus: "confirmed",
    validationSourceId: 1,
  },
  {
    id: 7,
    category: "Инструменты и организация",
    text: "Организаторы мероприятий помогают с поездкой: предоставляют скидки на отели, предлагают жильё рядом с площадкой или публикуют информацию о логистике",
    validationStatus: "partial",
    validationSourceId: 2,
  },
  {
    id: 8,
    category: "Инструменты и организация",
    text: "Пользователи собирают в одном месте артефакты поездки: билеты, расписание, примерный бюджет, полезные адреса и другую информацию",
    validationStatus: "rejected",
    validationSourceId: 10,
  },
  {
    id: 9,
    category: "Инструменты и организация",
    text: "Пользователи составляют расписание поездки по дням",
    validationStatus: "rejected",
    validationSourceId: 11,
  },
  {
    id: 10,
    category: "Инструменты и организация",
    text: "Пользователи самостоятельно организуют поездку без помощи ИИ",
    validationStatus: "confirmed",
    validationSourceId: 13,
  },
  {
    id: 11,
    category: "Инструменты и организация",
    text: "Пользователи пользуются сервисами или компаниями, которые предлагают готовые поездки под события",
    validationStatus: "rejected",
    validationSourceId: 22,
  },
  {
    id: 12,
    category: "Инструменты и организация",
    text: "Пользователи выбирают знакомые сервисы для покупки билетов на транспорт либо ориентируются на рекомендации друзей",
    validationStatus: "confirmed",
    validationSourceId: 27,
  },
  {
    id: 13,
    category: "Бюджет и удобство",
    text: "Пользователю сложно заранее оценить полную стоимость поездки, поскольку расходы распределены между несколькими сервисами и появляются постепенно",
    validationStatus: "rejected",
    validationSourceId: 3,
  },
  {
    id: 14,
    category: "Бюджет и удобство",
    text: "Пользователи ранее платили за услуги сервисов, помогающих организовать поездку",
    validationStatus: "rejected",
    validationSourceId: 4,
  },
  {
    id: 15,
    category: "Бюджет и удобство",
    text: "Пользователи ищут баланс между ценой и удобством: подходящие рейсы, близость отеля, возможность отдохнуть и не переплатить",
    validationStatus: "confirmed",
    validationSourceId: 5,
  },
  {
    id: 16,
    category: "Бюджет и удобство",
    text: "Пользователи выбирают жильё исходя из близости к месту мероприятия",
    validationStatus: "partial",
    validationSourceId: 7,
  },
  {
    id: 17,
    category: "Бюджет и удобство",
    text: "Пользователи суммируют предполагаемые расходы, чтобы спланировать бюджет поездки",
    validationStatus: "rejected",
    validationSourceId: 12,
  },
  {
    id: 18,
    category: "Бюджет и удобство",
    text: "Пользователи часто переплачивают за жильё рядом с площадкой мероприятия",
    validationStatus: "rejected",
    validationSourceId: 21,
  },
  {
    id: 19,
    category: "Бюджет и удобство",
    text: "При планировании поездки пользователям особенно важны цена и близость к площадке",
    validationStatus: "partial",
    validationSourceId: 23,
  },
  {
    id: 20,
    category: "Сложности и риски",
    text: "Пользователи сталкиваются с отменами или переносами, которые вызывают стресс и требуют времени на поиск новых решений",
    validationStatus: "rejected",
    validationSourceId: 6,
  },
  {
    id: 21,
    category: "Сложности и риски",
    text: "Пользователям сложно самостоятельно продумывать логистику дня мероприятия: работу транспорта, хранение вещей и другие организационные вопросы",
    validationStatus: "confirmed",
    validationSourceId: 8,
  },
  {
    id: 22,
    category: "Сложности и риски",
    text: "Подготовка поездки занимает много времени — около недели суммарно. Пользователи начинают заранее и неоднократно возвращаются к организационным задачам",
    validationStatus: "partial",
    validationSourceId: 16,
  },
  {
    id: 23,
    category: "Сложности и риски",
    text: "Пользователи сначала эмоционально покупают билет на событие, а затем оценивают стоимость дороги и жилья. Из-за дорогой или сложной логистики могут отказаться от поездки и попытаться продать билет",
    validationStatus: "partial",
    validationSourceId: 24,
  },
  {
    id: 24,
    category: "Сложности и риски",
    text: "Пользователи сталкивались с необходимостью отменять или переносить поездку",
    validationStatus: "partial",
    validationSourceId: 25,
  },
  {
    id: 25,
    category: "Совместные поездки",
    text: "Пользователи находят компанию для посещения мероприятия",
    validationStatus: "partial",
    validationSourceId: 14,
  },
  {
    id: 26,
    category: "Совместные поездки",
    text: "Пользователи часто ездят на мероприятия с друзьями и создают общий чат для согласования поездки. Договорённости могут затягиваться, а организация занимать до трёх недель",
    validationStatus: "partial",
    validationSourceId: 15,
  },
  {
    id: 27,
    category: "Совместные поездки",
    text: "В совместных поездках пользователи платят друг за друга, а после поездки подсчитывают взаимные долги",
    validationStatus: "partial",
    validationSourceId: 18,
  },
];

/* ========================================================
   02. СПИСОК И ФИЛЬТР — только textContent, без вставки HTML из данных
   ======================================================== */
(() => {
  const dialog = document.querySelector('#hypotheses-modal');
  const openButton = document.querySelector('.hypotheses-open');
  if (!dialog || !openButton) return;
  const panel = dialog.querySelector('.hypotheses-modal__panel');
  const closeButton = dialog.querySelector('.hypotheses-modal__close');
  const title = dialog.querySelector('#hypotheses-modal-title');
  const filter = dialog.querySelector('#hypotheses-category');
  const list = dialog.querySelector('#hypotheses-list');
  const filterValue = dialog.querySelector('#hypotheses-filter-value');
  const dropdown = dialog.querySelector('.hypotheses-dropdown');
  const options = dialog.querySelector('#hypotheses-options');
  const clearButton = dialog.querySelector('.hypotheses-modal__clear');
  const selectedGroups = new Set();
  const groups = [...new Set(hypotheses.map((record) => record.category))];
  const optionNodes = [];
  const scrollArea = dialog.querySelector('.hypotheses-modal__scroll');
  const empty = dialog.querySelector('.hypotheses-modal__empty');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let closeTimer;
  let savedScroll = 0;
  let savedBodyStyle;
  let savedHtmlStyle;

  const format = (text) => globalThis.SiteTypography?.formatResearchText(text, true) ?? text;

  // Категории выводим из данных, выбранные группы объединяем без дубликатов.
  groups.forEach((group) => {
    const option = document.createElement('div');
    option.className = 'hypotheses-dropdown__option';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.tabIndex = -1;
    option.textContent = format(group);
    option.addEventListener('click', () => {
      if (selectedGroups.has(group)) selectedGroups.delete(group);
      else selectedGroups.add(group);
      updateFilter();
      renderList();
      option.focus({ preventScroll: true });
    });
    options.append(option);
    optionNodes.push(option);
  });
  // Невидимая строка удерживает ширину поля под самое длинное название.
  dialog.querySelector('.hypotheses-dropdown__sizer').textContent = format(
    groups.reduce((longest, group) => group.length > longest.length ? group : longest, 'Все гипотезы'),
  );

  function updateFilter() {
    const label = selectedGroups.size === 0 ? 'Все гипотезы'
      : selectedGroups.size === 1 ? [...selectedGroups][0]
        : `Выбрано групп: ${selectedGroups.size}`;
    filterValue.textContent = format(label);
    clearButton.disabled = selectedGroups.size === 0;
    optionNodes.forEach((option, index) => {
      option.setAttribute('aria-selected', String(selectedGroups.has(groups[index])));
    });
  }

  function closeDropdown(restoreFocus = false) {
    options.hidden = true;
    filter.setAttribute('aria-expanded', 'false');
    if (restoreFocus) filter.focus({ preventScroll: true });
  }

  function sizeDropdown() {
    if (options.hidden) return;
    // Панель может быть ниже обычного на маленьких экранах: скроллим только меню.
    const available = panel.getBoundingClientRect().bottom - filter.getBoundingClientRect().bottom - 16;
    options.style.maxHeight = `${Math.max(0, Math.min(320, available))}px`;
  }

  function openDropdown(index) {
    options.hidden = false;
    filter.setAttribute('aria-expanded', 'true');
    sizeDropdown();
    const selectedIndex = groups.findIndex((group) => selectedGroups.has(group));
    optionNodes[index ?? Math.max(0, selectedIndex)].focus({ preventScroll: true });
  }

  filter.addEventListener('click', () => {
    if (options.hidden) openDropdown();
    else closeDropdown(true);
  });
  filter.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openDropdown(event.key === 'ArrowUp' ? optionNodes.length - 1 : undefined);
    }
  });
  options.addEventListener('keydown', (event) => {
    const index = optionNodes.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % optionNodes.length;
    if (event.key === 'ArrowUp') next = (index - 1 + optionNodes.length) % optionNodes.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = optionNodes.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      optionNodes[next].focus();
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      optionNodes[index]?.click();
    }
  });
  clearButton.addEventListener('click', () => {
    selectedGroups.clear();
    updateFilter();
    renderList();
    // После отключения кнопки фокус возвращается в доступное поле.
    closeDropdown(true);
  });
  window.addEventListener('resize', sizeDropdown);
  updateFilter();
  const noun = { one: 'гипотеза', few: 'гипотезы', many: 'гипотез', other: 'гипотезы' };
  const plural = new Intl.PluralRules('ru').select(hypotheses.length);
  document.querySelectorAll('[data-hypotheses-total]').forEach((tag) => {
    tag.textContent = `${hypotheses.length}\u00A0${noun[plural]}`;
  });

  function renderList() {
    const records = hypotheses.filter((record) => selectedGroups.size === 0 || selectedGroups.has(record.category));
    const fragment = document.createDocumentFragment();
    records.forEach((record) => {
      const item = document.createElement('li');
      item.className = 'hypotheses-modal__item';
      const meta = document.createElement('div');
      meta.className = 'hypotheses-modal__meta';
      const number = document.createElement('span');
      number.className = 'hypotheses-modal__number';
      number.textContent = `№\u00A0${String(record.id).padStart(2, '0')}`;
      const category = document.createElement('span');
      category.textContent = format(record.category);
      const text = document.createElement('p');
      text.textContent = format(record.text);
      meta.append(number, category);
      item.append(meta, text);
      fragment.append(item);
    });
    list.replaceChildren(fragment);
    empty.hidden = records.length > 0;
    scrollArea.scrollTop = 0;
  }

  /* ======================================================
     03. БЛОКИРОВКА ФОНА — сохраняем позицию и ширину страницы
     Native dialog в top layer делает фон неактивным (inert).
     ====================================================== */
  // Подготовка исходных данных для раскрытия внутри общей исследовательской шторки.
  globalThis.SiteResearchMaterials ??= {};
  globalThis.SiteResearchMaterials['hypotheses-modal'] = () => { selectedGroups.clear(); closeDropdown(); updateFilter(); renderList(); };

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
    closeDropdown();
    if (reducedMotion.matches) finishClose();
    else {
      dialog.classList.add('is-closing');
      closeTimer = window.setTimeout(finishClose, 320);
    }
  }

  openButton.addEventListener('click', () => {
    if (dialog.open) return;
    selectedGroups.clear();
    closeDropdown();
    updateFilter();
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
    if (!options.hidden) closeDropdown(true);
    else requestClose();
  });
  let pressedOutside = false;
  dialog.addEventListener('pointerdown', (event) => {
    pressedOutside = event.target === dialog;
    if (!options.hidden && !dropdown.contains(event.target)) closeDropdown();
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
    if (event.key === 'Escape' && !options.hidden) {
      event.preventDefault();
      event.stopPropagation();
      closeDropdown(true);
      return;
    }
    if (event.key !== 'Tab') return;
    if (!options.hidden) closeDropdown(true);
    const focusable = [closeButton, filter, ...(!clearButton.disabled ? [clearButton] : []), scrollArea];
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
