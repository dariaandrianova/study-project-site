/* Общая тень всех шторок: один обработчик на Content, без привязки к window. */
(() => {
  const connected = new WeakSet();
  const updates = new WeakMap();
  function connect(dialog) {
    if (connected.has(dialog)) return;
    const header = dialog.querySelector('.hypotheses-modal__header');
    const content = dialog.querySelector('.hypotheses-modal__scroll');
    if (!header || !content) return;
    const update = () => header.classList.toggle('is-scrolled',
      dialog.open && content.scrollHeight > content.clientHeight + 2 && content.scrollTop > 2);
    content.addEventListener('scroll', update, { passive: true });
    dialog.addEventListener('close', () => header.classList.remove('is-scrolled'));
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(content);
    connected.add(dialog);
    updates.set(dialog, () => { content.scrollTop = 0; update(); });
    update();
  }
  document.querySelectorAll('dialog.hypotheses-modal').forEach(connect);
  new MutationObserver((records) => records.forEach(({ target }) => {
    if (!target.matches?.('dialog.hypotheses-modal')) return;
    connect(target);
    if (target.open) updates.get(target)?.();
  })).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
})();
