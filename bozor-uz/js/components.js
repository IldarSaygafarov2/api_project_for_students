/* =========================================================
   Shared site chrome — interactivity only.
   ---------------------------------------------------------
   The header, footer, and region-picker modal markup is now
   baked directly into every .html page (see tools/build-static.js).
   This file no longer builds that markup with JS — it only wires
   up behavior on top of what's already in the DOM: opening the
   region modal, geolocation, the mobile menu button, logout, etc.
   Runs automatically on every page that includes this script.
   ========================================================= */

function wireHeaderInteractions(){
  document.getElementById('regionPillBtn')?.addEventListener('click', () => openModal('regionModal'));

  document.getElementById('geoDetectBtn')?.addEventListener('click', () => {
    if (!navigator.geolocation){ toast('Геолокация недоступна в этом браузере'); return; }
    navigator.geolocation.getCurrentPosition(
      () => {
        // NOTE: real version would reverse-geocode lat/lng via a maps API
        // and match it to the closest region on the Django backend.
        setCurrentRegionId('tashkent-city');
        const label = document.getElementById('regionPillLabel');
        if (label) label.textContent = 'Ташкент город';
        toast('Регион определён: Ташкент город');
        closeModal('regionModal');
      },
      () => toast('Не удалось определить местоположение')
    );
  });

  document.querySelectorAll('.region-option-row').forEach(btn => {
    btn.addEventListener('click', () => {
      setCurrentRegionId(btn.dataset.region);
      const label = document.getElementById('regionPillLabel');
      if (label) label.textContent = btn.dataset.regionName || btn.dataset.region;
      closeModal('regionModal');
      // NOTE: with a real backend, changing region would reload the page so
      // the server can re-filter listings; here we just remember the choice.
    });
  });

  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    window.location.href = apiGetCurrentUser() ? 'account-dashboard.html' : 'login.html';
  });
}

function wireAccountLogout(){
  document.getElementById('accountLogoutLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    apiLogout();
    window.location.href = 'index.html';
  });
}

/* redirect to login if not authenticated; call at top of every account-*.html page's script */
function requireAuth(){
  if (!apiGetCurrentUser()){
    window.location.href = `login.html?next=${encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search)}`;
    return false;
  }
  return true;
}

/* ---------- shared listing card markup ----------
   Still used by JS in a few legitimately-dynamic cases: catalog.js
   re-rendering after the user changes filters/sort/page, and
   my-listings.html moving a row between status tabs. The *initial*
   content of every page is already baked as static HTML. */
function listingCardHTML(l){
  const favs = apiGetFavoriteIds();
  const isFav = favs.includes(Number(l.id));
  return `
    <article class="listing-card">
      <a href="product.html?id=${l.id}" class="listing-thumb-link">
        <div class="listing-thumb">
          <img src="${l.images[0]}" alt="${escapeHtml(l.title)}" loading="lazy">
          ${l.promoted ? `<span class="listing-badge">Топ</span>` : ''}
          <button class="listing-fav ${isFav ? 'is-fav' : ''}" data-fav-id="${l.id}" aria-label="В избранное">${ICON('heart')}</button>
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
    </article>
  `;
}

/* event delegation so favoriting works for both baked-in cards and any
   card a page later renders dynamically (e.g. catalog filtering) */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-fav-id]');
  if (!btn) return;
  e.preventDefault(); e.stopPropagation();
  const favs = apiToggleFavorite(btn.dataset.favId);
  const isFav = favs.includes(Number(btn.dataset.favId));
  document.querySelectorAll(`[data-fav-id="${btn.dataset.favId}"]`).forEach(b => b.classList.toggle('is-fav', isFav));
  toast(isFav ? 'Добавлено в избранное' : 'Удалено из избранного');
});
/* kept for readability at call sites; favoriting itself is handled
   globally above via event delegation, so this is a safe no-op. */
function wireFavButtons(){ /* handled globally via event delegation above */ }

/* ---------- account cabinet sidebar ----------
   Baked directly into each account-*.html page now
   (tools/build-static.js -> accountNavHTML). Nothing to build here. */

/* ---------- generic modal helpers ---------- */
function openModal(id){ document.getElementById(id)?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id){ document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close-modal]')) closeModal(e.target.closest('[data-close-modal]').dataset.closeModal);
  if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); document.body.style.overflow=''; }
});

/* safety net: fill any .modal-close button authored without an inline
   icon (a couple of page-specific modals still do this) */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-close').forEach(btn => { if (!btn.innerHTML.trim()) btn.innerHTML = ICON('close'); });
  wireHeaderInteractions();
  wireAccountLogout();
});
