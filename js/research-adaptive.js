/* ========================================================
   ИССЛЕДОВАНИЯ: 4 группы / 10 кратких фактических выжимок.
   Подробности — существующие desktop-панели и исходные материалы.
   ======================================================== */
(() => {
  const section = document.querySelector('#research');
  const root = section?.querySelector('.research-adaptive');
  const sheet = document.querySelector('#research-topic-sheet');
  if (!root || !sheet || !globalThis.SiteDialog) return;
  const content = sheet.querySelector('.research-topic-sheet__content');
  const title = sheet.querySelector('h2');
  const adaptive = window.matchMedia('(max-width: 1024px)');
  const groups = [
    { title: '01 / Поиск направления', topics: [
      ['ideas', 'Выбрали Event First — сервис, в котором событие становится отправной точкой для планирования поездки'],
      ['audience', 'В фокусе — люди, которые посещают события в других городах и самостоятельно организуют дорогу, жильё и логистику'],
      ['competitors', 'Отдельные сервисы закрывают покупку билетов, дорогу или жильё. Пользователю приходится собирать поездку между ними'],
    ] },
    { title: '02 / Проверка предположений', topics: [
      ['hypotheses', 'Сформулировали 27 гипотез о планировании, расходах, выборе и трудностях поездки'],
      ['interviews', 'Выяснили, как люди готовятся к поездкам на события, что выбирают заранее и где возникают сложности'],
      ['validation', 'Из 27 гипотез: 6 подтвердились, 12 — частично, 9 — не подтвердились'],
    ] },
    { title: '03 / Определение ценности', topics: [
      ['job-stories', 'Выделили ситуации, в которых пользователь хочет собрать поездку, сравнить варианты и подготовиться ко дню события'],
      ['value-proposition', 'Главная ценность — собрать поездку вокруг билета, сохранив возможность самостоятельно выбирать компоненты'],
    ] },
    { title: '04 / Формирование продукта', topics: [
      ['mvp', 'В приоритете — черновик поездки, выбор компонентов, информация о событии и возможность поделиться планом'],
      ['tone-of-voice', 'Характер общения — местный гид: говорит просто, по делу и не скрывает важные условия'],
    ] },
  ];
  const openers = [];
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  groups.forEach((group) => {
    const accordion = element('details', 'research-accordion');
    accordion.append(element('summary', 'research-accordion__summary', group.title));
    const topics = element('div', 'research-accordion__topics');
    group.topics.forEach(([id, summary]) => {
      const name = document.querySelector(`#research-tab-${id}`).textContent;
      const module = element('article', 'research-summary-module');
      module.append(element('h3', '', name), element('p', '', summary));
      const footer = element('div', 'modal-action-footer');
      const opener = element('button', 'modal-action-button research-topic-open', 'Подробнее ');
      opener.type = 'button';
      opener.dataset.researchTopic = id;
      opener.setAttribute('aria-haspopup', 'dialog');
      opener.setAttribute('aria-controls', sheet.id);
      opener.setAttribute('aria-label', `Подробнее: ${name}`);
      const arrow = document.createElement('img');
      Object.assign(arrow, { src: 'assets/icons/arrow-up-right.svg', alt: '', width: 24, height: 24 });
      opener.append(arrow);
      footer.append(opener);
      module.append(footer);
      topics.append(module);
      openers.push(opener);
    });
    accordion.append(topics);
    root.append(accordion);
  });

  // Переносим реальные DOM-узлы с их данными и обработчиками; не клонируем id.
  let restoreActions = [];
  function borrow(node, destination) {
    const marker = document.createComment('Место исходного исследовательского содержимого');
    node.before(marker);
    destination.append(node);
    restoreActions.push(() => marker.replaceWith(node));
  }
  function restore() {
    restoreActions.reverse().forEach((action) => action());
    restoreActions = [];
    content.replaceChildren();
  }
  function addInlineMaterial(button) {
    const source = document.getElementById(button.getAttribute('aria-controls'));
    if (!source?.matches('dialog.hypotheses-modal')) return;
    globalThis.SiteResearchMaterials?.[source.id]?.();
    const details = element('details', 'research-inline-material');
    details.append(element('summary', '', button.textContent.trim()));
    const body = element('div', 'research-inline-material__body');
    const description = source.querySelector('.hypotheses-modal__header > p');
    if (description) {
      const intro = description.cloneNode(true);
      intro.removeAttribute('id');
      intro.classList.add('research-inline-description');
      body.append(intro);
    }
    // Полный список гипотез выводится сразу, без второго слоя фильтра/overlay.
    const sourceScroll = source.querySelector('.hypotheses-modal__scroll');
    [...sourceScroll.children].forEach((node) => borrow(node, body));
    details.append(body);
    const marker = document.createComment('Кнопка desktop-модального окна');
    button.before(marker);
    button.replaceWith(details);
    restoreActions.push(() => { details.remove(); marker.replaceWith(button); });
  }
  function addVpcDetails(panel) {
    const charts = panel.querySelector('#vpc-charts');
    if (!charts || typeof valuePropositionData === 'undefined') return;
    const hint = panel.querySelector('.vpc-hint');
    const hintWasHidden = hint?.hidden;
    if (hint) hint.hidden = true;
    restoreActions.push(() => { if (hint) hint.hidden = hintWasHidden; });
    const previous = charts.inert;
    charts.inert = true;
    restoreActions.push(() => { charts.inert = previous; });
    // На touch-экране все пояснения доступны в потоке, без плавающего overlay.
    const explanations = element('div', 'research-vpc-details');
    valuePropositionData.forEach((diagram) => {
      const group = element('section', 'research-vpc-details__group');
      group.append(element('h3', '', diagram.title));
      diagram.sectors.forEach((sector) => {
        const details = element('details', 'research-inline-material');
        details.append(element('summary', '', sector.title), element('p', '', sector.description));
        group.append(details);
      });
      explanations.append(group);
    });
    content.append(explanations);
    restoreActions.push(() => explanations.remove());
  }
  globalThis.SiteDialog.connect(sheet, openers, {
    beforeOpen(opener) {
      if (!adaptive.matches) return false;
      const id = opener.dataset.researchTopic;
      const panel = document.getElementById(`research-panel-${id}`);
      if (!panel) return false;
      title.textContent = document.querySelector(`#research-tab-${id}`).textContent;
      const attributes = ['role', 'aria-labelledby', 'tabindex'].map((name) => [name, panel.getAttribute(name)]);
      const wasHidden = panel.hidden;
      borrow(panel, content);
      panel.hidden = false;
      attributes.forEach(([name]) => panel.removeAttribute(name));
      restoreActions.push(() => {
        panel.hidden = wasHidden;
        attributes.forEach(([name, value]) => value === null ? panel.removeAttribute(name) : panel.setAttribute(name, value));
      });
      [...panel.querySelectorAll('button[aria-haspopup="dialog"][aria-controls]')].forEach(addInlineMaterial);
      if (id === 'value-proposition') addVpcDetails(panel);
      globalThis.SiteTypography?.apply(content);
    },
    afterClose() {
      restore();
      if (!adaptive.matches) section.focus({ preventScroll: true });
    },
  });
  // Внутри шторки не запускаем прежние модальные/межтабовые переходы.
  content.addEventListener('click', (event) => {
    if (event.target.closest('button[aria-haspopup="dialog"]')) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  }, true);
  adaptive.addEventListener('change', () => {
    if (!adaptive.matches && sheet.open) sheet.close();
  });
  globalThis.SiteTypography?.apply(root);
  root.hidden = false;
  section.classList.add('research-has-adaptive');
})();
