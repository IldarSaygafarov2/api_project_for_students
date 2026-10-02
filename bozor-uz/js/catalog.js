/* Catalog page. The default (unfiltered) grid, filter <select> option
   lists, breadcrumbs, result count and pagination are already baked
   directly into catalog.html (see tools/build-static.js) — so on a
   plain visit to catalog.html this file does nothing but wire up the
   controls. It only re-renders the grid when the user actually
   interacts with a filter/sort/page control, or when the page was
   reached with query-string filters already applied (e.g. clicking a
   category link) — that combination can't be pre-baked for every
   possible filter, so JS fills that one case in. */

let currentPage = 1;

function currentFiltersFromUrl(){
  const p = qsGetAll();
  return {
    category: p.category || '',
    sub: p.sub || '',
    region: p.region || '',
    minPrice: p.minPrice || '',
    maxPrice: p.maxPrice || '',
    condition: p.condition || '',
    q: p.q || '',
    sort: p.sort || 'newest',
    page: Number(p.page || 1),
  };
}

function readFiltersFromUI(){
  const checkedCondition = document.querySelector('input[name="condition"]:checked');
  return {
    category: document.getElementById('filterCategory').value,
    sub: document.querySelector('.sub-chip.active')?.dataset.sub || '',
    region: document.getElementById('filterRegion').value,
    minPrice: document.getElementById('filterMinPrice').value,
    maxPrice: document.getElementById('filterMaxPrice').value,
    condition: checkedCondition ? checkedCondition.value : '',
    q: qsGet('q') || '',
    sort: document.getElementById('sortSelect').value,
  };
}

function renderSubChips(categoryId){
  const group = document.getElementById('subFilterGroup');
  const row = document.getElementById('subChipRow');
  const cat = findCategory(categoryId);
  if (!cat || !cat.subs.length){ group.style.display = 'none'; row.innerHTML=''; return; }
  group.style.display = 'block';
  row.innerHTML = cat.subs.map(s => `<button type="button" class="sub-chip" data-sub="${escapeHtml(s)}">${s}</button>`).join('');
  row.querySelectorAll('.sub-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const wasActive = chip.classList.contains('active');
      row.querySelectorAll('.sub-chip').forEach(c => c.classList.remove('active'));
      if (!wasActive) chip.classList.add('active');
      currentPage = 1;
      loadAndRender();
    });
  });
}

function setUIFromFilters(f){
  document.getElementById('filterCategory').value = f.category || '';
  document.getElementById('filterRegion').value = f.region || '';
  document.getElementById('filterMinPrice').value = f.minPrice || '';
  document.getElementById('filterMaxPrice').value = f.maxPrice || '';
  document.getElementById('sortSelect').value = f.sort || 'newest';
  document.querySelectorAll('input[name="condition"]').forEach(r => r.checked = (r.value === (f.condition || '')));
  renderSubChips(f.category);
  if (f.sub){
    const chip = document.querySelector(`.sub-chip[data-sub="${CSS.escape(f.sub)}"]`);
    chip?.classList.add('active');
  }
}

function updateBreadcrumbsAndTitle(f){
  const cat = findCategory(f.category);
  let title = 'Все объявления';
  const crumbs = [`<a href="index.html">Главная</a>`, `<span class="sep">/</span>`];
  if (f.q){
    title = `Результаты по запросу «${escapeHtml(f.q)}»`;
    crumbs.push(`<span class="current">Поиск</span>`);
  } else if (cat){
    title = f.sub || cat.name;
    crumbs.push(`<a href="catalog.html?category=${cat.id}">${cat.name}</a>`);
    if (f.sub) { crumbs.push(`<span class="sep">/</span>`, `<span class="current">${escapeHtml(f.sub)}</span>`); }
    else crumbs[crumbs.length-1] = `<span class="current">${cat.name}</span>`;
  } else {
    crumbs.push(`<span class="current">Все объявления</span>`);
  }
  document.getElementById('catalogTitle').textContent = title;
  document.getElementById('pageTitle').textContent = `${title} — bozor.uz`;
  document.getElementById('breadcrumbs').innerHTML = crumbs.join('');
}

function renderActiveChips(f){
  const chips = [];
  if (f.q) chips.push(['q', `Поиск: ${f.q}`]);
  if (f.region) chips.push(['region', regionName(f.region)]);
  if (f.condition) chips.push(['condition', f.condition]);
  if (f.minPrice) chips.push(['minPrice', `от ${formatPrice(f.minPrice,'UZS')}`]);
  if (f.maxPrice) chips.push(['maxPrice', `до ${formatPrice(f.maxPrice,'UZS')}`]);
  const el = document.getElementById('activeChips');
  if (!chips.length){ el.innerHTML=''; return; }
  el.innerHTML = chips.map(([key,label]) => `
    <span class="chip">${escapeHtml(label)}<button data-remove-chip="${key}">${ICON('close')}</button></span>
  `).join('');
  el.querySelectorAll('[data-remove-chip]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.removeChip;
      if (key === 'q'){ const u = new URL(window.location); u.searchParams.delete('q'); history.replaceState({}, '', u); }
      if (key === 'region') document.getElementById('filterRegion').value = '';
      if (key === 'condition') document.querySelectorAll('input[name="condition"]').forEach(r=>r.checked = r.value==='');
      if (key === 'minPrice') document.getElementById('filterMinPrice').value = '';
      if (key === 'maxPrice') document.getElementById('filterMaxPrice').value = '';
      currentPage = 1;
      loadAndRender();
    });
  });
}

function wirePaginationButtons(){
  document.querySelectorAll('#pagination [data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = Number(btn.dataset.page);
      loadAndRender();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderPagination(page, totalPages){
  const el = document.getElementById('pagination');
  if (totalPages <= 1){ el.innerHTML=''; return; }
  let html = '';
  for (let i=1;i<=totalPages;i++){
    html += `<button class="${i===page?'active':''}" data-page="${i}">${i}</button>`;
  }
  el.innerHTML = html;
  wirePaginationButtons();
}

async function loadAndRender(){
  const f = readFiltersFromUI();
  f.page = currentPage;

  // reflect filters in the URL so the page is shareable/bookmarkable
  const url = new URL(window.location);
  ['category','sub','region','minPrice','maxPrice','condition','sort'].forEach(k => {
    if (f[k]) url.searchParams.set(k, f[k]); else url.searchParams.delete(k);
  });
  if (f.page > 1) url.searchParams.set('page', f.page); else url.searchParams.delete('page');
  history.replaceState({}, '', url);

  updateBreadcrumbsAndTitle(f);
  renderActiveChips(f);

  const { results, total, totalPages, page } = await apiGetListings(f);
  document.getElementById('resultCount').innerHTML = `Найдено: <b>${total}</b> объявлени${total%10===1 && total%100!==11 ? 'е' : (total%10>=2 && total%10<=4 && (total%100<10||total%100>=20) ? 'я' : 'й')}`;

  const grid = document.getElementById('catalogGrid');
  const emptyEl = document.getElementById('emptyState');
  if (results.length){
    grid.style.display = 'grid';
    grid.innerHTML = results.map(listingCardHTML).join('');
    emptyEl.innerHTML = '';
  } else {
    grid.style.display = 'none';
    emptyEl.innerHTML = `<div class="empty-state">
      ${ICON('boxEmpty')}
      <h3>Ничего не найдено</h3>
      <p>Попробуйте изменить фильтры или снять часть условий поиска.</p>
      <button class="btn btn-secondary" id="resetFromEmpty" style="margin-top:16px">Сбросить фильтры</button>
    </div>`;
    document.getElementById('resetFromEmpty')?.addEventListener('click', resetFilters);
  }
  renderPagination(page, totalPages);
}

function resetFilters(){
  window.location.href = 'catalog.html';
}

function openFilters(){ document.getElementById('filtersPanel').classList.add('open'); document.getElementById('filtersBackdrop').classList.add('open'); document.body.style.overflow='hidden'; }
function closeFilters(){ document.getElementById('filtersPanel').classList.remove('open'); document.getElementById('filtersBackdrop').classList.remove('open'); document.body.style.overflow=''; }

function initCatalog(){
  document.getElementById('filtersToggleBtn').innerHTML = ICON('filter') + ' Фильтры';
  document.getElementById('closeFiltersBtn').innerHTML = ICON('close');

  const f = currentFiltersFromUrl();
  currentPage = f.page;
  setUIFromFilters(f);

  document.getElementById('filterCategory').addEventListener('change', (e) => {
    renderSubChips(e.target.value);
    currentPage = 1; loadAndRender();
  });
  document.getElementById('applyFiltersBtn').addEventListener('click', () => { currentPage = 1; loadAndRender(); closeFilters(); });
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
  document.getElementById('sortSelect').addEventListener('change', () => loadAndRender());
  document.getElementById('filtersToggleBtn').addEventListener('click', openFilters);
  document.getElementById('closeFiltersBtn').addEventListener('click', closeFilters);
  document.getElementById('filtersBackdrop').addEventListener('click', closeFilters);
  ['filterMinPrice','filterMaxPrice'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => { currentPage = 1; loadAndRender(); });
  });

  if (window.location.search){
    // arrived via a filtered link (e.g. a category card) — the static
    // default grid doesn't match this, so render the real filtered view
    loadAndRender();
  } else {
    // plain /catalog.html — the default grid is already baked into the
    // page, just make its pagination buttons clickable
    wirePaginationButtons();
  }
}

document.addEventListener('DOMContentLoaded', initCatalog);
