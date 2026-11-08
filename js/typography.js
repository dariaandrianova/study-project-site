/* ========================================================
   ТИПОГРАФИКА — текстовые узлы, без innerHTML и правки атрибутов
   В HTML используем &nbsp;, в строках JavaScript — \u00A0.
   ======================================================== */
(() => {
  const nbsp = '\u00A0';
  const shortWords = new Set('в во с со к ко у о об обо на по за из от до и а но или да не ни же бы ли для без над под при про перед через мы вы он ты я'.split(' '));
  const unitPattern = /^(?:px|%|₽|руб\.?|кг|г|мг|км|м|см|мм|л|мл|ч|час(?:а|ов)?|мин|сек|с|дн(?:я|ей)?|лет|год(?:а|ов)?|°[СC]|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)$/i;

  // «По-новому», «по-человечески» и другие слова с по- не разрываем на дефисе.
  // Меняем только текст: пути файлов, HTML-атрибуты и код остаются нетронутыми.
  function bindPoPrefix(value) {
    return value.replace(/(^|[^А-Яа-яЁёA-Za-z0-9_\u2011-])(по)[-\u2010](?=[А-Яа-яЁё])/gi, '$1$2\u2011');
  }

  function formatText(value, removeFinalDot = false) {
    // Существующие неразрывные пробелы сохраняются, сущности не экранируются.
    const chunks = bindPoPrefix(value).split(/([ \t\u00A0]+)/);
    let groupLength = 0;
    let groupWords = 1;
    for (let i = 0; i < chunks.length; i += 2) {
      const word = chunks[i];
      groupLength += word.length;
      const next = chunks[i + 2];
      const space = chunks[i + 1];
      if (!space || !next) continue;
      const bareNext = next.replace(/[.,;:!?»”)]+$/, '');
      const bind = shortWords.has(word.toLowerCase())
        || (/^\d+(?:[.,]\d+)?$/.test(word) && unitPattern.test(bareNext))
        || (/^\d{4}$/.test(word) && /^(?:г\.|год(?:а|у)?)$/.test(bareNext))
        || (/^[А-ЯЁA-Z]\.$/.test(word) && /^[А-ЯЁA-Z]/.test(next));
      // Ограничение цепочки: максимум три слова и 32 символа.
      // Так «и в интерфейсе» остаётся вместе, но не склеивается весь абзац.
      if (space.includes(nbsp) || (bind && groupWords < 3 && groupLength + next.length <= 32)) {
        chunks[i + 1] = nbsp;
        groupWords += 1;
        groupLength += 1;
      } else {
        groupLength = 0;
        groupWords = 1;
      }
    }
    const result = chunks.join('');
    return removeFinalDot ? stripFinalDot(result) : result;
  }

  function stripFinalDot(value) {
    // Сохраняем многоточия, ?/! и точки распространённых сокращений.
    if (/(?:\.{2,}|(?:^|\s)(?:руб|[гГ]|[А-ЯЁA-Z])\.|[тТ]\.\s*[дп]\.)[»”"]*\s*$/.test(value)) return value;
    return value.replace(/([^.]|^)\.([»”"]*\s*)$/, '$1$2');
  }

  // Уточнённые правила только для Research и связанных с ним диалогов.
  const researchShortWords = new Set([...shortWords, 'как', 'что', 'чем', 'то', 'уж']);
  const postParticles = new Set(['же', 'бы', 'ли']);
  const researchUnits = /^(?:минута|минуты|минут|секунда|секунды|секунд|день|дня|дней|года|лет|человек|человека|USD|EUR)$/i;
  function formatResearchText(value, removeFinalDot = false) {
    const chunks = bindPoPrefix(value).split(/([ \t\u00A0]+)/);
    const cleanStart = (word) => word.replace(/^[«“„"'([{]+/, '');
    const cleanEnd = (word) => word.replace(/[.,;:!?»”"')\]}]+$/, '');
    const number = /^(?:[≈~]?[\d]+(?:[.,]\d+)?(?:[–−-]\d+(?:[.,]\d+)?)?)$/;
    let groupStart = 0;
    for (let i = 0; i + 2 < chunks.length; i += 2) {
      const word = cleanStart(chunks[i]);
      const next = chunks[i + 2];
      const bareNext = cleanEnd(cleanStart(next));
      const space = chunks[i + 1];
      if (space.includes(nbsp)) continue;
      const leading = researchShortWords.has(word.toLowerCase()) && !postParticles.has(word.toLowerCase());
      const particle = postParticles.has(bareNext.toLowerCase()) && !/[.,;:!?]$/.test(word);
      const numeric = number.test(word) && (unitPattern.test(bareNext) || researchUnits.test(bareNext));
      const thousands = /^\d{1,3}$/.test(word) && /^\d{3}$/.test(bareNext);
      const year = /^\d{4}$/.test(word) && /^(?:г\.|год(?:а|у)?)$/.test(bareNext);
      const initial = /^[А-ЯЁA-Z]\.$/.test(word) && /^[А-ЯЁA-Z]/.test(cleanStart(next));
      const dash = /^(?:—|–)$/.test(next) && !/[.,;:!?]$/.test(word);
      const approximate = /^(?:≈|~)$/.test(word) && number.test(bareNext);
      if (leading || particle || numeric || thousands || year || initial || dash || approximate) {
        // Учитываем уже склеенные слова справа: не строим длинные цепочки.
        let end = i + 2;
        while (chunks[end + 1]?.includes(nbsp) && chunks[end + 2]) end += 2;
        const groupWords = (end - groupStart) / 2 + 1;
        const length = chunks.slice(groupStart, end + 1).join('').length;
        if (groupWords <= 3 && length <= 32) chunks[i + 1] = nbsp;
      }
      if (chunks[i + 1] !== nbsp) groupStart = i + 2;
    }
    const result = chunks.join('');
    return removeFinalDot ? stripFinalDot(result) : result;
  }

  const blockSelector = 'h1,h2,h3,h4,h5,h6,p,li,figcaption,summary,button,a,span,div';
  const excluded = 'script,style,svg,code,pre,textarea,template,[contenteditable="true"],[data-typography="off"]';

  function apply(root = document.body) {
    if (!root || root.closest?.(excluded)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.trim() && !node.parentElement.closest(excluded)) nodes.push(node);
    }
    nodes.forEach((node) => {
      const block = node.parentElement.closest(blockSelector);
      let last = node;
      if (block) {
        const texts = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        while (texts.nextNode()) {
          if (texts.currentNode.nodeValue.trim() && !texts.currentNode.parentElement.closest(excluded)) last = texts.currentNode;
        }
      }
      const headingLineEnd = node.parentElement.closest('h1,h2,h3,h4,h5,h6') && node.nextSibling?.nodeName === 'BR';
      const formatter = node.parentElement.closest('[data-typography="research"]') ? formatResearchText : formatText;
      const next = formatter(node.nodeValue, last === node || headingLineEnd);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  globalThis.SiteTypography = { formatText, formatResearchText, apply };
  if (typeof document === 'undefined') return;
  apply();

  // Новые карточки и будущий контент получают те же правила автоматически.
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      apply();
    });
  }).observe(document.body, { childList: true, characterData: true, subtree: true });
})();
