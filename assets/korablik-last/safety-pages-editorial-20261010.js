/* Korablik document directories: presentation only, source texts, link URLs and order preserved. */
(()=>{
 const path=document.body?.dataset?.pagePath;
 if(!document.body?.classList?.contains('theme-korablik'))return;
 if(!['/pages/anti-terror','/pages/information-security'].includes(path))return;
 const article=document.querySelector('main .article');
 const rich=article?.querySelector('.rich-text');
 if(!rich||rich.dataset.editorialSafety==='yes')return;
 const text=e=>(e?.textContent||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
 const element=(tag,cls)=>{const n=document.createElement(tag);n.className=cls;return n};
 const isBlank=e=>e.tagName==='P'&&!text(e)&&!e.querySelector('img,iframe,video,object,embed');
 const heading=title=>{const node=element('h2','safety-panel__title');node.textContent=title;return node};
 const section=(cls,title,children)=>{const s=element('section','safety-panel '+cls);if(title)s.append(heading(title));for(const e of children)s.append(e);return s};
 // Whitespace-only Joomla paragraphs stay in DOM, but are visually hidden.
 [...rich.children].filter(isBlank).forEach(e=>e.classList.add('safety-empty'));
 const kicker=element('p','safety-intro__eyebrow');kicker.textContent=path==='/pages/anti-terror'?'Безопасность детей':'Цифровая безопасность';
 const intro=element('div','safety-intro');
 intro.append(kicker);
 const description=element('p','safety-intro__description');
 description.textContent=path==='/pages/anti-terror'?'Памятки, документы и контакты для быстрого доступа.':'Материалы и ссылки для педагогов, детей и родителей.';
 intro.append(description);
 rich.prepend(intro);
 if(path==='/pages/information-security'){
   const links=[...rich.children].filter(e=>e.tagName==='P'&&e.querySelector('a')&&!isBlank(e));
   if(links.length>=4){
     const all=section('safety-panel--directory','Материалы по информационной безопасности',links);
     const list=element('div','safety-link-grid');
     for(const entry of links){entry.classList.add('safety-link-tile');list.append(entry)}
     all.append(list);rich.append(all);
   }
   rich.dataset.editorialSafety='yes';
   return;
 }
 const p=[...rich.children].filter(e=>e.tagName==='P'&&e.querySelector('a')&&!isBlank(e));
 const legal=[...rich.children].find(e=>e.tagName==='DIV'&&text(e).startsWith('Законодательные и нормативные акты'));
 const guides=[...rich.children].find(e=>e.tagName==='DIV'&&text(e).startsWith('Методические документы'));
 const emergency=[...rich.children].find(e=>e.tagName==='DIV'&&text(e).startsWith('ПРИ ВОЗНИКНОВЕНИИ'));
 const infoHeading=[...rich.children].find(e=>e.tagName==='P'&&text(e).startsWith('Информирование населения по порядку'));
 if(!(legal&&guides&&emergency&&infoHeading))return;
 const leadLinks=p.filter(e=>e.compareDocumentPosition(legal)&Node.DOCUMENT_POSITION_FOLLOWING);
 // compareDocumentPosition reverses the order test; use location among original direct children.
 const current=[...rich.children];
 const actualLead=current.filter(e=>e.tagName==='P'&&e.querySelector('a')&&current.indexOf(e)<current.indexOf(legal));
 const top=section('safety-panel--start','Самое важное',actualLead);
 actualLead.forEach(e=>e.classList.add('safety-link-tile'));
 const links=element('div','safety-spotlight-links');for(const e of actualLead)links.append(e);top.append(links);
 rich.append(top);
 const legalPanel=section('safety-panel--law',null,[legal]);
 legal.classList.add('safety-legacy-content');
 rich.append(legalPanel);
 const methodPanel=section('safety-panel--guides',null,[guides]);
 guides.classList.add('safety-legacy-content');
 rich.append(methodPanel);
 const items=[...emergency.children];
 const table=emergency.querySelector('table');
 const indexVideo=items.findIndex(e=>e.tagName==='P'&&text(e).includes('Ссылки на видеоролики'));
 if(indexVideo!==-1&&table){
   const phonePart=items.slice(0,indexVideo).filter(e=>!isBlank(e));
   const videoPart=items.slice(indexVideo).filter(e=>!isBlank(e));
   const phonePanel=section('safety-panel--emergency',null,phonePart);
   // Source phone text stays byte-for-byte identical in its original DOM nodes.
   phonePart.forEach((e,i)=>e.classList.add(i?'safety-emergency__number':'safety-emergency__headline'));
   rich.append(phonePanel);
   const videos=section('safety-panel--videos',null,videoPart);
   table.classList.add('safety-video-table');rich.append(videos);
   emergency.remove();
 } else {
   const phonePanel=section('safety-panel--emergency',null,[emergency]);rich.append(phonePanel);
 }
 const bottom=[infoHeading,...current.filter(e=>e.tagName==='P'&&e.querySelector('a')&&current.indexOf(e)>current.indexOf(infoHeading))];
 const alert=section('safety-panel--alerts',null,bottom);
 infoHeading.classList.add('safety-alerts__heading');bottom.slice(1).forEach(e=>e.classList.add('safety-alerts__link'));
 rich.append(alert);
 rich.dataset.editorialSafety='yes';
})();
