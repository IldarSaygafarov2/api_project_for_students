/* =========================================================
   build-static.js
   ---------------------------------------------------------
   Dev tool (not shipped as part of the live site's runtime).
   Reads js/data/*.js and js/icons.js and bakes the resulting
   markup directly into the .html files, replacing the old
   "empty div + JS fills it in on load" pattern. Run again any
   time js/data/*.js changes:

       node tools/build-static.js

   Why this exists: once this project is wired to Django, every
   one of these blocks becomes a {% for %} loop rendered by the
   server. Baking real markup in now means the HTML source itself
   shows exactly what needs templating, instead of hiding it
   behind a JS render call.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* Load the plain data/icon files by executing their source in a
   function body and returning the top-level consts by name — works
   regardless of const/let/var without needing ES module syntax. */
function loadVars(file, names){
  const code = read(file);
  const fn = new Function(`${code}\nreturn { ${names.join(',')} };`);
  return fn();
}

const { ICON } = loadVars('js/icons.js', ['ICON']);
const { REGIONS, regionName } = loadVars('js/data/regions.js', ['REGIONS', 'regionName']);
const { CATEGORIES, findCategory } = loadVars('js/data/categories.js', ['CATEGORIES', 'findCategory']);
const { SELLERS, LISTINGS, seller, getListingById } = loadVars('js/data/listings.js', ['SELLERS', 'LISTINGS', 'seller', 'getListingById']);

/* ---- Node-safe ports of js/utils.js (no DOM there) ---- */
function escapeHtml(str){
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function formatPrice(n, currency){
  if (n === null || n === undefined || n === '') return 'Договорная';
  const num = Number(n).toLocaleString('ru-RU').replace(/,/g, ' ');
  return `${num} ${currency === 'USD' ? '$' : 'сум'}`;
}
function timeAgo(iso){
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'только что';
  if (min < 60) return `${min} мин. назад`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ч. назад`;
  const days = Math.floor(hr / 24);
  if (days === 1) return 'вчера';
  if (days < 7) return `${days} дн. назад`;
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
function initials(name){
  return (name || '?').trim().split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
}
function ratingStars(rating){ return '★'.repeat(Math.round(rating)); }

/* ---------------------------------------------------------
   Shared fragments
   --------------------------------------------------------- */
function listingCardHTML(l){
  return `
    <article class="listing-card">
      <a href="product.html?id=${l.id}" class="listing-thumb-link">
        <div class="listing-thumb">
          <img src="${l.images[0]}" alt="${escapeHtml(l.title)}" loading="lazy">
          ${l.promoted ? `<span class="listing-badge">Топ</span>` : ''}
          <button class="listing-fav" data-fav-id="${l.id}" aria-label="В избранное">${ICON('heart')}</button>
        </div>
      </a>
      <div class="listing-body">
        <div class="listing-price">${formatPrice(l.price, l.currency)}</div>
        <a href="product.html?id=${l.id}"><h3 class="listing-title">${escapeHtml(l.title)}</h3></a>
        <div class="listing-meta">
          <span>${ICON('pin')}${l.city.split(',')[0]}</span>
          <span>${timeAgo(l.createdAt)}</span>
        </div>
      </div>
    </article>`;
}

function navCategoryLinks(){
  return CATEGORIES.map(c => `<a href="catalog.html?category=${c.id}">${c.name}</a>`).join('\n      ');
}

function headerHTML(loggedIn){
  const rightActions = loggedIn ? `
      <a class="header-action-link" href="favorites.html" title="Избранное">${ICON('heart')}<span>Избранное</span></a>
      <a class="header-action-link" href="messages.html" title="Сообщения">${ICON('chat')}<span>Чаты</span></a>
      <a class="header-action-link" href="account-dashboard.html" title="Личный кабинет">${ICON('user')}<span>Кабинет</span></a>
      <a class="btn btn-primary btn-sm" href="add-listing.html">${ICON('plus')} Подать объявление</a>` : `
      <a class="header-action-link" href="favorites.html" title="Избранное">${ICON('heart')}<span>Избранное</span></a>
      <a class="btn btn-outline btn-sm" href="login.html">Войти</a>
      <a class="btn btn-primary btn-sm" href="login.html?next=add-listing.html">${ICON('plus')} Подать объявление</a>`;

  return `<header class="site-header" id="site-header">
    <div class="container header-top">
      <a class="logo" href="index.html">
        <span class="logo-mark">${ICON('boxEmpty')}</span>
        bozor<span class="logo-dot">.uz</span>
      </a>
      <button type="button" class="location-pill" id="regionPillBtn">
        ${ICON('pin')} <span class="pill-label" id="regionPillLabel">Ташкент город</span>
      </button>
      <form class="header-search" action="catalog.html" method="get" role="search">
        <input type="search" name="q" placeholder="Что вы ищете?" autocomplete="off">
        <button type="submit" aria-label="Искать">${ICON('search')}</button>
      </form>
      <div class="header-actions">${rightActions}
      </div>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Меню">${ICON('menu')}</button>
    </div>
    <nav class="container header-nav">
      <a class="all-cats" href="categories.html">${ICON('grid')} Все категории</a>
      ${navCategoryLinks()}
    </nav>
  </header>
  <div class="modal-overlay" id="regionModal">
    <div class="modal-box">
      <div class="modal-head">
        <h3>Выберите регион</h3>
        <button class="modal-close" data-close-modal="regionModal">${ICON('close')}</button>
      </div>
      <button type="button" class="btn btn-outline btn-block" id="geoDetectBtn" style="margin-bottom:14px">
        ${ICON('pin')} Определить автоматически
      </button>
      <div style="max-height:360px;overflow-y:auto">
        ${REGIONS.map(r => `<button type="button" class="checkbox-row region-option-row" data-region="${r.id}" data-region-name="${escapeHtml(r.name)}" style="width:100%;justify-content:space-between;padding:10px 4px;border-bottom:1px solid var(--color-border)">
          <span>${r.name}</span>${r.id==='tashkent-city' ? ICON('check') : ''}
        </button>`).join('\n        ')}
      </div>
    </div>
  </div>`;
}

function footerHTML(){
  const catLinks = CATEGORIES.slice(0,5).map(c => `<a href="catalog.html?category=${c.id}">${c.name}</a>`).join('\n        ');
  return `<footer class="site-footer" id="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="footer-logo">bozor<span style="color:var(--color-accent)">.uz</span></div>
        <p class="footer-about">Доска объявлений №1 в Узбекистане. Покупайте и продавайте товары и услуги в своём городе быстро и безопасно.</p>
        <div class="footer-socials" style="margin-top:16px">
          <a href="#" aria-label="Telegram">${ICON('telegram')}</a>
          <a href="#" aria-label="Instagram">${ICON('instagram')}</a>
          <a href="#" aria-label="Facebook">${ICON('facebook')}</a>
        </div>
      </div>
      <div>
        <h4>Категории</h4>
        ${catLinks}
        <a href="categories.html">Все категории →</a>
      </div>
      <div>
        <h4>Компания</h4>
        <a href="about.html">О сайте</a>
        <a href="contacts.html">Контакты</a>
        <a href="help.html">Помощь</a>
      </div>
      <div>
        <h4>Пользователям</h4>
        <a href="add-listing.html">Подать объявление</a>
        <a href="login.html">Войти</a>
        <a href="register.html">Регистрация</a>
      </div>
      <div>
        <h4>Документы</h4>
        <a href="rules.html">Правила сервиса</a>
        <a href="privacy.html">Конфиденциальность</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} bozor.uz — доска объявлений Узбекистана</span>
      <span>Фронтенд готов к подключению к Django API</span>
    </div>
  </footer>`;
}

function accountNavHTML(activePage, name, role){
  const items = [
    { href: 'account-dashboard.html', icon: 'grid', label: 'Обзор' },
    { href: 'my-listings.html', icon: 'boxEmpty', label: 'Мои объявления' },
    { href: 'add-listing.html', icon: 'plus', label: 'Добавить объявление' },
    { href: 'favorites.html', icon: 'heart', label: 'Избранное' },
    { href: 'messages.html', icon: 'chat', label: 'Сообщения' },
    { href: 'account-settings.html', icon: 'user', label: 'Настройки' },
  ];
  return `<nav class="account-nav" id="accountNav">
      <div class="account-nav-head">
        <div class="avatar avatar-sm">${initials(name)}</div>
        <div style="min-width:0">
          <div style="font-weight:700;font-size:var(--fs-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(name)}</div>
          <span class="role-badge ${role}">${role === 'seller' ? 'Продавец' : 'Покупатель'}</span>
        </div>
      </div>
      ${items.map(i => `<a href="${i.href}" class="${activePage===i.href?'active':''}">${ICON(i.icon)} ${i.label}</a>`).join('\n      ')}
      <a href="#" id="accountLogoutLink" style="border-top:1px solid var(--color-border)">${ICON('logout')} Выйти</a>
    </nav>`;
}

/* ---------------------------------------------------------
   File patchers
   --------------------------------------------------------- */
let filesChanged = 0;
function patch(file, replacements){
  const p = path.join(ROOT, file);
  let html = fs.readFileSync(p, 'utf8');
  for (const [find, replaceWith] of replacements){
    if (!html.includes(find)) throw new Error(`Marker not found in ${file}: ${find.slice(0,60)}...`);
    html = html.replace(find, replaceWith);
  }
  fs.writeFileSync(p, html);
  filesChanged++;
}

/* ---- 1. Header/footer on every page ---- */
const LOGGED_OUT_PAGES = [
  'index.html','categories.html','catalog.html','product.html','contact-seller.html',
  'seller-profile.html','login.html','register.html','forgot-password.html',
  'about.html','contacts.html','help.html','rules.html','privacy.html','404.html',
];
const LOGGED_IN_PAGES = [
  'account-dashboard.html','my-listings.html','add-listing.html','favorites.html',
  'messages.html','account-settings.html',
];

[...LOGGED_OUT_PAGES, ...LOGGED_IN_PAGES].forEach(file => {
  const loggedIn = LOGGED_IN_PAGES.includes(file);
  patch(file, [
    ['<header id="site-header"></header>', headerHTML(loggedIn)],
    ['<footer id="site-footer"></footer>', footerHTML()],
  ]);
});

console.log(`Patched header/footer on ${filesChanged} pages.`);

/* ---- 2. index.html: category grid + two listing grids ---- */
{
  const catGrid = CATEGORIES.map(c => `<a class="cat-card" href="catalog.html?category=${c.id}">
        <div class="cat-icon">${ICON(c.icon)}</div>
        <h3>${c.name}</h3>
        <span>${c.subs.length} подкатегорий</span>
      </a>`).join('\n      ');

  const regionListings = LISTINGS.filter(l => l.regionId === 'tashkent-city').slice(0, 8);
  const promoted = [...LISTINGS].sort((a,b) => (b.promoted===true)-(a.promoted===true) || new Date(b.createdAt)-new Date(a.createdAt)).slice(0, 8);

  patch('index.html', [
    ['<div class="cat-grid" id="homeCatGrid"></div>', `<div class="cat-grid" id="homeCatGrid">\n      ${catGrid}\n      </div>`],
    ['<h2 id="regionListingsTitle">Объявления рядом с вами</h2>', `<h2 id="regionListingsTitle">Объявления в регионе «Ташкент город»</h2>`],
    ['<div class="listing-grid" id="regionListingsGrid"></div>', `<div class="listing-grid" id="regionListingsGrid">${regionListings.map(listingCardHTML).join('')}\n      </div>`],
    ['<div class="listing-grid" id="promotedGrid"></div>', `<div class="listing-grid" id="promotedGrid">${promoted.map(listingCardHTML).join('')}\n      </div>`],
  ]);
}

/* ---- 3. categories.html: full grid with subcategories ---- */
{
  const grid = CATEGORIES.map(c => `<div class="cat-full-card">
      <div class="cat-full-head">
        <div class="cat-icon">${ICON(c.icon)}</div>
        <h2 style="font-size:var(--fs-md)"><a href="catalog.html?category=${c.id}">${c.name}</a></h2>
      </div>
      <div class="cat-full-subs">
        ${c.subs.map(s => `<a href="catalog.html?category=${c.id}&sub=${encodeURIComponent(s)}">${s}</a>`).join('')}
      </div>
    </div>`).join('\n    ');
  patch('categories.html', [
    ['<div class="cat-full-grid" id="allCatsGrid"></div>', `<div class="cat-full-grid" id="allCatsGrid">\n    ${grid}\n    </div>`],
  ]);
}

/* ---- 4. catalog.html: default (unfiltered) listing grid + filter option lists + toolbar/breadcrumbs/pagination ---- */
{
  const catOptions = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const regionOptions = REGIONS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

  const sorted = [...LISTINGS].sort((a,b) => (b.promoted===true)-(a.promoted===true) || new Date(b.createdAt)-new Date(a.createdAt));
  const perPage = 12;
  const page1 = sorted.slice(0, perPage);
  const totalPages = Math.ceil(sorted.length / perPage);
  const pageButtons = Array.from({length: totalPages}, (_,i) => `<button class="${i===0?'active':''}" data-page="${i+1}">${i+1}</button>`).join('');

  patch('catalog.html', [
    ['<option value="">Все категории</option>', `<option value="">Все категории</option>\n            ${catOptions}`],
    ['<option value="">Все регионы</option>', `<option value="">Все регионы</option>\n            ${regionOptions}`],
    ['<nav class="breadcrumbs" id="breadcrumbs"></nav>', `<nav class="breadcrumbs" id="breadcrumbs"><a href="index.html">Главная</a><span class="sep">/</span><span class="current">Все объявления</span></nav>`],
    ['<span class="result-count" id="resultCount"></span>', `<span class="result-count" id="resultCount">Найдено: <b>${sorted.length}</b> объявлений</span>`],
    ['<div class="listing-grid" id="catalogGrid"></div>', `<div class="listing-grid" id="catalogGrid">${page1.map(listingCardHTML).join('')}\n        </div>`],
    ['<div class="pagination" id="pagination"></div>', `<div class="pagination" id="pagination">${pageButtons}</div>`],
  ]);
}

console.log('Patched index.html, categories.html, catalog.html content.');

/* ---- 5. product.html: bake full example content for listing #1 ---- */
function renderAttrRows(listing, cat){
  const rows = [];
  rows.push(['Категория', cat ? cat.name : listing.category]);
  if (listing.sub) rows.push(['Подкатегория', listing.sub]);
  if (listing.condition) rows.push(['Состояние', listing.condition]);
  const attrDefs = cat ? cat.attrs : [];
  Object.entries(listing.attrs || {}).forEach(([key, val]) => {
    const def = attrDefs.find(a => a.key === key);
    const label = def ? def.label : key;
    let value = val;
    if (key === 'mileage') value = `${Number(val).toLocaleString('ru-RU')} км`;
    if (key === 'area') value = `${val} м²`;
    if (key === 'salary') value = formatPrice(val, 'UZS');
    rows.push([label, value]);
  });
  rows.push(['Регион', regionName(listing.regionId)]);
  return rows.map(([k,v]) => `<div class="attrs-row"><span>${k}</span><span>${escapeHtml(String(v))}</span></div>`).join('\n        ');
}

{
  const listing = getListingById(1);
  const cat = findCategory(listing.category);
  const s = seller(listing.sellerId);
  const similar = LISTINGS.filter(l => l.category === listing.category && l.id !== listing.id).slice(0, 4);

  const breadcrumbs = `<a href="index.html">Главная</a><span class="sep">/</span>
    <a href="catalog.html?category=${listing.category}">${cat.name}</a><span class="sep">/</span>
    <span class="current">${escapeHtml(listing.title)}</span>`;

  const thumbs = listing.images.map((src,i) => `<img src="${src}" data-i="${i}" class="${i===0?'active':''}" alt="Фото ${i+1}">`).join('');

  patch('product.html', [
    ['<title id="pageTitle">Объявление — bozor.uz</title>', `<title id="pageTitle">${escapeHtml(listing.title)} — bozor.uz</title>`],
    ['<nav class="breadcrumbs" id="breadcrumbs"></nav>', `<nav class="breadcrumbs" id="breadcrumbs">${breadcrumbs}</nav>`],
    ['<div class="container product-layout" id="productLayout" style="display:none">', '<div class="container product-layout" id="productLayout">'],
    ['<img id="galleryImg" src="" alt="">', `<img id="galleryImg" src="${listing.images[0]}" alt="${escapeHtml(listing.title)}">`],
    ['<button class="gallery-nav-btn prev" id="galleryPrev" aria-label="Предыдущее фото"></button>', `<button class="gallery-nav-btn prev" id="galleryPrev" aria-label="Предыдущее фото">${ICON('chevronLeft')}</button>`],
    ['<button class="gallery-nav-btn next" id="galleryNext" aria-label="Следующее фото"></button>', `<button class="gallery-nav-btn next" id="galleryNext" aria-label="Следующее фото">${ICON('chevronRight')}</button>`],
    ['<span class="gallery-counter" id="galleryCounter"></span>', `<span class="gallery-counter" id="galleryCounter">1 / ${listing.images.length}</span>`],
    ['<div class="gallery-thumbs" id="galleryThumbs"></div>', `<div class="gallery-thumbs" id="galleryThumbs">${thumbs}</div>`],
    ['<h1 class="product-title" id="productTitle"></h1>', `<h1 class="product-title" id="productTitle">${escapeHtml(listing.title)}</h1>`],
    ['<div class="product-meta-row" id="productMetaRow"></div>', `<div class="product-meta-row" id="productMetaRow">
        <span>${ICON('pin')} ${listing.city}</span>
        <span>${ICON('clock')} ${timeAgo(listing.createdAt)}</span>
        <span>${ICON('eye')} ${listing.views} просмотров</span>
      </div>`],
    ['<p class="product-desc" id="productDesc"></p>', `<p class="product-desc" id="productDesc">${escapeHtml(listing.description)}</p>`],
    ['<div class="attrs-table" id="attrsTable"></div>', `<div class="attrs-table" id="attrsTable">\n        ${renderAttrRows(listing, cat)}\n      </div>`],
    ['<div class="side-price" id="sidePrice"></div>', `<div class="side-price" id="sidePrice">${formatPrice(listing.price, listing.currency)}</div>`],
    ['<div class="negotiable" id="sideNegotiable"></div>', `<div class="negotiable" id="sideNegotiable">${listing.negotiable ? 'Возможен торг' : ''}</div>`],
    ['<button class="btn btn-primary btn-lg btn-block" id="showPhoneBtn"></button>', `<button class="btn btn-primary btn-lg btn-block" id="showPhoneBtn">${ICON('phone')} Показать телефон</button>`],
    ['<button class="btn btn-outline btn-block" id="messageSellerBtn"></button>', `<a class="btn btn-outline btn-block" id="messageSellerBtn" href="contact-seller.html?listing=${listing.id}">${ICON('chat')} Написать сообщение</a>`],
    ['<a id="sellerAvatarLink" class="avatar" href="#"></a>', `<a id="sellerAvatarLink" class="avatar" href="seller-profile.html?id=${s.id}">${initials(s.name)}</a>`],
    ['<a id="sellerNameLink" class="seller-name" href="#"></a>', `<a id="sellerNameLink" class="seller-name" href="seller-profile.html?id=${s.id}">${escapeHtml(s.name)}</a>`],
    ['<div class="seller-sub" id="sellerSub"></div>', `<div class="seller-sub" id="sellerSub">${ratingStars(s.rating)} ${s.rating} · на сайте с ${new Date(s.registered).getFullYear()} г.</div>`],
    ['<a class="btn btn-ghost btn-block" style="margin-top:10px" id="sellerProfileLink">Все объявления продавца</a>', `<a class="btn btn-ghost btn-block" style="margin-top:10px" id="sellerProfileLink" href="seller-profile.html?id=${s.id}">Все объявления продавца</a>`],
    ['<div class="safety-note"></div>', `<div class="safety-note">${ICON('shieldCheck')}<span>Не переводите деньги предоплатой незнакомым людям. Проверяйте товар лично при встрече.</span></div>`],
    ['<div class="container section" id="similarSection" style="display:none">', '<div class="container section" id="similarSection">'],
    ['<div class="listing-grid" id="similarGrid"></div>', `<div class="listing-grid" id="similarGrid">${similar.map(listingCardHTML).join('')}</div>`],
  ]);
}
console.log('Patched product.html.');

/* ---- 6. seller-profile.html: bake example profile (seller u1) ---- */
{
  const s = seller('u1');
  const listings = LISTINGS.filter(l => l.sellerId === s.id);
  const firstListingId = listings[0]?.id || '';

  patch('seller-profile.html', [
    ['<title id="pageTitle">Продавец — bozor.uz</title>', `<title id="pageTitle">${escapeHtml(s.name)} — bozor.uz</title>`],
    ['<nav class="breadcrumbs" id="breadcrumbs"></nav>', `<nav class="breadcrumbs" id="breadcrumbs"><a href="index.html">Главная</a><span class="sep">/</span><span class="current">${escapeHtml(s.name)}</span></nav>`],
    ['<div class="seller-header" id="sellerHeader"></div>', `<div class="seller-header" id="sellerHeader">
      <div class="avatar avatar-lg">${initials(s.name)}</div>
      <div>
        <h1 style="font-size:var(--fs-xl)">${escapeHtml(s.name)}</h1>
        <div class="seller-stats-row">
          <div>★ <b>${s.rating}</b> (${s.reviews} отзывов)</div>
          <div>${ICON('pin')} ${regionName(s.regionId)}</div>
          <div>На сайте с ${new Date(s.registered).toLocaleDateString('ru-RU',{month:'long', year:'numeric'})}</div>
        </div>
      </div>
      <a class="btn btn-primary" style="margin-left:auto" href="contact-seller.html?listing=${firstListingId}">${ICON('chat')} Написать</a>
    </div>`],
    ['<h2 style="font-size:var(--fs-lg);margin-bottom:var(--sp-4)" id="listingsCount"></h2>', `<h2 style="font-size:var(--fs-lg);margin-bottom:var(--sp-4)" id="listingsCount">Объявления продавца (${listings.length})</h2>`],
    ['<div class="listing-grid" id="sellerListingsGrid"></div>', `<div class="listing-grid" id="sellerListingsGrid">${listings.map(listingCardHTML).join('')}</div>`],
  ]);
}
console.log('Patched seller-profile.html.');

/* ---- 7. contact-seller.html: bake example (listing #1 / seller u1) ---- */
{
  const listing = getListingById(1);
  const s = seller(listing.sellerId);

  patch('contact-seller.html', [
    ['<nav class="breadcrumbs" id="breadcrumbs"></nav>', `<nav class="breadcrumbs" id="breadcrumbs"><a href="index.html">Главная</a><span class="sep">/</span>
    <a href="product.html?id=${listing.id}">${escapeHtml(listing.title)}</a><span class="sep">/</span>
    <span class="current">Написать продавцу</span></nav>`],
    ['<div class="container contact-layout" id="contactLayout" style="display:none">', '<div class="container contact-layout" id="contactLayout">'],
    ['<p style="color:var(--color-ink-soft);margin-bottom:var(--sp-5)" id="sellerNameLabel"></p>', `<p style="color:var(--color-ink-soft);margin-bottom:var(--sp-5)" id="sellerNameLabel">Продавцу: ${escapeHtml(s.name)}</p>`],
    ['<div class="listing-summary" id="listingSummary"></div>', `<div class="listing-summary" id="listingSummary">
        <img src="${listing.images[0]}" alt="">
        <div>
          <div style="font-size:var(--fs-sm);font-weight:600;line-height:1.3">${escapeHtml(listing.title)}</div>
          <div class="listing-price" style="font-size:var(--fs-base);margin-top:4px">${formatPrice(listing.price, listing.currency)}</div>
        </div>
      </div>`],
    ['<div class="seller-box" style="margin-top:0;padding-top:0;border-top:0" id="sellerBox"></div>', `<div class="seller-box" style="margin-top:0;padding-top:0;border-top:0" id="sellerBox">
        <div class="avatar">${initials(s.name)}</div>
        <div>
          <div class="seller-name">${escapeHtml(s.name)}</div>
          <div class="seller-sub">${regionName(s.regionId)}</div>
        </div>
      </div>`],
    ['<div class="safety-note" id="safetyNote"></div>', `<div class="safety-note" id="safetyNote">${ICON('shieldCheck')}<span>Общайтесь и договаривайтесь о встрече только через сайт до момента личной проверки товара.</span></div>`],
    ['<div class="quick-msgs" id="quickMsgs"></div>', `<div class="quick-msgs" id="quickMsgs">
          <button type="button" class="quick-msg-btn">Здравствуйте! Товар ещё актуален?</button>
          <button type="button" class="quick-msg-btn">Возможен ли торг?</button>
          <button type="button" class="quick-msg-btn">Могу посмотреть сегодня?</button>
          <button type="button" class="quick-msg-btn">Доставляете по городу?</button>
        </div>`],
    ['<a class="btn btn-secondary" id="goToChatBtn" style="margin-top:20px">Перейти к переписке</a>', `<a class="btn btn-secondary" id="goToChatBtn" style="margin-top:20px" href="messages.html?listing=${listing.id}">Перейти к переписке</a>`],
    ['<div style="width:56px;height:56px;border-radius:999px;background:var(--color-success-light);color:var(--color-success);display:grid;place-items:center;margin:0 auto 16px" id="sentIcon"></div>', `<div style="width:56px;height:56px;border-radius:999px;background:var(--color-success-light);color:var(--color-success);display:grid;place-items:center;margin:0 auto 16px" id="sentIcon">${ICON('check')}</div>`],
  ]);
}
console.log('Patched contact-seller.html.');

/* ---- 8. account-dashboard.html ---- */
{
  const mine = LISTINGS.filter(l => l.sellerId === 'u1');
  patch('account-dashboard.html', [
    ['<div id="accountNavSlot"></div>', accountNavHTML('account-dashboard.html', 'Аброр Тошматов', 'seller')],
    ['<h1 style="font-size:var(--fs-xl);margin-bottom:var(--sp-5)" id="greeting"></h1>', `<h1 style="font-size:var(--fs-xl);margin-bottom:var(--sp-5)" id="greeting">Здравствуйте! 👋</h1>`],
    ['<div class="stat-cards" id="statCards"></div>', `<div class="stat-cards" id="statCards">
        <div class="stat-card"><b id="statMyListings">${mine.length}</b><span>Мои объявления</span></div>
        <div class="stat-card"><b id="statViews">${mine.reduce((s,l)=>s+l.views,0)}</b><span>Всего просмотров</span></div>
        <div class="stat-card"><b id="statFavs">0</b><span>В избранном</span></div>
        <div class="stat-card"><b id="statChats">0</b><span>Активных чатов</span></div>
      </div>`],
    ['<div id="recentListings"></div>', `<div id="recentListings">${
        mine.length
          ? mine.slice(0,3).map(l => `<div class="manage-row">
        <img src="${l.images[0]}" alt="">
        <div class="manage-row-body">
          <div class="manage-row-title">${escapeHtml(l.title)}</div>
          <div class="listing-meta" style="margin-top:4px"><span>${formatPrice(l.price,l.currency)}</span><span>${ICON('eye')} ${l.views}</span></div>
        </div>
        <span class="status-pill active">Активно</span>
      </div>`).join('')
          : `<div class="empty-state">${ICON('boxEmpty')}<h3>У вас пока нет объявлений</h3>
      <a class="btn btn-secondary" href="add-listing.html" style="margin-top:12px">Разместить первое объявление</a></div>`
      }</div>`],
    ['<div id="recentMessages"></div>', `<div id="recentMessages"><div class="empty-state">${ICON('chat')}<h3>Сообщений пока нет</h3></div></div>`],
  ]);
}
console.log('Patched account-dashboard.html.');

/* ---- 9. my-listings.html: bake all three status panels ---- */
function myListingRowHTML(l, status){
  const label = { active: 'Активно', pending: 'На модерации', archived: 'В архиве' }[status];
  return `<div class="manage-row" data-id="${l.id}">
      <img src="${l.images[0]}" alt="">
      <div class="manage-row-body">
        <div class="manage-row-title">${escapeHtml(l.title)}</div>
        <div class="listing-meta" style="margin-top:4px">
          <span>${formatPrice(l.price, l.currency)}</span>
          <span>${ICON('eye')} ${l.views} · ${timeAgo(l.createdAt)}</span>
        </div>
      </div>
      <span class="status-pill ${status}">${label}</span>
      <div class="manage-row-actions">
        <a class="btn btn-outline btn-sm" href="product.html?id=${l.id}">Смотреть</a>
        <a class="btn btn-outline btn-sm" href="add-listing.html?edit=${l.id}">${ICON('edit')}</a>
        ${status !== 'archived'
          ? `<button class="btn btn-outline btn-sm" data-archive="${l.id}">В архив</button>`
          : `<button class="btn btn-outline btn-sm" data-restore="${l.id}">Восстановить</button>`}
        <button class="btn btn-danger-outline btn-sm" data-delete="${l.id}">${ICON('trash')}</button>
      </div>
    </div>`;
}
function emptyPanelHTML(){
  return `<div class="empty-state">${ICON('boxEmpty')}<h3>Здесь пока пусто</h3>
      <p>Объявления с этим статусом появятся тут.</p></div>`;
}
{
  const mine = LISTINGS.filter(l => l.sellerId === 'u1');
  const panels = {
    active: `<div id="tabPanel-active" class="tab-panel">${mine.map(l => myListingRowHTML(l,'active')).join('') || emptyPanelHTML()}</div>`,
    pending: `<div id="tabPanel-pending" class="tab-panel" style="display:none">${emptyPanelHTML()}</div>`,
    archived: `<div id="tabPanel-archived" class="tab-panel" style="display:none">${emptyPanelHTML()}</div>`,
  };
  patch('my-listings.html', [
    ['<div id="accountNavSlot"></div>', accountNavHTML('my-listings.html', 'Аброр Тошматов', 'seller')],
    ['<a class="btn btn-primary" href="add-listing.html">Новое объявление</a>', `<a class="btn btn-primary" href="add-listing.html">${ICON('plus')} Новое объявление</a>`],
    ['<div id="listingsList"></div>', `<div id="listingsList">\n        ${panels.active}\n        ${panels.pending}\n        ${panels.archived}\n      </div>`],
  ]);
}
console.log('Patched my-listings.html.');

/* ---- 10. favorites.html: bake accountNav + honest empty-state default ---- */
patch('favorites.html', [
  ['<div id="accountNavSlot"></div>', accountNavHTML('favorites.html', 'Аброр Тошматов', 'seller')],
  ['<div class="listing-grid" id="favGrid"></div>', `<div class="listing-grid" id="favGrid"><div class="empty-state" style="grid-column:1/-1">${ICON('heart')}<h3>В избранном пока пусто</h3>
      <p>Нажимайте на ♡ у понравившихся объявлений, чтобы сохранить их здесь.</p>
      <a class="btn btn-secondary" href="catalog.html" style="margin-top:12px">Смотреть объявления</a></div></div>`],
]);
console.log('Patched favorites.html.');

/* ---- 11. messages.html: honest empty-state defaults ---- */
patch('messages.html', [
  ['<div class="conv-list" id="convList"></div>', `<div class="conv-list" id="convList"><div class="empty-state">${ICON('chat')}<h3>Нет диалогов</h3><p>Напишите продавцу со страницы объявления.</p></div></div>`],
  ['<div class="conv-pane" id="convPane"></div>', `<div class="conv-pane" id="convPane"><div class="empty-state" style="margin:auto">${ICON('chat')}<h3>Выберите диалог</h3></div></div>`],
]);
console.log('Patched messages.html.');

/* ---- 12. account-settings.html: bake accountNav ---- */
patch('account-settings.html', [
  ['<div id="accountNavSlot"></div>', accountNavHTML('account-settings.html', 'Аброр Тошматов', 'seller')],
]);
console.log('Patched account-settings.html.');

/* ---- 13. add-listing.html: bake category picker grid + region select options ---- */
{
  const catPicker = CATEGORIES.map(c => `<div class="cat-pick-item" data-cat="${c.id}">${ICON(c.icon)}<span>${c.name}</span></div>`).join('\n        ');
  const regionOptions = REGIONS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
  patch('add-listing.html', [
    ['<div class="cat-picker" id="catPicker"></div>', `<div class="cat-picker" id="catPicker">\n        ${catPicker}\n      </div>`],
    ['<select class="input" id="regionInput" required></select>', `<select class="input" id="regionInput" required>${regionOptions}</select>`],
  ]);
}
console.log('Patched add-listing.html.');

module.exports = {
  ICON, REGIONS, regionName, CATEGORIES, findCategory, SELLERS, LISTINGS, seller, getListingById,
  escapeHtml, formatPrice, timeAgo, initials, ratingStars,
  listingCardHTML, headerHTML, footerHTML, accountNavHTML, patch,
};
