/* ========================================================
   ОШИБКИ ЗАГРУЗКИ — общий алерт и компактное состояние изображений.
   Никаких автоматических циклов: повторяем только по нажатию пользователя.
   ======================================================== */
(() => {
  const alerts = new WeakMap();
  const inFlight = new WeakMap();
  const imageStates = new WeakMap();
  const failedImages = new Set();
  const connected = new WeakSet();
  const ns = 'http://www.w3.org/2000/svg';
  function icon(kind) {
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', kind === 'retry'
      ? 'M20 7V3M20 7H16M20 7A9 9 0 1 0 21 14'
      : 'M12 3L22 21H2L12 3ZM12 9V14M12 17V17.1');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.append(path);
    return svg;
  }
  function textNode(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }
  function retryButton(label, operation, success) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'error-retry';
    button.append(icon('retry'), textNode('span', '', label));
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (button.disabled) return;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      try {
        await operation();
        success();
      } catch {
        // Ошибка остаётся видимой; повтор доступен после завершения операции.
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
      }
    });
    return button;
  }
  function once(container, operation) {
    if (inFlight.has(container)) return inFlight.get(container);
    const task = Promise.resolve().then(operation);
    inFlight.set(container, task);
    task.then(() => inFlight.delete(container), () => inFlight.delete(container));
    return task;
  }
  function clear(container) { alerts.get(container)?.clear(); }
  function show(container, { retry, focusTarget }) {
    if (alerts.has(container)) return alerts.get(container);
    const alert = document.createElement('div');
    alert.className = 'load-alert';
    alert.setAttribute('role', 'alert');
    const warning = icon('warning');
    warning.classList.add('load-alert__icon');
    const copy = document.createElement('div');
    copy.className = 'load-alert__copy';
    copy.append(textNode('p', 'load-alert__title', 'Ох, ёпт, чёт не получилось'),
      textNode('p', 'load-alert__description', 'Попробуй ещё раз'));
    const clear = () => { alert.remove(); alerts.delete(container); };
    alert.append(warning, copy, retryButton('Попробовать ещё раз', () => once(container, retry), () => {
      const hadFocus = alert.contains(document.activeElement);
      clear();
      if (hadFocus) {
        const target = focusTarget || container.querySelector('video,button,a[href],[tabindex]') || container;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }));
    container.append(alert);
    const instance = { element: alert, clear };
    alerts.set(container, instance);
    globalThis.SiteTypography?.apply(alert);
    return instance;
  }
  // Для будущих запросов: операция должна отклонить Promise при реальной ошибке.
  async function run(container, operation) {
    try { await once(container, operation); clear(container); }
    catch { show(container, { retry: operation }); }
  }
  globalThis.SiteErrors = { show, run, clear };

  function positionFallback(img) {
    const state = imageStates.get(img);
    if (!state || !img.isConnected) return;
    const rect = img.getBoundingClientRect();
    const host = state.host.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0;
    state.fallback.hidden = !visible;
    if (!visible) return;
    Object.assign(state.fallback.style, {
      left: `${rect.left - host.left + state.host.scrollLeft - state.host.clientLeft}px`,
      top: `${rect.top - host.top + state.host.scrollTop - state.host.clientTop}px`,
      width: `${rect.width}px`, height: `${rect.height}px`,
      borderRadius: getComputedStyle(img).borderRadius,
    });
    state.fallback.classList.toggle('image-error--tiny', rect.width < 100 || rect.height < 64);
  }
  function clearImage(img) {
    const state = imageStates.get(img);
    if (!state) return;
    const hadFocus = state.fallback.contains(document.activeElement);
    state.fallback.remove();
    img.classList.remove('image-load-failed');
    failedImages.delete(img);
    imageStates.delete(img);
    resizeObserver?.unobserve(img);
    if (hadFocus) {
      const target = img.closest('a,button') || img;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
  function retryImage(img, source) {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        img.removeEventListener('load', success);
        img.removeEventListener('error', failure);
      };
      const success = () => { cleanup(); resolve(); };
      const failure = () => { cleanup(); reject(new Error('Изображение не загружено')); };
      const timer = setTimeout(failure, 20000);
      img.addEventListener('load', success);
      img.addEventListener('error', failure);
      // Повторяем исходный ресурс, меняется только ключ кэша, а не файл.
      const url = new URL(source, document.baseURI);
      if (/^https?:$/.test(url.protocol)) url.searchParams.set('_retry', String(Date.now()));
      img.src = url.href;
    });
  }
  function failImage(img) {
    const source = img.getAttribute('src');
    if (!source || imageStates.has(img)) return;
    // Кнопка повтора не вкладывается в ссылку или другую кнопку.
    const interactive = img.closest('a,button');
    const host = interactive ? interactive.parentElement : img.parentElement;
    if (!host) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const fallback = document.createElement('div');
    fallback.className = 'image-error';
    fallback.setAttribute('role', 'alert');
    fallback.append(textNode('p', '', 'Не удалось загрузить изображение'));
    const retry = retryButton('Повторить', () => retryImage(img, source), () => clearImage(img));
    retry.setAttribute('aria-label', `Повторить загрузку${img.alt ? `: ${img.alt}` : ' изображения'}`);
    fallback.append(retry);
    imageStates.set(img, { host, fallback });
    img.classList.add('image-load-failed');
    failedImages.add(img);
    host.append(fallback);
    resizeObserver?.observe(img);
    positionFallback(img);
    globalThis.SiteTypography?.apply(fallback);
  }
  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver((entries) => {
    entries.forEach(({ target }) => positionFallback(target));
  }) : null;
  function connect(img) {
    if (connected.has(img)) return;
    connected.add(img);
    img.addEventListener('error', () => failImage(img));
    img.addEventListener('load', () => clearImage(img));
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) failImage(img);
  }
  function scan(root) {
    if (root.matches?.('img')) connect(root);
    root.querySelectorAll?.('img').forEach(connect);
  }
  scan(document);
  new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => addedNodes.forEach(scan));
    failedImages.forEach((img) => {
      if (!img.isConnected) clearImage(img);
      else positionFallback(img);
    });
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', () => failedImages.forEach(positionFallback), { passive: true });
})();
