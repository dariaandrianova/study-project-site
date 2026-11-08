/* ПРОЕКТ В АДАПТИВЕ: краткая карточка и одна общая шторка.
   Полные данные, SVG и работающий видеопереключатель берём из desktop.
   Перемещённые узлы возвращаются точно на место после закрытия. */
(() => {
  const section = document.querySelector('#project');
  const root = section?.querySelector('.project-adaptive');
  const sheet = document.querySelector('#project-details-sheet');
  if (!root || !sheet || !globalThis.SiteDialog) return;
  const content = sheet.querySelector('.project-details-content');
  const adaptive = matchMedia('(max-width: 1024px)');
  let restores = [];
  function borrow(node, target) {
    const marker = document.createComment('Исходное место материала проекта');
    node.before(marker);
    target.append(node);
    restores.push(() => marker.replaceWith(node));
  }
  function group(label, title) {
    const block = document.createElement('section');
    block.className = 'project-details-group';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = label;
    const heading = document.createElement('h3');
    heading.textContent = title;
    block.append(eyebrow, heading);
    content.append(block);
    return block;
  }
  function copyText(source, target, selector) {
    source.querySelectorAll(selector).forEach((node) => target.append(node.cloneNode(true)));
  }
  function restore() {
    sheet.querySelector('video')?.pause();
    restores.reverse().forEach((action) => action());
    restores = [];
    content.replaceChildren();
  }
  SiteDialog.connect(sheet, root.querySelector('.project-details-open'), {
    beforeOpen() {
      if (!adaptive.matches) return false;
      const concept = section.querySelector('.project-concept');
      const intro = group('01 / Концепция продукта', concept.querySelector('h3').textContent);
      copyText(concept, intro, ':scope > p:not(.eyebrow), :scope > .tags');

      const prototypes = group('02 / Прототипы и сценарии', 'От концепции — к интерфейсам');
      borrow(section.querySelector('.project-prototype'), prototypes);
      globalThis.SiteProjectVideo?.reset();

      const metrics = group('03 / Метрики', 'NSM / Количество собранных поездок');
      copyText(section.querySelector('.project-nsm'), metrics, ':scope > p:not(.eyebrow):not(.project-nsm__accent)');
      copyText(document.querySelector('#project-metrics-modal header'), metrics, ':scope > p');
      // У клонированного описания нет повторного id / ARIA-связей.
      metrics.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      [...document.querySelector('.project-metrics-content').children].forEach((node) => borrow(node, metrics));

      const decisions = group('04 / Продуктовые решения', 'От исследований — к интерфейсам');
      // Утверждённые описания из backups/before-project-components/index.html.
      const items = [
        ['Конструктор вместо готового пакета', 'Пользователь сам выбирает дорогу и жильё, меняет компоненты и сохраняет свободу выбора'],
        ['Логистика дня события', 'Помогаем заранее разобраться с транспортом, площадкой и возвращением после мероприятия'],
        ['Информация в нужный момент', 'Показываем важные детали и подсказки тогда, когда они действительно необходимы'],
      ];
      const list = document.createElement('div');
      list.className = 'project-details-decisions';
      items.forEach(([title, description]) => {
        const item = document.createElement('div');
        const heading = document.createElement('h4');
        heading.textContent = title;
        const text = document.createElement('p');
        text.textContent = description;
        item.append(heading, text);
        list.append(item);
      });
      decisions.append(list);
      const palette = section.querySelector('.project-palette');
      const colors = group('05 / Цветовая палитра', palette.querySelector('h3').textContent);
      copyText(palette, colors, ':scope > p:not(.eyebrow)');
      borrow(palette.querySelector('.project-color-scales'), colors);
      const kit = section.querySelector('.project-design-system');
      const components = group('06 / Дизайн-система', kit.querySelector('h3').textContent);
      copyText(kit, components, ':scope > p:not(.eyebrow)');
      borrow(kit.querySelector('.project-showcase'), components);
      SiteTypography?.apply(content);
    },
    afterClose: restore,
  });
  adaptive.addEventListener('change', () => {
    if (!adaptive.matches && sheet.open) {
      sheet.close();
      section.focus({ preventScroll: true });
    }
  });
  SiteTypography?.apply(root);
  root.hidden = false;
  section.classList.add('project-has-adaptive');
})();
