/* Contact-seller page. The example for listing #1 is already baked
   into contact-seller.html. This file wires up the form (always
   needed) and only re-renders the listing/seller summary when the
   page was reached with a different ?listing=. */

function wireQuickMessages(){
  document.querySelectorAll('.quick-msg-btn').forEach(btn => {
    btn.addEventListener('click', () => { document.getElementById('messageText').value = btn.textContent; });
  });
}

function wireContactForm(listing){
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('messageText').value.trim();
    if (!text) return;
    const btn = document.getElementById('sendMsgBtn');
    btn.disabled = true; btn.textContent = 'Отправляем…';
    apiSendMessage(listing.id, listing.sellerId, text);
    setTimeout(() => {
      document.getElementById('formState').style.display = 'none';
      document.getElementById('sentState').style.display = 'block';
    }, 300);
  });
}

async function renderFullContactSeller(listing){
  const s = seller(listing.sellerId);
  document.getElementById('breadcrumbs').innerHTML = `
    <a href="index.html">Главная</a><span class="sep">/</span>
    <a href="product.html?id=${listing.id}">${escapeHtml(listing.title)}</a><span class="sep">/</span>
    <span class="current">Написать продавцу</span>
  `;
  document.getElementById('sellerNameLabel').textContent = `Продавцу: ${s.name}`;
  document.getElementById('listingSummary').innerHTML = `
    <img src="${listing.images[0]}" alt="">
    <div>
      <div style="font-size:var(--fs-sm);font-weight:600;line-height:1.3">${escapeHtml(listing.title)}</div>
      <div class="listing-price" style="font-size:var(--fs-base);margin-top:4px">${formatPrice(listing.price, listing.currency)}</div>
    </div>
  `;
  document.getElementById('sellerBox').innerHTML = `
    <div class="avatar">${initials(s.name)}</div>
    <div>
      <div class="seller-name">${escapeHtml(s.name)}</div>
      <div class="seller-sub">${regionName(s.regionId)}</div>
    </div>
  `;
  document.getElementById('goToChatBtn').href = `messages.html?listing=${listing.id}`;
}

async function initContactSeller(){
  // require auth before contacting a seller (session-specific, so this
  // check always runs regardless of whether content below is baked)
  if (!apiGetCurrentUser()){
    const here = 'contact-seller.html' + window.location.search;
    window.location.href = `login.html?next=${encodeURIComponent(here)}`;
    return;
  }

  wireQuickMessages();

  const listingId = qsGet('listing');
  if (listingId && Number(listingId) !== 1){
    const listing = await apiGetListingById(listingId);
    if (!listing){
      document.getElementById('contactLayout').style.display = 'none';
      document.getElementById('notFoundState').style.display = 'block';
      return;
    }
    await renderFullContactSeller(listing);
    wireContactForm(listing);
  } else {
    wireContactForm(getListingById(1));
  }
}

document.addEventListener('DOMContentLoaded', initContactSeller);
