/* ========================================================
   01. ИНТЕРВЬЮ-ГАЙД — 48 исходных вопросов, 7 этапов
   Редактируйте единый массив: id — уникальный номер,
   stage — название этапа, question — вопрос, duration — минуты.
   subgroup — необязательный подзаголовок внутри этапа.
   Порядок массива определяет порядок этапов и вопросов.
   ======================================================== */
const interviewGuideQuestions = [
  {
    id: "01-01",
    stage: "Разогрев",
    question: "Расскажи, часто ли ты ездишь на события в другие города?",
    duration: 3,
  },
  {
    id: "01-02",
    stage: "Разогрев",
    question: "Какая поездка была последней?",
    duration: 3,
  },
  {
    id: "02-01",
    stage: "Реконструкция поездки",
    question: "С чего всё началось? Как ты узнал(а) про событие?",
    duration: 12,
  },
  {
    id: "02-02",
    stage: "Реконструкция поездки",
    question: "Что было первым действием после решения поехать?",
    duration: 12,
  },
  {
    id: "02-03",
    stage: "Реконструкция поездки",
    question: "Что делал(а) дальше? Расскажи по шагам",
    duration: 12,
  },
  {
    id: "02-04",
    stage: "Реконструкция поездки",
    question: "Какими сайтами и приложениями пользовался(ась)?",
    duration: 12,
  },
  {
    id: "02-05",
    stage: "Реконструкция поездки",
    question: "Где хранил(а) билеты, расписание, адреса и другую информацию?",
    duration: 12,
  },
  {
    id: "02-06",
    stage: "Реконструкция поездки",
    question: "Составлял(а) ли расписание по дням? Где?",
    duration: 12,
  },
  {
    id: "02-07",
    stage: "Реконструкция поездки",
    question: "Сколько времени заняла подготовка?",
    duration: 12,
  },
  {
    id: "02-08",
    stage: "Реконструкция поездки",
    question: "Это был один непрерывный процесс или ты возвращался(ась) к подготовке несколько раз?",
    duration: 12,
  },
  {
    id: "02-09",
    stage: "Реконструкция поездки",
    question: "В какой момент подготовка перестала быть приятной?",
    duration: 12,
  },
  {
    id: "03-01",
    stage: "Компания и согласование",
    question: "Ты ездил(а) один (одна) или с кем-то? Сколько вас было?",
    duration: 8,
  },
  {
    id: "03-02",
    stage: "Компания и согласование",
    question: "Кто занимался организацией поездки?",
    duration: 8,
  },
  {
    id: "03-03",
    stage: "Компания и согласование",
    question: "Как и где вы договаривались?",
    duration: 8,
  },
  {
    id: "03-04",
    stage: "Компания и согласование",
    question: "Сколько времени ушло на согласование участников и дат?",
    duration: 8,
  },
  {
    id: "03-05",
    stage: "Компания и согласование",
    question: "Были ситуации, когда кто-то задерживал принятие решения или отказывался от поездки? Что делали?",
    duration: 8,
  },
  {
    id: "03-06",
    stage: "Компания и согласование",
    question: "Кто за что платил?",
    duration: 8,
  },
  {
    id: "03-07",
    stage: "Компания и согласование",
    question: "Как потом рассчитывались между собой?",
    duration: 8,
  },
  {
    id: "03-08",
    stage: "Компания и согласование",
    question: "Были ситуации, когда кто-то остался должен?",
    duration: 8,
  },
  {
    id: "04-01",
    stage: "Жильё и день события",
    question: "Где вы жили? Как выбирали жильё?",
    duration: 8,
  },
  {
    id: "04-02",
    stage: "Жильё и день события",
    question: "Насколько далеко оно находилось от площадки?",
    duration: 8,
  },
  {
    id: "04-03",
    stage: "Жильё и день события",
    question: "Рассматривали варианты дешевле, но дальше от мероприятия? Почему выбрали итоговый?",
    duration: 8,
  },
  {
    id: "04-04",
    stage: "Жильё и день события",
    question: "Сколько стоило жильё? Было ли дороже привычного?",
    duration: 8,
  },
  {
    id: "04-05",
    stage: "Жильё и день события",
    question: "Как добирались до площадки в день события?",
    duration: 8,
  },
  {
    id: "04-06",
    stage: "Жильё и день события",
    question: "Как возвращались после мероприятия?",
    duration: 8,
  },
  {
    id: "04-07",
    stage: "Жильё и день события",
    question: "Что делали с вещами? Приходилось ли где-то их оставлять?",
    duration: 8,
  },
  {
    id: "04-08",
    stage: "Жильё и день события",
    question: "Возникали ситуации, когда что-то не предусмотрели заранее и пришлось решать на месте?",
    duration: 8,
  },
  {
    id: "05-01",
    stage: "Сбои",
    question: "Что-нибудь пошло не по плану во время подготовки или самой поездки?",
    duration: 7,
  },
  {
    id: "05-02",
    stage: "Сбои",
    question: "Были отмены, переносы или изменения состава участников?",
    duration: 7,
  },
  {
    id: "05-03",
    stage: "Сбои",
    question: "Что именно произошло и как ты действовал(а)?",
    duration: 7,
  },
  {
    id: "05-04",
    stage: "Сбои",
    question: "Сколько времени ушло на изменение планов?",
    duration: 7,
  },
  {
    id: "05-05",
    stage: "Сбои",
    question: "Что чувствовал(а) в тот момент?",
    duration: 7,
  },
  {
    id: "05-06",
    stage: "Сбои",
    question: "Были ситуации, когда билет на событие уже куплен, но поездка не складывалась? Что делал(а) с билетом?",
    duration: 7,
  },
  {
    id: "05-07",
    stage: "Сбои",
    question: "Приходилось продавать билет или отказываться от поездки? Почему?",
    duration: 7,
  },
  {
    id: "06-01",
    stage: "Деньги и выбор события",
    question: "Во сколько в итоге обошлась вся поездка?",
    duration: 11,
    subgroup: "Деньги",
  },
  {
    id: "06-02",
    stage: "Деньги и выбор события",
    question: "Когда только начинал(а) подготовку, представлял(а) итоговую сумму?",
    duration: 11,
    subgroup: "Деньги",
  },
  {
    id: "06-03",
    stage: "Деньги и выбор события",
    question: "В какой момент понял(а), что поездка получается дороже ожидаемого?",
    duration: 11,
    subgroup: "Деньги",
  },
  {
    id: "06-04",
    stage: "Деньги и выбор события",
    question: "Где и как рассчитывал(а) общий бюджет?",
    duration: 11,
    subgroup: "Деньги",
  },
  {
    id: "06-05",
    stage: "Деньги и выбор события",
    question: "Пользовался(ась) когда-нибудь готовым туром или пакетом под событие?",
    duration: 11,
    subgroup: "Деньги",
  },
  {
    id: "06-06",
    stage: "Деньги и выбор события",
    question: "Были случаи, когда платил(а) больше, чтобы самостоятельно не заниматься организацией? Расскажи подробнее",
    duration: 11,
    subgroup: "Деньги",
  },
  {
    id: "06-07",
    stage: "Деньги и выбор события",
    question: "Откуда узнаёшь о предстоящих событиях?",
    duration: 11,
    subgroup: "Выбор события и источники",
  },
  {
    id: "06-08",
    stage: "Деньги и выбор события",
    question: "Проверяешь сайты специально или следишь за определёнными артистами и организаторами?",
    duration: 11,
    subgroup: "Выбор события и источники",
  },
  {
    id: "06-09",
    stage: "Деньги и выбор события",
    question: "Бывает, что выбираешь между несколькими событиями, например концертами одного артиста в разных городах?",
    duration: 11,
    subgroup: "Выбор события и источники",
  },
  {
    id: "06-10",
    stage: "Деньги и выбор события",
    question: "Как выбираешь, где покупать билеты? Почему именно там?",
    duration: 11,
    subgroup: "Выбор события и источники",
  },
  {
    id: "06-11",
    stage: "Деньги и выбор события",
    question: "На чьи рекомендации ориентируешься — друзей, сообществ, блогеров?",
    duration: 11,
    subgroup: "Выбор события и источники",
  },
  {
    id: "07-01",
    stage: "Завершение",
    question: "Если бы собирал(а) эту поездку заново, что сделал(а) бы иначе?",
    duration: 3,
  },
  {
    id: "07-02",
    stage: "Завершение",
    question: "Есть ли что-то важное, о чём я не спросил(а)?",
    duration: 3,
  },
  {
    id: "07-03",
    stage: "Завершение",
    question: "Есть ли у тебя знакомые, которые тоже путешествуют ради событий? Можешь нас познакомить?",
    duration: 3,
  },
];

/* ========================================================
   02. ГАЙД — те же стили и поведение диалога, что у гипотез
   Все этапы показаны вместе, рендер безопасный: только textContent.
   ======================================================== */
(() => {
  const dialog = document.querySelector('#interview-guide-modal');
  const openButton = document.querySelector('.interview-guide-open');
  if (!dialog || !openButton) return;
  const closeButton = dialog.querySelector('.hypotheses-modal__close');
  const title = dialog.querySelector('#interview-guide-title');
  const list = dialog.querySelector('#interview-guide-list');
  const scrollArea = dialog.querySelector('.hypotheses-modal__scroll');
  const duration = dialog.querySelector('#interview-guide-duration');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let closeTimer;
  let savedScroll = 0;
  let savedBodyStyle;
  let savedHtmlStyle;

  const format = (text) => globalThis.SiteTypography?.formatResearchText(text, true) ?? text;

  function renderList() {
    // Группируем по этапам, сохраняя исходный порядок единого массива.
    const stages = new Map();
    interviewGuideQuestions.forEach((record) => {
      if (!stages.has(record.stage)) stages.set(record.stage, { duration: record.duration, questions: [] });
      stages.get(record.stage).questions.push(record);
    });
    const fragment = document.createDocumentFragment();
    const minuteForms = { one: 'минута', few: 'минуты', many: 'минут', other: 'минуты' };
    const minuteWordFor = (minutes) => minuteForms[new Intl.PluralRules('ru').select(minutes)];
    let stageNumber = 0;
    stages.forEach((stage, name) => {
      stageNumber += 1;
      const item = document.createElement('li');
      item.className = 'interview-guide__stage';
      const heading = document.createElement('h3');
      heading.textContent = format(`${String(stageNumber).padStart(2, '0')} / ${name} — ${stage.duration}\u00A0${minuteWordFor(stage.duration)}`);
      item.append(heading);
      let currentSubgroup;
      let questions;
      stage.questions.forEach((record, index) => {
        if (!questions || record.subgroup !== currentSubgroup) {
          currentSubgroup = record.subgroup;
          if (currentSubgroup) {
            const subgroup = document.createElement('h4');
            subgroup.className = 'interview-guide__subgroup';
            subgroup.textContent = format(currentSubgroup);
            item.append(subgroup);
          }
          questions = document.createElement('ol');
          questions.className = 'interview-guide__questions';
          questions.setAttribute('role', 'list');
          questions.start = index + 1;
          item.append(questions);
        }
        const question = document.createElement('li');
        const number = document.createElement('span');
        number.className = 'interview-guide__question-number';
        number.setAttribute('aria-hidden', 'true');
        number.textContent = `${index + 1}.`;
        const wording = document.createElement('p');
        wording.textContent = format(record.question);
        question.append(number, wording);
        questions.append(question);
      });
      fragment.append(item);
    });
    list.replaceChildren(fragment);
    const total = [...stages.values()].reduce((sum, stage) => sum + stage.duration, 0);
    const minuteWord = minuteWordFor(total);
    duration.textContent = format(`Общая продолжительность по сценарию — ${total}\u00A0${minuteWord}, то есть около ${Math.round(total / 10) * 10}\u00A0минут`);
    scrollArea.scrollTop = 0;
  }

  /* ======================================================
     03. БЛОКИРОВКА ФОНА — сохраняем позицию и ширину страницы
     Native dialog в top layer делает фон неактивным (inert).
     ====================================================== */
  // Подготовка исходных данных для раскрытия внутри общей исследовательской шторки.
  globalThis.SiteResearchMaterials ??= {};
  globalThis.SiteResearchMaterials['interview-guide-modal'] = renderList;

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
