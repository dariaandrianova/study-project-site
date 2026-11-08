/* ========================================================
   01. VALUE PROPOSITION — тексты отдельно от SVG-геометрии
   Два круга по три сектора. title / lines / description — для редактирования.
   ======================================================== */
const valuePropositionData = [
  {
    "id": "value",
    "title": "Карта ценности продукта",
    "sectors": [
      {
        "id": "products",
        "title": "Товары и услуги",
        "lines": [
          "Товары",
          "и услуги"
        ],
        "description": "Event First помогает собрать поездку вокруг события: от покупки билета до выбора дороги, жилья и подготовки к мероприятию. В одном сценарии объединяются поиск вариантов, полезная информация, уведомления и возможность поделиться планом"
      },
      {
        "id": "gains",
        "title": "Факторы выгоды",
        "lines": [
          "Факторы",
          "выгоды"
        ],
        "description": "Пользователь получает удобные варианты поездки без ручного перебора сервисов. Можно менять компоненты, выбирать подходящее сочетание цены и комфорта, учитывать продолжительность поездки и собственные интересы"
      },
      {
        "id": "relievers",
        "title": "Факторы помощи",
        "lines": [
          "Факторы",
          "помощи"
        ],
        "description": "Сервис помогает снизить риск переплаты, упростить организацию дня события и заранее получить важную информацию о площадке и транспорте. При отмене или переносе мероприятия пользователь получает понятный сценарий дальнейших действий"
      }
    ]
  },
  {
    "id": "customer",
    "title": "Профиль потребителя",
    "sectors": [
      {
        "id": "benefits",
        "title": "Выгоды",
        "lines": [
          "Выгоды"
        ],
        "description": "Пользователям важно быстро находить доступные и удобные варианты, сохранять свободу выбора и получать нужную информацию вовремя. Они хотят меньше заниматься организационными мелочами и больше внимания уделять самому событию"
      },
      {
        "id": "jobs",
        "title": "Задачи",
        "lines": [
          "Задачи"
        ],
        "description": "Нужно вовремя купить билет, выбрать транспорт и жильё, подготовиться ко дню мероприятия и при необходимости согласовать поездку с компанией. При этом важно учитывать свободное время и особенности выбранного направления"
      },
      {
        "id": "pains",
        "title": "Проблемы",
        "lines": [
          "Проблемы"
        ],
        "description": "Подготовка распределена между разными сервисами. Пользователи сталкиваются с переплатами, сложностями оплаты и нехваткой информации о логистике. В день события дополнительные трудности возникают с транспортом, входом на площадку и возвращением домой"
      }
    ]
  }
];

/* ========================================================
   02. ГЕОМЕТРИЯ — полноценные клинья с тремя скруглёнными углами
   Радиальные стороны сдвинуты на 3 единицы: шов между соседями 6.
   Внешние скругления касательны к круговой дуге; центр — мягкий Q.
   ======================================================== */
function createRoundedVpcSector(index, count = 3) {
  const center = 180;
  const radius = 156;
  const gap = 3;
  const corner = 12;
  const angle = 2 * Math.PI / count;
  const start = -Math.PI / 2 + index * angle;
  const end = start + angle;
  const middle = (start + end) / 2;
  const unit = (a) => ({ x: Math.cos(a), y: Math.sin(a) });
  const point = (a, r = radius) => ({ x: center + Math.cos(a) * r, y: center + Math.sin(a) * r });
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  const offset = (p, v, distance) => ({ x: p.x + v.x * distance, y: p.y + v.y * distance });
  const tangentControl = (edge, direction, arc, arcAngle) => {
    const tangent = { x: -Math.sin(arcAngle), y: Math.cos(arcAngle) };
    const between = { x: arc.x - edge.x, y: arc.y - edge.y };
    return offset(edge, direction, cross(between, tangent) / cross(direction, tangent));
  };
  const u = unit(start);
  const v = unit(end);
  const vertex = point(middle, gap / Math.sin(angle / 2));
  const alpha = start + Math.asin(gap / radius);
  const beta = end - Math.asin(gap / radius);
  const outerStart = point(alpha);
  const outerEnd = point(beta);
  const arcStartAngle = alpha + corner / radius;
  const arcEndAngle = beta - corner / radius;
  const arcStart = point(arcStartAngle);
  const arcEnd = point(arcEndAngle);
  const controlStart = tangentControl(outerStart, u, arcStart, arcStartAngle);
  const controlEnd = tangentControl(outerEnd, v, arcEnd, arcEndAngle);
  const pair = (p) => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
  const d = [
    `M ${pair(offset(vertex, u, corner))}`,
    `L ${pair(offset(outerStart, u, -corner))}`,
    `Q ${pair(controlStart)} ${pair(arcStart)}`,
    `A ${radius} ${radius} 0 0 1 ${pair(arcEnd)}`,
    `Q ${pair(controlEnd)} ${pair(offset(outerEnd, v, -corner))}`,
    `L ${pair(offset(vertex, v, corner))}`,
    `Q ${pair(vertex)} ${pair(offset(vertex, u, corner))} Z`,
  ].join(' ');
  return {
    d,
    label: point(middle, 91),
    shift: { x: Math.cos(middle) * 8, y: Math.sin(middle) * 8 },
  };
}

/* ========================================================
   03. ОБЩИЙ SVG-КОМПОНЕНТ И ЕДИНЫЙ POPOVER
   Сектора имеют стабильную область наведения; анимируется только внутренняя форма.
   ======================================================== */
(() => {
  const panel = document.querySelector('#research-panel-value-proposition');
  const root = document.querySelector('#vpc-charts');
  const popover = document.querySelector('#vpc-popover');
  if (!panel || !root || !popover) return;
  const title = popover.querySelector('h4');
  const description = popover.querySelector('p');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const narrow = window.matchMedia('(max-width: 700px)');
  const format = (text) => globalThis.SiteTypography?.formatResearchText(text, true) ?? text;
  const diagrams = [];
  let active = null;
  let pinned = false;
  let leaveTimer;
  let hideTimer;
  let positionFrame;

  function svgElement(tag, attributes = {}) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function restoreOrder() {
    const focused = document.activeElement;
    const focusedSector = diagrams.some((diagram) => diagram.entries.some((entry) => entry.trigger === focused));
    diagrams.forEach((diagram) => diagram.svg.append(...diagram.entries.map((entry) => entry.trigger)));
    // Перестановка SVG-узлов может сбрасывать focus в некоторых браузерах.
    if (focusedSector && document.activeElement !== focused) focused.focus({ preventScroll: true });
  }

  function closePopover(immediate = false) {
    window.clearTimeout(leaveTimer);
    window.clearTimeout(hideTimer);
    if (active) {
      active.trigger.classList.remove('is-active');
      active.trigger.setAttribute('aria-expanded', 'false');
      active.trigger.removeAttribute('aria-describedby');
    }
    active = null;
    pinned = false;
    restoreOrder();
    popover.classList.remove('is-open');
    if (immediate) popover.hidden = true;
    else hideTimer = window.setTimeout(() => { popover.hidden = true; }, 180);
  }

  function positionPopover() {
    if (!active || popover.hidden) return;
    if (panel.hidden) { closePopover(true); return; }
    const edge = 16;
    const gap = 12;
    const rect = active.hit.getBoundingClientRect();
    const size = popover.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const width = size.width;
    const height = size.height;
    const middleX = (rect.left + rect.right) / 2;
    const middleY = (rect.top + rect.bottom) / 2;
    const candidates = [
      { x: rect.right + gap, y: middleY - height / 2 },
      { x: rect.left - width - gap, y: middleY - height / 2 },
      { x: middleX - width / 2, y: rect.bottom + gap },
      { x: middleX - width / 2, y: rect.top - height - gap },
    ];
    let position;
    if (narrow.matches) {
      const circle = active.svg.getBoundingClientRect();
      position = { x: (viewportWidth - width) / 2, y: circle.bottom + gap };
      if (position.y + height > viewportHeight - edge) {
        position.y = circle.top - height - gap >= edge ? circle.top - height - gap : viewportHeight - height - edge;
      }
    } else {
      position = candidates.find((candidate) => candidate.x >= edge && candidate.x + width <= viewportWidth - edge
        && candidate.y >= edge && candidate.y + height <= viewportHeight - edge);
      if (!position) {
        // При низком viewport сначала выбираем сторону, где помещается ширина.
        position = candidates.find((candidate) => candidate.x >= edge && candidate.x + width <= viewportWidth - edge) ?? candidates[2];
      }
    }
    popover.style.left = `${Math.round(Math.max(edge, Math.min(position.x, viewportWidth - width - edge)))}px`;
    popover.style.top = `${Math.round(Math.max(edge, Math.min(position.y, viewportHeight - height - edge)))}px`;
  }

  function openPopover(entry, pin = false) {
    window.clearTimeout(leaveTimer);
    window.clearTimeout(hideTimer);
    const wasPinned = active === entry && pinned;
    if (active !== entry) closePopover(true);
    window.clearTimeout(hideTimer);
    active = entry;
    pinned = pin || wasPinned;
    entry.trigger.classList.add('is-active');
    entry.trigger.setAttribute('aria-expanded', 'true');
    entry.trigger.setAttribute('aria-describedby', 'vpc-popover-description');
    // Последний SVG-элемент рисуется поверх соседей. Tab сначала восстанавливает порядок.
    const wasFocused = document.activeElement === entry.trigger;
    entry.svg.append(entry.trigger);
    if (wasFocused && document.activeElement !== entry.trigger) entry.trigger.focus({ preventScroll: true });
    title.textContent = format(entry.data.title);
    description.textContent = format(entry.data.description);
    popover.hidden = false;
    positionPopover();
    popover.classList.add('is-open');
  }

  function scheduleClose() {
    window.clearTimeout(leaveTimer);
    if (!pinned) leaveTimer = window.setTimeout(() => closePopover(), 180);
  }

  function createDiagram(data) {
    const figure = document.createElement('figure');
    figure.className = 'vpc-chart';
    const svg = svgElement('svg', {
      viewBox: '0 0 360 360', role: 'group',
      'aria-labelledby': `vpc-caption-${data.id}`, class: 'vpc-chart__svg',
    });
    const diagram = { svg, entries: [] };
    data.sectors.forEach((sector, index) => {
      const geometry = createRoundedVpcSector(index, data.sectors.length);
      const trigger = svgElement('g', {
        class: `vpc-sector vpc-sector--${index + 1}`, role: 'button', tabindex: '0',
        'aria-label': sector.title, 'aria-expanded': 'false', 'aria-controls': 'vpc-popover',
      });
      const hit = svgElement('path', { d: geometry.d, class: 'vpc-sector__hit', 'aria-hidden': 'true' });
      const shape = svgElement('g', { class: 'vpc-sector__shape', 'aria-hidden': 'true' });
      shape.style.transformOrigin = `${geometry.label.x}px ${geometry.label.y}px`;
      shape.style.setProperty('--vpc-shift-x', `${geometry.shift.x}px`);
      shape.style.setProperty('--vpc-shift-y', `${geometry.shift.y}px`);
      shape.append(svgElement('path', { d: geometry.d, class: 'vpc-sector__surface' }));
      const label = svgElement('text', { x: geometry.label.x, y: geometry.label.y, class: 'vpc-sector__label' });
      sector.lines.forEach((line, lineIndex) => {
        const span = svgElement('tspan', {
          x: geometry.label.x,
          dy: `${lineIndex === 0 ? (1 - sector.lines.length) * 0.6 : 1.2}em`,
        });
        span.textContent = format(line);
        label.append(span);
      });
      shape.append(label);
      trigger.append(hit, shape);
      svg.append(trigger);
      const entry = { trigger, hit, svg, shape, geometry, data: sector };
      diagram.entries.push(entry);
      trigger.addEventListener('pointerenter', (event) => {
        if (hover.matches && event.pointerType === 'mouse') openPopover(entry);
      });
      trigger.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse') scheduleClose();
      });
      trigger.addEventListener('click', (event) => {
        const tap = !hover.matches || event.detail === 0 || (event.pointerType && event.pointerType !== 'mouse');
        if (tap && active === entry) closePopover();
        else openPopover(entry, Boolean(tap));
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (active === entry) closePopover();
          else openPopover(entry, true);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closePopover();
        } else if (event.key === 'Tab') {
          // После SVG-перестановки клавиатура продолжает исходный порядок шести кнопок.
          closePopover(true);
        }
      });
    });
    const caption = document.createElement('figcaption');
    caption.id = `vpc-caption-${data.id}`;
    caption.textContent = format(data.title);
    figure.append(svg, caption);
    root.append(figure);
    diagrams.push(diagram);
  }

  function resizeLabels() {
    diagrams.forEach(({ svg, entries }) => {
      const width = svg.getBoundingClientRect().width;
      if (width <= 0) return;
      const scale = 360 / width;
      // Размер текста на экране не опускается ниже 14 px при уменьшении SVG.
      svg.style.setProperty('--vpc-label-size', `${Math.max(16, 14 * scale).toFixed(3)}px`);
      // Выдвижение остаётся равным 8 экранным px и на уменьшенном круге.
      entries.forEach(({ shape, geometry }) => {
        shape.style.setProperty('--vpc-shift-x', `${geometry.shift.x * scale}px`);
        shape.style.setProperty('--vpc-shift-y', `${geometry.shift.y * scale}px`);
      });
    });
  }

  valuePropositionData.forEach(createDiagram);
  resizeLabels();
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => { resizeLabels(); positionPopover(); });
    diagrams.forEach(({ svg }) => observer.observe(svg));
  }
  new MutationObserver(() => {
    if (panel.hidden) closePopover(true);
    else resizeLabels();
  }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  popover.addEventListener('pointerenter', () => window.clearTimeout(leaveTimer));
  popover.addEventListener('pointerleave', scheduleClose);
  document.addEventListener('pointerdown', (event) => {
    if (active && !active.trigger.contains(event.target) && !popover.contains(event.target)) closePopover();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && active) closePopover();
  });
  document.addEventListener('focusin', (event) => {
    if (active && !panel.contains(event.target) && !popover.contains(event.target)) closePopover();
  });
  document.addEventListener('scroll', (event) => {
    if (!active || popover.contains(event.target) || positionFrame) return;
    positionFrame = window.requestAnimationFrame(() => {
      positionFrame = 0;
      positionPopover();
    });
  }, { capture: true, passive: true });
  window.addEventListener('resize', () => { resizeLabels(); positionPopover(); });
  window.addEventListener('blur', () => closePopover(true));
})();
