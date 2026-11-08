/* ========================================================
   01. МАТРИЦА — единый источник формулировок и итогов: hypotheses
   Итог команды хранится в hypothesis.validationStatus / validationReason.
   Здесь отдельно хранятся только индивидуальные ответы респондентов:
   validationRespondents: { id: 'r1', name: 'Имя из матрицы' }
   responses у нужного number:
   { respondentId: 'r1', status: 'confirmed', observation: 'Обоснование' }
   Статусы: confirmed / partial / rejected / no-data.
   Старое unconfirmed поддерживается для сохранения индивидуальных данных.
   Итог команды не подменяет индивидуальные оценки.
   ======================================================== */
const validationRespondents = [];
const validationMatrix = hypotheses.map((hypothesis) => ({
  number: hypothesis.id,
  responses: [],
}));

/* ========================================================
   02. МАТРИЦА — таблица desktop и последовательный список mobile
   Данные выводим только через textContent.
   ======================================================== */
(() => {
  const dialog = document.querySelector('#validation-matrix-modal');
  const openButton = document.querySelector('.validation-matrix-open');
  if (!dialog || !openButton) return;
  const closeButton = dialog.querySelector('.hypotheses-modal__close');
  const title = dialog.querySelector('#validation-matrix-title');
  const scrollArea = dialog.querySelector('.hypotheses-modal__scroll');
  const tableViewport = dialog.querySelector('.validation-matrix__desktop');
  const table = dialog.querySelector('.validation-matrix__table');
  const head = dialog.querySelector('#validation-matrix-head');
  const body = dialog.querySelector('#validation-matrix-body');
  const mobile = dialog.querySelector('#validation-matrix-mobile');
  const notice = dialog.querySelector('#validation-matrix-notice');
  const legend = dialog.querySelector('#validation-matrix-legend');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 701px)');
  const hypothesesById = new Map(hypotheses.map((hypothesis) => [hypothesis.id, hypothesis]));
  const statuses = {
    confirmed: 'Подтверждено',
    partial: 'Частично',
    rejected: 'Не подтверждено',
    unconfirmed: 'Не подтверждено',
    'no-data': 'Нет данных',
  };
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

  function hypothesisHeading(record, headingTag) {
    const heading = element(headingTag, 'validation-matrix__hypothesis');
    heading.append(
      element('span', 'hypotheses-modal__number', `№\u00A0${String(record.number).padStart(2, '0')}`),
      element('p', '', hypothesesById.get(record.number).text),
    );
    return heading;
  }

  // Копируем те же встроенные SVG, что видны в модуле «Результат проверки».
  // Это работает и при открытии HTML с диска, без fetch и CSS-масок.
  function statusLabel(status, iconOnly = false) {
    const iconStatus = status === 'rejected' ? 'unconfirmed' : status;
    const label = element('span', `validation-status validation-status--${iconStatus}${iconOnly ? ' validation-status--icon-only' : ''}`);
    if (iconOnly) label.setAttribute('title', statuses[status]);
    const source = document.querySelector(`.validation-legend .validation-status--${iconStatus} .validation-legend__icon`);
    const icon = source ? source.cloneNode(true) : element('span', 'validation-status__icon');
    icon.setAttribute('aria-hidden', 'true');
    label.append(icon, element('span', 'validation-status__text', statuses[status]));
    return label;
  }

  function respondentResult(record, respondent) {
    const response = record.responses.find((entry) => entry.respondentId === respondent.id);
    const status = response && Object.hasOwn(statuses, response.status) ? response.status : 'no-data';
    const result = element('div', 'validation-matrix__result');
    result.append(statusLabel(status));
    if (response?.observation) result.append(element('p', 'muted', response.observation));
    return result;
  }

  function teamResult(hypothesis) {
    const result = element('div', 'validation-matrix__result');
    result.append(statusLabel(hypothesis.validationStatus, true));
    if (hypothesis.validationReason) result.append(element('p', 'muted', hypothesis.validationReason));
    return result;
  }

  function renderList() {
    const sourceLegend = document.querySelector('.validation-legend');
    const legendContent = document.createDocumentFragment();
    if (sourceLegend) legendContent.append(sourceLegend.cloneNode(true));
    legend.replaceChildren(legendContent);
    const header = document.createDocumentFragment();
    const headerRow = document.createElement('tr');
    const first = element('th', '', 'Гипотеза');
    first.setAttribute('scope', 'col');
    first.style.width = validationRespondents.length ? '520px' : 'calc(100% - 160px)';
    headerRow.append(first);
    const columnNames = ['Итог команды', ...validationRespondents.map((respondent) => respondent.name)];
    columnNames.forEach((name, index) => {
      const cell = element('th', '', name);
      cell.setAttribute('scope', 'col');
      cell.style.width = index === 0 ? '160px' : '240px';
      headerRow.append(cell);
    });
    header.append(headerRow);
    head.replaceChildren(header);
    const rows = document.createDocumentFragment();
    const cards = document.createDocumentFragment();
    validationMatrix.forEach((record) => {
      const sourceHypothesis = hypothesesById.get(record.number);
      if (!sourceHypothesis) return;
      const row = document.createElement('tr');
      const hypothesis = hypothesisHeading(record, 'th');
      hypothesis.setAttribute('scope', 'row');
      row.append(hypothesis);
      const finalStatus = document.createElement('td');
      finalStatus.append(teamResult(sourceHypothesis));
      row.append(finalStatus);
      const card = element('li', 'validation-matrix__entry');
      card.append(
        hypothesisHeading(record, 'div'),
        element('p', 'validation-matrix__team-label', 'Итог команды'),
        teamResult(sourceHypothesis),
      );
      if (validationRespondents.length) {
        const results = element('dl', 'validation-matrix__respondents');
        validationRespondents.forEach((respondent) => {
          const cell = document.createElement('td');
          cell.append(respondentResult(record, respondent));
          row.append(cell);
          const entry = document.createElement('div');
          const name = element('dt', '', respondent.name);
          const value = document.createElement('dd');
          value.append(respondentResult(record, respondent));
          entry.append(name, value);
          results.append(entry);
        });
        card.append(results);
      }
      rows.append(row);
      cards.append(card);
    });
    body.replaceChildren(rows);
    mobile.replaceChildren(cards);
    const counts = hypotheses.reduce((totals, hypothesis) => {
      totals[hypothesis.validationStatus] += 1;
      return totals;
    }, { confirmed: 0, partial: 0, rejected: 0 });
    notice.textContent = format(`Итог команды: подтверждено — ${counts.confirmed}, частично — ${counts.partial}, не подтверждено — ${counts.rejected}${validationRespondents.length ? '. Индивидуальные оценки респондентов показаны отдельно' : ''}`);
    table.style.minWidth = `${680 + validationRespondents.length * 240}px`;
    tableViewport.scrollLeft = 0;
    scrollArea.scrollTop = 0;
  }

  /* ======================================================
     03. БЛОКИРОВКА ФОНА — сохраняем позицию и ширину страницы
     Native dialog в top layer делает фон неактивным (inert).
     ====================================================== */
  // Подготовка исходных данных для раскрытия внутри общей исследовательской шторки.
  globalThis.SiteResearchMaterials ??= {};
  globalThis.SiteResearchMaterials['validation-matrix-modal'] = renderList;

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
    const focusable = [closeButton, scrollArea, ...(desktop.matches ? [tableViewport] : [])];
    const index = focusable.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && (index === -1 || index === focusable.length - 1)) {
      event.preventDefault();
      closeButton.focus();
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && closing) finishClose();
  });
})();
