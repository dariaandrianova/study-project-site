/* ========================================================
   01. JOB STORIES — исходные формулировки команды
   main — главная работа; stories — J1–J10 и критерии успеха;
   boundaries — ограничения; priorities — приоритеты задач после
   исследования, а не окончательный состав MVP.
   Редактируйте тексты здесь, сохраняя id и порядок записей.
   ======================================================== */
const jobStoriesData = {
  "main": "Когда я узнаю об ивенте, на который хочу попасть, я хочу быстро и недорого собрать поездку вокруг билета, чтобы прожить событие целиком («я там был») без ручного перебора сервисов и без потерь в день ивента",
  "stories": [
    {
      "id": "J1",
      "category": "functional",
      "title": "Поймать событие",
      "text": "Когда объявляют даты или открывают продажи, я хочу получить напоминание и сразу видеть визовость и доступность, чтобы успеть до sold out",
      "success": "узнал до sold out; напоминание сработало"
    },
    {
      "id": "J2",
      "category": "functional",
      "title": "Купить настоящие билеты",
      "text": "Когда я покупаю билеты на незнакомой площадке или в другой стране, я хочу быть уверенным в продавце, видеть номинал и оплатить своей картой (или через сервис), чтобы не переплатить ×2–5 и не сорвать покупку",
      "success": "цена = номинал ± понятная комиссия; оплата с первой попытки; именные билеты на всех без ручного сбора данных"
    },
    {
      "id": "J3",
      "category": "functional",
      "title": "Собрать поездку с фильтрами",
      "text": "Когда билет куплен, я хочу быстро выбрать недорогие удобные дорогу и жильё с фильтрами (цена, близость, длительность + дни до/после), чтобы не перебирать сервисы вручную. Жильё всегда можно заменить на своё",
      "success": "черновик — за минуту; компоненты заменяемы; сортировка «недорого/удобно» по умолчанию"
    },
    {
      "id": "J4",
      "category": "functional",
      "title": "Знать событие и уехать",
      "text": "Когда я собираюсь на площадку, я хочу заранее знать транспорт, вход, правила и способ уехать (ключевые точки на карте + логистика организатора), чтобы не блуждать, не терять вещи на досмотре и не стоять час в толпе",
      "success": "от двери до места без блужданий; уехал за 30 минут; всё работает офлайн"
    },
    {
      "id": "J5",
      "category": "functional",
      "title": "Держать компанию в курсе",
      "text": "Когда поездка собрана, я хочу поделиться планом в наш общий чат одной кнопкой, чтобы все видели билеты, адреса и тайминг",
      "success": "участники видят план без пересылки скринов"
    },
    {
      "id": "J6",
      "category": "functional",
      "title": "Вернуть деньги при отмене без возни",
      "text": "Когда ивент отменяют или переносят, я хочу запустить возврат билета и каскад по броням из одного места, чтобы не заниматься этим по разным сервисам",
      "success": "возврат инициирован в пару тапов; статусы видны"
    },
    {
      "id": "J7",
      "category": "functional",
      "title": "Занять свободное время под вкус",
      "text": "Когда у меня есть свободные часы вокруг ивента, я хочу хайлайты по моему типу (достопримечательности / бары / природа) и напоминания чекин/чекаут, чтобы ничего не планировать, но ничего не упустить",
      "success": "подборка по типу; напоминания пришли вовремя"
    },
    {
      "id": "J8",
      "category": "emotional-social",
      "title": "Не быть обманутым",
      "text": "Когда я плачу за билеты и жильё, я хочу быть уверенным, что не переплатил перекупу"
    },
    {
      "id": "J9",
      "category": "emotional-social",
      "title": "Быть хорошим организатором",
      "text": "Когда я зову компанию, я хочу выглядеть человеком, у которого «всё чётко»"
    },
    {
      "id": "J10",
      "category": "emotional-social",
      "title": "Присвоить событие",
      "text": "Когда событие прошло, я хочу зафиксировать «я там был» — коллекция, фото, память"
    }
  ],
  "boundaries": [
    {
      "title": "Не жёсткий пакет",
      "text": "Не создаём фиксированный тур, который нельзя изменить. Только конструктор с заменяемыми компонентами"
    },
    {
      "title": "Жильё можно заменить",
      "text": "Пользователь может указать собственное жильё, например остановиться у друзей"
    },
    {
      "title": "Не заменяем общение",
      "text": "Не пытаемся полностью перенести согласование компании в продукт. Даём возможность поделиться планом в существующем чате"
    },
    {
      "title": "Не давим бюджетом",
      "text": "Полную стоимость показываем справочно, без тревожных предупреждений и навязчивого контроля расходов"
    }
  ],
  "priorities": [
    {
      "priority": 1,
      "stories": "J2 + J4",
      "reason": "Две важные зоны: покупка билетов и день события"
    },
    {
      "priority": 2,
      "stories": "J3",
      "reason": "Ядро продукта — гибкая сборка дороги и жилья"
    },
    {
      "priority": 3,
      "stories": "J1",
      "reason": "Напоминания о событиях и старте продаж"
    },
    {
      "priority": 4,
      "stories": "J6 + J5",
      "reason": "Возвраты и возможность поделиться поездкой"
    },
    {
      "priority": 5,
      "stories": "J7",
      "reason": "Дополнительные активности и напоминания"
    }
  ]
};

/* ========================================================
   02. ПОЛНЫЙ СПИСОК — безопасный вывод через textContent
   ======================================================== */
(() => {
  const dialog = document.querySelector('#job-stories-modal');
  const openButton = document.querySelector('.job-stories-open');
  if (!dialog || !openButton) return;
  const closeButton = dialog.querySelector('.hypotheses-modal__close');
  const title = dialog.querySelector('#job-stories-modal-title');
  const content = dialog.querySelector('#job-stories-content');
  const scrollArea = dialog.querySelector('.hypotheses-modal__scroll');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let closeTimer;
  let savedScroll = 0;
  let savedBodyStyle;
  let savedHtmlStyle;
  const format = (text) => globalThis.SiteTypography?.formatResearchText(text, true) ?? text;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = format(text);
    return node;
  }

  function section(titleText) {
    const group = element('section', 'job-stories-detail');
    group.append(element('h3', '', titleText));
    return group;
  }

  function storyGroup(titleText, category) {
    const group = section(titleText);
    const list = element('ol', 'job-stories-detail__list');
    list.setAttribute('role', 'list');
    jobStoriesData.stories.filter((story) => story.category === category).forEach((story) => {
      const item = document.createElement('li');
      const heading = document.createElement('h4');
      heading.append(
        element('span', 'job-stories-detail__number', `${story.id} /`),
        element('span', '', story.title),
      );
      item.append(heading, element('p', '', story.text));
      if (story.success) {
        const success = element('p', 'job-stories-detail__success');
        success.append(
          element('strong', '', 'Критерий успеха: '),
          element('span', '', story.success),
        );
        item.append(success);
      }
      list.append(item);
    });
    group.append(list);
    return group;
  }

  function renderList() {
    const fragment = document.createDocumentFragment();
    const main = section('Главная работа');
    main.append(element('h4', '', 'Главная Job Story'), element('p', '', jobStoriesData.main));
    fragment.append(main);
    fragment.append(storyGroup('Функциональные Job Stories', 'functional'));
    fragment.append(storyGroup('Эмоциональные и социальные Job Stories', 'emotional-social'));
    const scope = section('Границы продукта и приоритизация');
    scope.append(element('h4', '', 'Что решили не делать'));
    const boundaries = element('dl', 'job-stories-detail__boundaries');
    jobStoriesData.boundaries.forEach((boundary) => {
      const entry = document.createElement('div');
      entry.append(element('dt', '', boundary.title), element('dd', '', boundary.text));
      boundaries.append(entry);
    });
    scope.append(boundaries);
    scope.append(element('h4', 'job-stories-detail__priority-title', 'Приоритизация Job Stories'));
    const table = element('table', 'job-stories-detail__table');
    const caption = element('caption', '', 'Порядок пользовательских задач после исследования');
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    ['Приоритет', 'Job Stories', 'Обоснование'].forEach((label) => {
      const cell = element('th', '', label);
      cell.setAttribute('scope', 'col');
      header.append(cell);
    });
    head.append(header);
    const body = document.createElement('tbody');
    jobStoriesData.priorities.forEach((priority) => {
      const row = document.createElement('tr');
      [String(priority.priority), priority.stories, priority.reason].forEach((text, index) => {
        const cell = element(index === 0 ? 'th' : 'td', '', text);
        if (index === 0) cell.setAttribute('scope', 'row');
        cell.setAttribute('data-label', ['Приоритет', 'Job Stories', 'Обоснование'][index]);
        row.append(cell);
      });
      body.append(row);
    });
    table.append(caption, head, body);
    scope.append(table, element('p', 'job-stories-detail__note', 'Таблица отражает приоритизацию пользовательских задач после исследования, а не окончательный состав MVP'));
    fragment.append(scope);
    content.replaceChildren(fragment);
    scrollArea.scrollTop = 0;
  }

  /* ======================================================
     03. БЛОКИРОВКА ФОНА — сохраняем позицию и ширину страницы
     Native dialog в top layer делает фон неактивным (inert).
     ====================================================== */
  // Подготовка исходных данных для раскрытия внутри общей исследовательской шторки.
  globalThis.SiteResearchMaterials ??= {};
  globalThis.SiteResearchMaterials['job-stories-modal'] = renderList;

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
