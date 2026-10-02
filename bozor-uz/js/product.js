/* Product page. The full detail markup for listing #1 is already baked
   directly into product.html (see tools/build-static.js) — that's what
   a Django view rendering this template for a specific listing would
   produce. This file:
     1. wires up interactivity (gallery nav, phone reveal) on whatever
        listing is currently shown, baked or not;
     2. if the page was reached with a *different* ?id=, does a one-time
        client-side re-render — a stand-in for what would otherwise be a
        fresh server-rendered page for that id. */

let galleryIndex = 0;
let currentListing = null;

function renderGallery(){
  const imgs = currentListing.images;
  document.getElementById('galleryImg').src = imgs[galleryIndex];
  document.getElementById('galleryImg').alt = currentListing.title;
  document.getElementById('galleryCounter').textContent = `${galleryIndex+1} / ${imgs.length}`;
  document.querySelectorAll('#galleryThumbs img').forEach((img,i) => img.classList.toggle('active', i===galleryIndex));
}

function wireGalleryNav(listing){
  currentListing = listing;
  galleryIndex = 0;
  document.querySelectorAll('#galleryThumbs img').forEach(img => {
    img.addEventListener('click', () => { galleryIndex = Number(img.dataset.i); renderGallery(); });
  });
  document.getElementById('galleryPrev').addEventListener('click', () => {
    galleryIndex = (galleryIndex - 1 + listing.images.length) % listing.images.length; renderGallery();
  });
  document.getElementById('galleryNext').addEventListener('click', () => {
    galleryIndex = (galleryIndex + 1) % listing.images.length; renderGallery();
  });
}

function wirePhoneReveal(listing){
  const s = seller(listing.sellerId);
  document.getElementById('showPhoneBtn').addEventListener('click', () => {
    document.getElementById('phoneModalNumber').textContent = s.phone;
    openModal('phoneModal');
  });
}

function renderAttrs(listing, cat){
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
  document.getElementById('attrsTable').innerHTML = rows.map(([k,v]) => `
    <div class="attrs-row"><span>${k}</span><span>${escapeHtml(String(v))}</span></div>
  `).join('');
}

function ratingStars(rating){ return '★'.repeat(Math.round(rating)); }

/* full client-side re-render — only used when ?id= points at a listing
   other than the one already baked into the page */
async function renderFullProduct(listing){
  const cat = findCategory(listing.category);
  const s = seller(listing.sellerId);

  document.getElementById('pageTitle').textContent = `${listing.title} — bozor.uz`;
  document.getElementById('breadcrumbs').innerHTML = `
    <a href="index.html">Главная</a><span class="sep">/</span>
    <a href="catalog.html?category=${listing.category}">${cat ? cat.name : ''}</a><span class="sep">/</span>
    <span class="current">${escapeHtml(listing.title)}</span>
  `;

  document.getElementById('galleryThumbs').innerHTML = listing.images.map((src,i) =>
    `<img src="${src}" data-i="${i}" class="${i===0?'active':''}" alt="Фото ${i+1}">`).join('');
  wireGalleryNav(listing);
  renderGallery();

  document.getElementById('productTitle').textContent = listing.title;
  document.getElementById('productMetaRow').innerHTML = `
    <span>${ICON('pin')} ${listing.city}</span>
    <span>${ICON('clock')} ${timeAgo(listing.createdAt)}</span>
    <span>${ICON('eye')} ${listing.views} просмотров</span>
  `;
  document.getElementById('productDesc').textContent = listing.description;
  renderAttrs(listing, cat);

  document.getElementById('sidePrice').textContent = formatPrice(listing.price, listing.currency);
  document.getElementById('sideNegotiable').textContent = listing.negotiable ? 'Возможен торг' : '';

  wirePhoneReveal(listing);
  document.getElementById('messageSellerBtn').href = `contact-seller.html?listing=${listing.id}`;

  document.getElementById('sellerAvatarLink').textContent = initials(s.name);
  document.getElementById('sellerAvatarLink').href = `seller-profile.html?id=${s.id}`;
  document.getElementById('sellerNameLink').textContent = s.name;
  document.getElementById('sellerNameLink').href = `seller-profile.html?id=${s.id}`;
  document.getElementById('sellerSub').textContent = `${ratingStars(s.rating)} ${s.rating} · на сайте с ${new Date(s.registered).getFullYear()} г.`;
  document.getElementById('sellerProfileLink').href = `seller-profile.html?id=${s.id}`;

  const similar = await apiGetSimilarListings(listing);
  document.getElementById('similarSection').style.display = similar.length ? 'block' : 'none';
  document.getElementById('similarGrid').innerHTML = similar.map(listingCardHTML).join('');
}

async function initProduct(){
  const id = qsGet('id');

  if (id && Number(id) !== 1){
    const listing = await apiGetListingById(id);
    if (!listing){
      document.getElementById('productLayout').style.display = 'none';
      document.getElementById('notFoundState').style.display = 'block';
      return;
    }
    await renderFullProduct(listing);
  } else {
    // default case: listing #1 is already baked into the page — just
    // make its gallery and phone-reveal interactive.
    const listing = getListingById(1);
    wireGalleryNav(listing);
    wirePhoneReveal(listing);
  }
}

document.addEventListener('DOMContentLoaded', initProduct);
