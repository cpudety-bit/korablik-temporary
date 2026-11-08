/* Enhance only news images. Never rewrite text, image paths or the underlying CMS HTML. */
(() => {
  if (!document.body?.matches('.theme-korablik[data-page-path^="/news/article-"]')) return;
  const rich = document.querySelector('.article .rich-text');
  if (!rich) return;
  const photoParagraph = (node) => {
    if (!(node instanceof HTMLElement) || node.tagName !== 'P') return false;
    if (node.querySelectorAll('img').length < 1) return false;
    const text = (node.textContent || '').replace(/\u00a0/g, '').trim();
    if (text) return false;
    return !node.querySelector('video,iframe,form,svg');
  };
  const photos = [...rich.querySelectorAll('img')];
  for (const img of photos) {
    img.setAttribute('decoding', 'async');
    img.loading = photos.indexOf(img) === 0 ? 'eager' : 'lazy';
    const src = img.getAttribute('src') || '';
    if (!src || src.startsWith('data:')) continue;
    img.dataset.newsPhoto = '1';
    const parent = img.closest('p');
    if (parent && photoParagraph(parent)) { parent.classList.add('news-photo-paragraph'); if (parent.querySelectorAll('img').length > 1) parent.classList.add('news-photo-paragraph--multiple'); }
    if (img.closest('a')) continue;
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Открыть фотографию крупно');
  }
  // Group ONLY adjacent image-only paragraphs. Text and captions stay in their original order.
  let node = rich.firstElementChild;
  while (node) {
    if (!node.classList.contains('news-photo-paragraph')) {
      node = node.nextElementSibling;
      continue;
    }
    const group = document.createElement('div');
    group.className = 'news-photo-grid';
    group.setAttribute('role','group');
    group.setAttribute('aria-label', 'Фотографии публикации');
    rich.insertBefore(group, node);
    let count = 0;
    while (node && node.classList.contains('news-photo-paragraph')) {
      const next = node.nextElementSibling;
      group.appendChild(node);
      count++;
      node = next;
    }
    if (count === 1) group.classList.add('news-photo-grid--single');
  }
  if (!photos.some(img => img.dataset.newsPhoto === '1') || typeof HTMLDialogElement === 'undefined') return;
  const overlay = document.createElement('dialog');
  overlay.className = 'news-photo-lightbox';
  overlay.setAttribute('aria-label','Просмотр фотографии');
  const close = document.createElement('button');
  close.type = 'button';close.textContent = '×';close.setAttribute('aria-label','Закрыть');
  const large = document.createElement('img');large.alt='';
  const count = document.createElement('p');count.className='news-photo-count';
  overlay.append(close,large,count);
  document.body.appendChild(overlay);
  close.addEventListener('click',()=>overlay.close());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.close() });
  let last = null;
  const show = img => {
    if (!img.currentSrc && !img.src) return;
    const src = img.closest('a')?.href || img.currentSrc || img.src;
    if (!/^https?:\/\//.test(src)) return;
    large.src=src;
    large.alt=img.alt || 'Фотография из новости';
    const ix=photos.indexOf(img);
    count.textContent = 'Фотография ' + (ix + 1) + ' из ' + photos.length;
    last=img;
    overlay.showModal();
  };
  rich.addEventListener('click',e => {
    const img=e.target.closest('img[data-news-photo="1"]');
    if (!img) return;
    e.preventDefault(); show(img);
  });
  rich.addEventListener('keydown',e => {
    if ((e.key!=='Enter'&&e.key!==' ') || !e.target.matches('img[data-news-photo="1"]')) return;
    e.preventDefault();show(e.target);
  });
  overlay.addEventListener('close',() => { large.removeAttribute('src');last?.focus?.({preventScroll:true}) });
})();
