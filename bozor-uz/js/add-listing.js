let step = 0;
const TOTAL_STEPS = 5;
let selectedCategory = '';
let selectedSub = '';
let photos = [];
let editId = null;

/* The category grid itself is already baked into add-listing.html
   (see tools/build-static.js) — this just wires clicks on it and
   toggles which item shows as selected. */
function selectCategoryItem(catId){
  selectedCategory = catId;
  document.querySelectorAll('.cat-pick-item').forEach(item => item.classList.toggle('selected', item.dataset.cat === catId));
}
function wireCategoryPicker(){
  document.getElementById('catPicker').addEventListener('click', (e) => {
    const item = e.target.closest('.cat-pick-item');
    if (!item) return;
    selectedSub = '';
    selectCategoryItem(item.dataset.cat);
    renderSubPicker();
  });
}

function renderSubPicker(){
  const wrap = document.getElementById('subPickerWrap');
  const cat = findCategory(selectedCategory);
  if (!cat || !cat.subs.length){ wrap.hidden = true; return; }
  wrap.hidden = false;
  document.getElementById('subPicker').innerHTML =
    `<option value="">Не выбрано</option>` + cat.subs.map(s => `<option value="${escapeHtml(s)}" ${s===selectedSub?'selected':''}>${s}</option>`).join('');
  document.getElementById('subPicker').onchange = (e) => selectedSub = e.target.value;
}

function renderPhotoUploader(){
  const el = document.getElementById('photoUploader');
  let html = photos.map((src, i) => `
    <div class="photo-slot" data-photo-i="${i}">
      <img src="${src}" alt="Фото ${i+1}">
      ${i===0 ? '<span class="cover-tag">Обложка</span>' : ''}
      <span class="remove-photo" data-remove="${i}">${ICON('close')}</span>
    </div>
  `).join('');
  if (photos.length < 8){
    html += `<div class="photo-slot" id="addPhotoSlot">${ICON('camera')}<span>Добавить фото</span></div>`;
  }
  el.innerHTML = html;
  document.getElementById('addPhotoSlot')?.addEventListener('click', () => document.getElementById('photoInput').click());
  el.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      photos.splice(Number(btn.dataset.remove), 1);
      renderPhotoUploader();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('photoInput').addEventListener('change', (e) => {
    const files = Array.from(e.target.files).slice(0, 8 - photos.length);
    let pending = files.length;
    if (!pending) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => { photos.push(reader.result); if (--pending === 0) renderPhotoUploader(); };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  });
});

function renderDynamicAttrs(prefillAttrs){
  const cat = findCategory(selectedCategory);
  const wrap = document.getElementById('dynamicAttrsWrap');
  if (!cat || !cat.attrs.length){ wrap.innerHTML = ''; return; }
  wrap.innerHTML = `<div class="field-2col">` + cat.attrs.map(a => {
    const val = (prefillAttrs && prefillAttrs[a.key]) || '';
    if (a.type === 'select'){
      return `<div class="field"><label>${a.label}</label>
        <select class="input dyn-attr" data-key="${a.key}">
          <option value="">Не указано</option>
          ${a.options.map(o => `<option value="${o}" ${o===val?'selected':''}>${o}</option>`).join('')}
        </select></div>`;
    }
    return `<div class="field"><label>${a.label}</label>
      <input class="input dyn-attr" data-key="${a.key}" type="${a.type==='number'?'number':'text'}" value="${escapeHtml(String(val))}"></div>`;
  }).join('') + `</div>`;
}

function collectDynamicAttrs(){
  const attrs = {};
  document.querySelectorAll('.dyn-attr').forEach(f => { if (f.value) attrs[f.dataset.key] = f.type === 'number' ? Number(f.value) : f.value; });
  return attrs;
}

function goToStep(n){
  step = Math.max(0, Math.min(TOTAL_STEPS - 1, n));
  document.querySelectorAll('.wizard-panel').forEach(p => p.classList.toggle('active', Number(p.dataset.panel) === step));
  document.querySelectorAll('.wizard-step').forEach(s => {
    const i = Number(s.dataset.step);
    s.classList.toggle('active', i === step);
    s.classList.toggle('done', i < step);
  });
  document.getElementById('wizardBackBtn').style.visibility = step === 0 ? 'hidden' : 'visible';
  document.getElementById('wizardNextBtn').textContent = step === TOTAL_STEPS - 1
    ? (editId ? 'Сохранить изменения' : 'Опубликовать объявление')
    : 'Далее';

  if (step === 2) renderDynamicAttrs(editId ? getListingById(editId)?.attrs : null);
  if (step === 4) renderReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(){
  if (step === 0){
    if (!selectedCategory){ toast('Выберите категорию'); return false; }
  }
  if (step === 1){
    if (!photos.length){ toast('Добавьте хотя бы одно фото'); return false; }
  }
  if (step === 2){
    if (!document.getElementById('titleInput').value.trim()){ toast('Введите заголовок'); return false; }
    if (!document.getElementById('descInput').value.trim()){ toast('Добавьте описание'); return false; }
    if (document.getElementById('priceInput').value === ''){ toast('Укажите цену'); return false; }
  }
  if (step === 3){
    if (!document.getElementById('regionInput').value){ toast('Выберите регион'); return false; }
    if (!document.getElementById('cityInput').value.trim()){ toast('Укажите город или район'); return false; }
    if (!document.getElementById('phoneInput').value.trim()){ toast('Укажите телефон для связи'); return false; }
  }
  return true;
}

function renderReview(){
  document.getElementById('reviewPhotos').innerHTML = photos.map(p => `<img src="${p}" alt="">`).join('');
  const cat = findCategory(selectedCategory);
  const rows = [
    ['Категория', selectedSub ? `${cat.name} / ${selectedSub}` : cat.name],
    ['Заголовок', document.getElementById('titleInput').value],
    ['Цена', formatPrice(document.getElementById('priceInput').value, 'UZS') + (document.getElementById('negotiableInput').checked ? ' (торг)' : '')],
    ['Состояние', document.getElementById('conditionInput').value || '—'],
    ['Регион', regionName(document.getElementById('regionInput').value)],
    ['Город/район', document.getElementById('cityInput').value],
    ['Телефон', '+998 ' + document.getElementById('phoneInput').value],
  ];
  document.getElementById('reviewRows').innerHTML = rows.map(([k,v]) => `<div class="review-row"><span>${k}</span><span>${escapeHtml(String(v))}</span></div>`).join('');
}

async function publish(){
  const btn = document.getElementById('wizardNextBtn');
  btn.disabled = true; btn.textContent = 'Публикуем…';

  const payload = {
    title: document.getElementById('titleInput').value.trim(),
    description: document.getElementById('descInput').value.trim(),
    price: Number(document.getElementById('priceInput').value),
    currency: 'UZS',
    negotiable: document.getElementById('negotiableInput').checked,
    condition: document.getElementById('conditionInput').value || null,
    category: selectedCategory,
    sub: selectedSub,
    regionId: document.getElementById('regionInput').value,
    city: document.getElementById('cityInput').value.trim(),
    images: photos,
    attrs: collectDynamicAttrs(),
    sellerId: 'u1', // demo: new listings are attached to seed seller "u1" so they show under "Мои объявления"
  };

  if (editId){
    const listing = getListingById(editId);
    Object.assign(listing, payload);
    persistUserListing(listing);
    toast('Изменения сохранены');
    window.location.href = 'my-listings.html';
  } else {
    const created = await apiCreateListing(payload);
    toast('Объявление опубликовано');
    window.location.href = `product.html?id=${created.id}`;
  }
}

function prefillForEdit(){
  const l = getListingById(editId);
  if (!l) return;
  document.getElementById('wizardTitle').textContent = 'Редактировать объявление';
  document.getElementById('pageTitle').textContent = 'Редактировать объявление — bozor.uz';
  selectedCategory = l.category;
  selectedSub = l.sub || '';
  photos = [...l.images];
  selectCategoryItem(l.category); renderSubPicker(); renderPhotoUploader();
  document.getElementById('titleInput').value = l.title;
  document.getElementById('descInput').value = l.description;
  document.getElementById('priceInput').value = l.price;
  document.getElementById('conditionInput').value = l.condition || '';
  document.getElementById('negotiableInput').checked = !!l.negotiable;
  document.getElementById('regionInput').value = l.regionId;
  document.getElementById('cityInput').value = l.city;
  document.getElementById('phoneInput').value = (seller(l.sellerId)?.phone || '').replace('+998','').trim();
}

function init(){
  if (!requireAuth()) return;

  editId = qsGet('edit') ? Number(qsGet('edit')) : null;
  document.getElementById('regionInput').value = getCurrentRegionId();

  wireCategoryPicker();
  renderPhotoUploader();
  if (editId) prefillForEdit();

  document.getElementById('wizardNextBtn').addEventListener('click', () => {
    if (!validateStep()) return;
    if (step === TOTAL_STEPS - 1) publish();
    else goToStep(step + 1);
  });
  document.getElementById('wizardBackBtn').addEventListener('click', () => goToStep(step - 1));

  goToStep(0);
}

document.addEventListener('DOMContentLoaded', init);
