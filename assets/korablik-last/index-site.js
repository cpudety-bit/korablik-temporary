(() => {
  'use strict';
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-navigation');
  if (menu && nav) {
    const mobile = window.matchMedia('(max-width: 650px)');
    const setMenu = open => {
      nav.hidden = mobile.matches && !open;
      menu.setAttribute('aria-expanded', String(mobile.matches && open));
    };
    menu.closest('.site-header').classList.add('navigation-ready');
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => {
      if (event.target.closest('a') && mobile.matches) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menu.focus();
      }
    });
    mobile.addEventListener('change', () => setMenu(false));
    setMenu(false);
  }
  // Missing photos in archival news: presentation only, no content/database deletion.
  const archive = document.querySelector('article[data-archive-photos="cleanup"] .rich-text');
  if (archive) {
    const extinctHosts = new Set([
      'i.yapx.ru', 'a.radikal.ru', 'b.radikal.ru',
      'c.radikal.ru', 'd.radikal.ru', 's019.radikal.ru'
    ]);
    const offlineArchiveHost = src => {
      try { return extinctHosts.has(new URL(src, location.href).hostname.toLowerCase()); }
      catch { return false; }
    };
    const nonEmpty = node => {
      if ((node.textContent || '').replace(/\u00a0/g, ' ').trim()) return true;
      return !!node.querySelector('img, video, audio, iframe, object, embed, svg, table, hr, input, button');
    };
    const hideArchivePhoto = img => {
      if (!img.isConnected) return;
      let wrapper = img.parentElement;
      img.remove();
      // Prune image-only links and paragraphs, never delete a caption or article text.
      while (wrapper && wrapper !== archive &&
             /^(A|P|SPAN|DIV|FIGURE|CENTER)$/.test(wrapper.tagName) &&
             !nonEmpty(wrapper)) {
        const parent = wrapper.parentElement;
        wrapper.remove();
        wrapper = parent;
      }
    };
    archive.addEventListener('error', event => {
      if (event.target instanceof HTMLImageElement) hideArchivePhoto(event.target);
    }, true);
    archive.querySelectorAll('img').forEach(img => {
      if (offlineArchiveHost(img.getAttribute('src') || '')) {
        hideArchivePhoto(img); // Historical Radikal returns SVG placeholders with HTTP 200.
      } else if (img.complete && img.naturalWidth === 0) {
        hideArchivePhoto(img);
      }
    });
  }

  // Any failed card thumbnail gets an unobtrusive placeholder, not a broken icon.
  document.querySelectorAll('.story-card .card-image img').forEach(img => {
    const fallback = () => {
      if (!img.isConnected) return;
      const span = document.createElement('span');
      span.className = 'image-fallback';
      span.textContent = 'Материал детского сада';
      img.replaceWith(span);
    };
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  const toggle = document.getElementById('accessibility-toggle');
  const panel = document.getElementById('accessibility-panel');
  if (!toggle || !panel) return;
  const key = 'edu-display:' + location.hostname;
  let state = {};
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) state = saved;
  } catch {}
  function apply() {
    for (const mode of ['font', 'contrast', 'images']) {
      document.body.classList.toggle('access-' + mode, !!state[mode]);
      panel.querySelector('[data-access="' + mode + '"]').setAttribute('aria-pressed', String(!!state[mode]));
    }
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }
  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
  });
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-access]');
    if (!button) return;
    const mode = button.dataset.access;
    if (mode === 'reset') state = {};
    else state[mode] = !state[mode];
    apply();
  });
  apply();
})();
