/* =========================================================
   BOZOR.UZ — API layer
   ---------------------------------------------------------
   Every exported function here is written the way the rest of
   the site calls it. Right now they resolve from the local mock
   data files (js/data/*.js). To connect the real Django backend
   later, only THIS file needs to change:

     1. Set API_BASE to your Django host, e.g.
        const API_BASE = 'https://api.bozor.uz';
     2. Inside each function, replace the mock body with a fetch()
        call to the matching DRF endpoint (already sketched in the
        comments below) and keep the same return shape.
     3. Swap localStorage-based auth/favorites for real session/JWT
        handling (see AUTH section).

   Nothing outside this file talks to localStorage or the mock
   arrays directly — that's what makes the swap mechanical.
   ========================================================= */

const API_BASE = null; // e.g. 'https://api.bozor.uz/api' once Django is live
const MOCK_DELAY = 250; // simulate network latency in the demo

function delay(v){ return new Promise(res => setTimeout(() => res(v), MOCK_DELAY)); }

/* ---------------------------------------------------------
   CATEGORIES / REGIONS
   Django: GET /api/categories/   GET /api/regions/
   --------------------------------------------------------- */
async function apiGetCategories(){
  // return fetch(`${API_BASE}/categories/`).then(r => r.json());
  return delay(CATEGORIES);
}
async function apiGetRegions(){
  // return fetch(`${API_BASE}/regions/`).then(r => r.json());
  return delay(REGIONS);
}

/* ---------------------------------------------------------
   LISTINGS
   Django: GET /api/listings/?category=&region=&min_price=&max_price=
                &condition=&q=&sort=&page=
   --------------------------------------------------------- */
async function apiGetListings(filters = {}){
  // const qs = new URLSearchParams(filters).toString();
  // return fetch(`${API_BASE}/listings/?${qs}`).then(r => r.json());

  let results = [...LISTINGS];

  if (filters.category) results = results.filter(l => l.category === filters.category);
  if (filters.sub) results = results.filter(l => l.sub === filters.sub);
  if (filters.region) results = results.filter(l => l.regionId === filters.region);
  if (filters.condition) results = results.filter(l => l.condition === filters.condition);
  if (filters.minPrice) results = results.filter(l => l.price >= Number(filters.minPrice));
  if (filters.maxPrice) results = results.filter(l => l.price <= Number(filters.maxPrice));
  if (filters.q){
    const q = filters.q.toLowerCase();
    results = results.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }

  switch (filters.sort){
    case 'price_asc': results.sort((a,b) => a.price - b.price); break;
    case 'price_desc': results.sort((a,b) => b.price - a.price); break;
    case 'oldest': results.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
    default: results.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest
  }

  // promoted listings float to the top of the default feed
  if (!filters.sort || filters.sort === 'newest'){
    results.sort((a,b) => (b.promoted === true) - (a.promoted === true));
  }

  const page = Number(filters.page || 1);
  const perPage = Number(filters.perPage || 12);
  const total = results.length;
  const paged = results.slice((page-1)*perPage, page*perPage);

  return delay({ results: paged, total, page, perPage, totalPages: Math.max(1, Math.ceil(total/perPage)) });
}

async function apiGetListingById(id){
  // return fetch(`${API_BASE}/listings/${id}/`).then(r => r.json());
  const listing = getListingById(id);
  return delay(listing || null);
}

async function apiGetSimilarListings(listing, limit = 4){
  const results = LISTINGS.filter(l => l.category === listing.category && l.id !== listing.id).slice(0, limit);
  return delay(results);
}

async function apiGetListingsBySeller(sellerId){
  const results = LISTINGS.filter(l => l.sellerId === sellerId);
  return delay(results);
}

async function apiCreateListing(payload){
  // const fd = new FormData(); Object.entries(payload).forEach(([k,v])=>fd.append(k,v));
  // return fetch(`${API_BASE}/listings/`, { method:'POST', body: fd, headers: authHeaders() }).then(r => r.json());
  const newId = Math.max(0, ...LISTINGS.map(l => l.id)) + 1;
  const listing = { id: newId, createdAt: new Date().toISOString(), views: 0, promoted: false, ...payload };
  LISTINGS.unshift(listing);
  persistUserListing(listing);
  return delay(listing);
}

/* demo-only localStorage overlay so created/edited/deleted listings survive
   navigation between static pages — see js/data/listings.js. Not needed once
   Django's database is the real source of truth. */
function persistUserListing(listing){
  try {
    const arr = JSON.parse(localStorage.getItem('bozor_user_listings') || '[]');
    const idx = arr.findIndex(l => l.id === listing.id);
    if (idx > -1) arr[idx] = listing; else arr.push(listing);
    localStorage.setItem('bozor_user_listings', JSON.stringify(arr));
  } catch { /* ignore */ }
}
function persistDeleteListing(id){
  try {
    id = Number(id);
    const arr = (JSON.parse(localStorage.getItem('bozor_user_listings') || '[]')).filter(l => l.id !== id);
    localStorage.setItem('bozor_user_listings', JSON.stringify(arr));
    const deleted = JSON.parse(localStorage.getItem('bozor_deleted_listings') || '[]');
    if (!deleted.includes(id)){ deleted.push(id); localStorage.setItem('bozor_deleted_listings', JSON.stringify(deleted)); }
  } catch { /* ignore */ }
}

/* ---------------------------------------------------------
   AUTH
   Django: POST /api/auth/login/  POST /api/auth/register/
           POST /api/auth/google/  (send Google ID token, backend verifies)
   For now: a fake session kept in localStorage so the UI
   (header, account pages) can react to "being logged in".
   Replace with real JWT/session cookie handling later.
   --------------------------------------------------------- */
const SESSION_KEY = 'bozor_session';

async function apiLogin(email, password){
  // return fetch(`${API_BASE}/auth/login/`, { method:'POST', body: JSON.stringify({email,password}) }).then(r=>r.json());
  if (!email || !password) return delay({ ok: false, error: 'Введите email и пароль' });
  const user = { id: 'u_demo', name: email.split('@')[0], email, role: 'buyer', provider: 'password' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return delay({ ok: true, user });
}

async function apiRegister(data){
  // return fetch(`${API_BASE}/auth/register/`, { method:'POST', body: JSON.stringify(data) }).then(r=>r.json());
  const user = { id: 'u_demo', name: data.name, email: data.email, phone: data.phone, role: data.role || 'buyer', provider: 'password', regionId: data.regionId };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return delay({ ok: true, user });
}

async function apiLoginWithGoogle(){
  // Real version: use Google Identity Services (accounts.google.com/gsi/client) to get
  // an ID token in the browser, then POST it to Django:
  //   fetch(`${API_BASE}/auth/google/`, { method:'POST', body: JSON.stringify({ id_token }) })
  // Django verifies the token with Google and returns your own session/JWT.
  const user = { id: 'u_demo_google', name: 'Гость Google', email: 'user@gmail.com', role: 'buyer', provider: 'google' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return delay({ ok: true, user });
}

function apiGetCurrentUser(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

function apiSetUserRole(role){
  const user = apiGetCurrentUser();
  if (!user) return;
  user.role = role;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function apiLogout(){
  localStorage.removeItem(SESSION_KEY);
}

/* ---------------------------------------------------------
   FAVORITES
   Django: GET/POST/DELETE /api/favorites/
   --------------------------------------------------------- */
const FAV_KEY = 'bozor_favorites';

function apiGetFavoriteIds(){
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
}
function apiToggleFavorite(id){
  let favs = apiGetFavoriteIds();
  id = Number(id);
  if (favs.includes(id)) favs = favs.filter(f => f !== id);
  else favs.push(id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs;
}

/* ---------------------------------------------------------
   MESSAGES (demo only — real version needs websockets or polling)
   Django: GET/POST /api/conversations/
   --------------------------------------------------------- */
const MSG_KEY = 'bozor_messages';

function apiGetConversations(){
  try { return JSON.parse(localStorage.getItem(MSG_KEY)) || []; } catch { return []; }
}
function apiSendMessage(listingId, sellerId, text){
  const convos = apiGetConversations();
  let convo = convos.find(c => c.listingId === Number(listingId));
  if (!convo){
    convo = { listingId: Number(listingId), sellerId, messages: [] };
    convos.push(convo);
  }
  convo.messages.push({ from: 'me', text, time: new Date().toISOString() });
  localStorage.setItem(MSG_KEY, JSON.stringify(convos));
  return convo;
}
