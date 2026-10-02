let activeListingId = null;

const AUTO_REPLIES = [
  'Здравствуйте! Да, ещё актуально.',
  'Добрый день, можем встретиться завтра днём.',
  'Спасибо за интерес! Небольшой торг возможен.',
];

function convItemHTML(c){
  const l = getListingById(c.listingId);
  if (!l) return '';
  const last = c.messages[c.messages.length - 1];
  const s = seller(l.sellerId);
  return `
    <div class="conv-item ${c.listingId === activeListingId ? 'active' : ''}" data-listing="${c.listingId}">
      <img src="${l.images[0]}" alt="" style="width:46px;height:46px;object-fit:cover;border-radius:8px;flex-shrink:0">
      <div class="conv-item-body">
        <div class="conv-item-top"><span>${escapeHtml(s.name)}</span><span style="font-weight:400;color:var(--color-ink-faint)">${timeAgo(last.time)}</span></div>
        <div class="conv-item-listing">${escapeHtml(l.title)}</div>
        <div class="conv-item-preview">${escapeHtml(last.text)}</div>
      </div>
    </div>
  `;
}

function renderConvList(){
  const convos = apiGetConversations();
  const el = document.getElementById('convList');
  if (!convos.length){
    el.innerHTML = `<div class="empty-state">${ICON('chat')}<h3>Нет диалогов</h3><p>Напишите продавцу со страницы объявления.</p></div>`;
    return;
  }
  el.innerHTML = convos.map(convItemHTML).join('');
  el.querySelectorAll('.conv-item').forEach(item => {
    item.addEventListener('click', () => { activeListingId = Number(item.dataset.listing); renderConvList(); renderConvPane(); });
  });
}

function renderConvPane(){
  const pane = document.getElementById('convPane');
  const convos = apiGetConversations();
  const convo = convos.find(c => c.listingId === activeListingId);
  if (!convo){
    pane.innerHTML = `<div class="empty-state" style="margin:auto">${ICON('chat')}<h3>Выберите диалог</h3></div>`;
    return;
  }
  const l = getListingById(convo.listingId);
  const s = seller(l.sellerId);
  pane.innerHTML = `
    <div class="conv-header">
      <div class="avatar avatar-sm">${initials(s.name)}</div>
      <div>
        <div style="font-weight:700;font-size:var(--fs-sm)">${escapeHtml(s.name)}</div>
        <a href="product.html?id=${l.id}" style="font-size:var(--fs-xs);color:var(--color-primary)">${escapeHtml(l.title)}</a>
      </div>
      <a class="btn btn-outline btn-sm" style="margin-left:auto" href="seller-profile.html?id=${s.id}">Профиль</a>
    </div>
    <div class="conv-body" id="convBody">
      ${convo.messages.map(m => `
        <div class="msg-bubble ${m.from === 'me' ? 'out' : 'in'}">
          ${escapeHtml(m.text)}
          <span class="msg-time">${new Date(m.time).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</span>
        </div>
      `).join('')}
    </div>
    <form class="conv-composer" id="composerForm">
      <input type="text" id="composerInput" placeholder="Напишите сообщение…" autocomplete="off" required>
      <button type="submit">${ICON('send')}</button>
    </form>
  `;
  document.getElementById('convBody').scrollTop = 999999;

  document.getElementById('composerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('composerInput');
    const text = input.value.trim();
    if (!text) return;
    apiSendMessage(convo.listingId, l.sellerId, text);
    input.value = '';
    renderConvList(); renderConvPane();

    // demo-only: simulate the seller replying after a short delay
    setTimeout(() => {
      const c = apiGetConversations().find(c => c.listingId === convo.listingId);
      c.messages.push({ from: 'seller', text: AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)], time: new Date().toISOString() });
      localStorage.setItem('bozor_messages', JSON.stringify(apiGetConversations().map(x => x.listingId === c.listingId ? c : x)));
      renderConvList(); renderConvPane();
    }, 1200);
  });
}

function init(){
  if (!requireAuth()) return;

  const convos = apiGetConversations();
  if (!convos.length) return; // baked empty states already match this case

  const listingParam = qsGet('listing');
  activeListingId = listingParam ? Number(listingParam) : (convos[0]?.listingId ?? null);

  renderConvList();
  renderConvPane();
}

document.addEventListener('DOMContentLoaded', init);
