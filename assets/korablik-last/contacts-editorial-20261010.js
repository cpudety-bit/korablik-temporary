/* Presentation-only transformation: move existing CMS nodes, never edit, replace or store source text. */
(()=>{
  if (!document.body?.matches('.theme-korablik[data-page-path="/pages/contacts"]')) return;
  const article=document.querySelector('main .article');
  const source=article?.querySelector(':scope > .rich-text');
  if(!source || source.dataset.enhanced==='yes') return;
  const children=[...source.children];
  const table=children.find(e=>e.tagName==='TABLE');
  const intro=children.find(e=>e.tagName==='P');
  if(!table || !intro || table.rows.length<4) return;
  const txt=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
  const stage=el('div','contacts-editorial');
  const hero=el('header','contacts-hero');
  hero.append(el('span','contacts-hero__eyebrow','Здесь мы на связи'));
  const introduction=el('div','contacts-hero__full-name');introduction.append(intro);hero.append(introduction);
  hero.append(el('div','contacts-hero__watermark','07'));
  stage.append(hero);
  const methodHead=el('h2','contacts-section__title','Как с нами связаться');
  const methods=el('section','contacts-methods');methods.setAttribute('aria-label','Контакты детского сада');methods.append(methodHead);
  const cards=el('div','contacts-methods__grid');
  const sourcePhone=txt(table.rows[1]);
  const sourceAddress=txt(table.rows[0]);
  const meta=[['Адрес','address','Местоположение детского сада'],['Телефон','phone','Телефоны детского сада'],['Почта и сайт','email','Электронная почта и сайт']];
  for(let i=0;i<3;i++){
    const row=table.rows[i],cells=[...row.cells];if(cells.length<2)continue;
    const card=el('div','contacts-method contacts-method--'+meta[i][1]);
    card.setAttribute('aria-label',meta[i][2]);
    const icon=el('span','contacts-method__icon');icon.setAttribute('aria-hidden','true');
    icon.textContent=['⌖','✆','✉'][i];
    const srcIcon=el('span','contacts-method__legacy-icon');
    while(cells[0].firstChild)srcIcon.append(cells[0].firstChild);
    icon.append(srcIcon);
    const details=el('div','contacts-method__details');
    details.append(el('span','contacts-method__label',meta[i][0]));
    const value=el('div','contacts-method__value');
    while(cells[1].firstChild)value.append(cells[1].firstChild);
    details.append(value);card.append(icon,details);cards.append(card);
  }
  methods.append(cards);
  const actions=el('nav','contacts-actions');actions.setAttribute('aria-label','Быстрая связь');
  const firstPhone=sourcePhone;
  const digits=firstPhone.replace(/[^0-9]/g,'').slice(0,11);
  if(digits.length===11 && digits[0]==='8'){
    const a=el('a','contacts-actions__primary','Позвонить');a.href='tel:+7'+digits.slice(1);actions.append(a);
  }
  const email=cards.querySelector('a[href^="mailto:"]');
  if(email){const a=el('a','contacts-actions__secondary','Написать письмо');a.href=email.getAttribute('href');actions.append(a)}
  const address=sourceAddress;
  if(address){const a=el('a','contacts-actions__quiet','Открыть на карте ↗');a.href='https://yandex.ru/maps/?text='+encodeURIComponent(address);a.target='_blank';a.rel='noopener noreferrer';actions.append(a)}
  if(actions.children.length) methods.append(actions);
  stage.append(methods);
  const travel=el('section','contacts-travel');
  travel.append(el('div','contacts-travel__symbol','↗'));
  const travelContent=el('div','contacts-travel__body');
  travelContent.append(el('h2','contacts-travel__title','Как добраться'));
  for(const cell of table.rows[3].cells){while(cell.firstChild)travelContent.append(cell.firstChild)}
  travel.append(travelContent);stage.append(travel);
  // The rest is split by existing source headings, while keeping every original node.
  const later=children.filter(c=>c!==intro&&c!==table);
  const groups=[[],[],[],[]];let pos=0;
  for(const node of later){
    const t=txt(node);
    if(/^Управление образования города Батайска\s*:/i.test(t))pos=1;
    else if(/^Дошкольный отдел Управления образования города Батайска\s*:/i.test(t))pos=2;
    else if(/^Отдел опеки и попечительства\s*:/i.test(t))pos=3;
    groups[pos].push(node);
  }
  // Administration: head teacher and reception hours, followed by individual staff cards.
  const admin=el('section','contacts-admin');
  admin.append(el('p','contacts-section__eyebrow','Наша команда'));
  admin.append(el('h2','contacts-section__title','Администрация детского сада'));
  const adminGrid=el('div','contacts-admin__grid');
  const head=el('div','contacts-person contacts-person--lead');
  const team=el('div','contacts-person contacts-person--team');
  let current=head;
  for(const node of groups[0]){
    const t=txt(node);
    if(/^(Заместитель заведующего|Старший воспитатель)/i.test(t))current=team;
    if(!t)node.classList.add('contacts-empty');
    current.append(node);
  }
  head.prepend(el('div','contacts-person__topline','Руководитель и часы приёма'));
  team.prepend(el('div','contacts-person__topline','Сотрудники администрации'));
  adminGrid.append(head,team);admin.append(adminGrid);stage.append(admin);
  const others=el('section','contacts-offices');
  others.append(el('p','contacts-section__eyebrow','Полезные ведомства'));
  others.append(el('h2','contacts-section__title','Городские службы'));
  const officeGrid=el('div','contacts-offices__grid');
  for(let i=1;i<4;i++){
    if(!groups[i].length)continue;
    const office=el('div','contacts-office contacts-office--'+i);
    groups[i].forEach((node,j)=>{
      if(!txt(node))node.classList.add('contacts-empty');
      if(j===0)node.classList.add('contacts-office__original-title');
      office.append(node);
    });officeGrid.append(office);
  }
  others.append(officeGrid);stage.append(others);
  // Any future non-text nodes go to their natural source section via `later` above.
  source.append(stage);
  table.remove();
  source.dataset.enhanced='yes';
})();
