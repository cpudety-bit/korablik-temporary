
/* Интерактивность локального HTML-макета. Сервер и CMS не требуются. */
(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-navigation');
  const accessibilityButton = document.querySelector('.accessibility-toggle');
  const searchButton = document.querySelector('.search-toggle');
  const searchForm = document.querySelector('.site-search');
  const searchInput = document.querySelector('#site-search-input');
  const searchStatus = document.querySelector('#search-status');
  const searchItems = [...document.querySelectorAll('[data-search-item]')];

  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menu.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  };

  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  menu?.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeMenu));

  accessibilityButton?.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('accessible');
    accessibilityButton.setAttribute('aria-pressed', String(enabled));
    accessibilityButton.setAttribute('aria-label', enabled ? 'Выключить версию для слабовидящих' : 'Включить версию для слабовидящих');
    accessibilityButton.querySelector('span').innerHTML = enabled ? 'Обычная<br>версия' : 'Версия<br>для слабовидящих';
  });

  searchButton?.addEventListener('click', () => {
    const expanded = searchButton.getAttribute('aria-expanded') === 'true';
    searchForm.hidden = expanded;
    searchButton.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) searchInput.focus();
  });

  const doSearch = () => {
    const raw = searchInput?.value.trim() || '';
    const query = raw.toLocaleLowerCase('ru-RU');
    const matches = [];
    searchItems.forEach(item => {
      const found = !query || item.textContent.toLocaleLowerCase('ru-RU').includes(query);
      item.hidden = !found;
      if (found) matches.push(item);
    });
    if (searchStatus) {
      searchStatus.textContent = !query
        ? 'Показаны все материалы главной страницы.'
        : matches.length
          ? `На главной найдено совпадений: ${matches.length}. Нажмите «Найти», чтобы перейти к первому результату.`
          : 'На главной совпадений нет. Попробуйте поиск во всех новостях или документах.';
    }
    return matches;
  };

  searchForm?.addEventListener('submit', event => {
    event.preventDefault();
    const matching = doSearch();
    const first = matching[0];
    if (!first || !searchInput?.value.trim()) {
      searchInput?.focus();
      return;
    }
    const details = first.closest('details');
    if (details && !details.open) details.open = true;
    document.querySelectorAll('.search-match-flash').forEach(el => el.classList.remove('search-match-flash'));
    first.classList.add('search-match-flash');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    first.scrollIntoView({behavior:prefersReduced ? 'auto':'smooth',block:'center'});
    window.setTimeout(() => first.classList.remove('search-match-flash'), 1900);
  });

  searchInput?.addEventListener('input', doSearch);

  document.querySelectorAll('[data-search-route]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-search-route');
      if (target !== '/news' && target !== '/documents') return;
      const term = searchInput?.value.trim() || '';
      window.location.assign(target + (term ? '?q=' + encodeURIComponent(term) : ''));
    });
  });

  const revealAnchoredDetails = () => {
    if (!location.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (target) {
      const ancestor = target.closest('details');
      if (ancestor && !ancestor.open) ancestor.open = true;
    }
  };
  window.addEventListener('hashchange', revealAnchoredDetails);
  revealAnchoredDetails();
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      if (searchForm && !searchForm.hidden) {
        searchForm.hidden = true;
        searchButton?.setAttribute('aria-expanded', 'false');
        searchButton?.focus();
      }
    }
  });
})();


// Keep archive photo failures from showing broken images.
document.querySelectorAll('.news-card>img').forEach(img=>{img.addEventListener('error',()=>{const replacement=document.createElement('div');replacement.className='news-card__placeholder';replacement.textContent='Новости «Кораблика»';img.replaceWith(replacement)},{once:true});});
