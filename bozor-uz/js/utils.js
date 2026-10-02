/* Shared helpers used across pages */

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

function qsGet(name){
  return new URLSearchParams(window.location.search).get(name);
}
function qsGetAll(){
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}
function qsBuild(params){
  const clean = Object.fromEntries(Object.entries(params).filter(([,v]) => v !== '' && v !== null && v !== undefined));
  return new URLSearchParams(clean).toString();
}

function toast(message){
  let el = document.querySelector('.toast');
  if (!el){
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.innerHTML = `${ICON('check')}<span>${message}</span>`;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function debounce(fn, wait = 300){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* current region stored client-side; in Django version this can be tied
   to the logged-in user's saved address or IP-based geolocation lookup */
const CURRENT_REGION_KEY = 'bozor_current_region';
function getCurrentRegionId(){
  return localStorage.getItem(CURRENT_REGION_KEY) || 'tashkent-city';
}
function setCurrentRegionId(id){
  localStorage.setItem(CURRENT_REGION_KEY, id);
}
