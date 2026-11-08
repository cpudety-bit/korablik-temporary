/* Presentation only: retain ALL original article nodes, text, links and image sources. */
(()=>{
  const path=document.body?.dataset?.pagePath;
  if (!document.body?.classList?.contains('theme-korablik') || !['/pages/article-1843','/pages/article-1844'].includes(path)) return;
  const content=document.querySelector('main article.article > .rich-text');
  if (!content || content.dataset.programLayout==='yes') return;
  const original=[...content.children];
  const text=x=>(x?.textContent||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
  const create=(tag,cls,label)=>{
    const e=document.createElement(tag);e.className=cls;if(label!==undefined)e.textContent=label;return e;
  };
  const isBlank=x=>x.tagName==='P' && !text(x) && !x.querySelector('img,iframe,object,video');
  const official=original.find(x=>x.tagName==='P' && x.querySelector('a[href^="http"]'));
  const logo=original.find(x=>x.tagName==='P' && x.querySelector('img'));
  const pdfs=original.filter(x=>x.tagName==='P' && x.querySelector('a[href$=".pdf"]'));
  if(!(official&&logo&&pdfs.length>=1))return;
  const isGames=path.endsWith('1843');
  const pageTitle=isGames?'Добрые игры':'Орлята-дошколята';
  // Keep original content paragraphs; only visually remove empty Joomla spacers.
  original.filter(isBlank).forEach(x=>x.classList.add('program-empty'));
  content.classList.add('program-editorial',isGames?'program-editorial--games':'program-editorial--orlyata');
  const brand=create('section','program-hero');
  brand.setAttribute('aria-label','Материалы проекта «'+pageTitle+'»');
  const logoFrame=create('div','program-hero__logo');
  logoFrame.append(logo);
  const heroInfo=create('div','program-hero__info');
  heroInfo.append(create('span','program-hero__eyebrow','Программы детского сада'));
  heroInfo.append(create('div','program-hero__name',pageTitle));
  official.classList.add('program-hero__official');
  heroInfo.append(official);
  brand.append(logoFrame,heroInfo);
  const block=create('div','program-editorial__content');
  content.append(brand,block);
  let chapter=null;
  const titles=['Какие бывают игры?','Как игра влияет на развитие и воспитание ребёнка?','В чём польза детской игры для родителя и педагога?'];
  const subTitle='Почему дети так увлечены игрой?';
  const introParagraph=original.find(x=>x.tagName==='P'&&text(x).startsWith('С 01.09. 2026 года, программа «Орлята'));
  const quoteParagraph=original.find(x=>x.tagName==='P'&&text(x).startsWith('«Основные нравственные ориентиры'));
  const beginSection=(cls,name)=>{
    const section=create('section','program-section '+cls);
    if(name)section.append(create('h2','program-section__heading',name));
    block.append(section);
    return section;
  };
  let intro=beginSection('program-section--intro','О программе');
  if(isGames && quoteParagraph){
    const quote=create('aside','program-quote');
    quote.append(quoteParagraph);
    block.insertBefore(quote,intro);
  }
  if(!isGames && introParagraph)intro.classList.add('program-section--lead');
  for(const node of original){
    if(node===official||node===logo||node===quoteParagraph&&isGames||isBlank(node)||pdfs.includes(node))continue;
    const title=text(node);
    if(titles.includes(title)){
      chapter=beginSection('program-section--chapter');
      node.classList.add('program-section__original-heading');
      node.setAttribute('role','heading');node.setAttribute('aria-level','2');
      chapter.append(node);
      continue;
    }
    if(title===subTitle){
      if(!chapter)chapter=beginSection('program-section--chapter');
      node.classList.add('program-section__original-subheading');
      node.setAttribute('role','heading');node.setAttribute('aria-level','3');
      chapter.append(node);
      continue;
    }
    (chapter||intro).append(node);
  }
  // The 5 authentic linked PDF paragraphs become an official document directory.
  const docs=create('section','program-documents');
  docs.setAttribute('aria-label','Документы проекта');
  docs.append(create('p','program-documents__eyebrow','Документы и материалы'));
  docs.append(create('h2','program-documents__title','Официальные документы'));
  const grid=create('div','program-documents__grid');
  for(const node of pdfs){
    node.classList.add('program-document');
    grid.append(node);
  }
  docs.append(grid);content.append(docs);
  content.dataset.programLayout='yes';
})();
