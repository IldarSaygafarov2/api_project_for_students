/* Small inline icon set — single stroke style, 24x24 viewbox.
   Usage: ICON('search') -> returns <svg>...</svg> markup string. */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  pin: '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>',
  heart: '<path d="M12 20s-7.5-4.6-10-9.3C.4 7.6 2 4 5.6 4c2.1 0 3.6 1.2 4.4 2.6C10.8 5.2 12.3 4 14.4 4 18 4 19.6 7.6 18 10.7 15.5 15.4 12 20 12 20z"/>',
  chat: '<path d="M4 5h16v11H8l-4 4z"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.4-3.7 4.4-5.6 7.5-5.6s6.1 1.9 7.5 5.6"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"/><path d="M10 19.5a2 2 0 0 0 4 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
  chevronRight: '<path d="M9 18l6-6-6-6"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L12 16.7l-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.7z"/>',
  shieldCheck: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  camera: '<path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  phone: '<path d="M6 4h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3c0 1-1 2-2 2C10.5 20 4 13.5 4 6c0-1 1-2 2-2z"/>',
  send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M20 4l-6.5 8.5"/>',
  edit: '<path d="M4 20h4l11-11-4-4L4 16z"/>',
  logout: '<path d="M9 4H5v16h4"/><path d="M14 8l4 4-4 4"/><path d="M9 12h9"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  car: '<path d="M4 16V11l2-5h12l2 5v5"/><circle cx="7.5" cy="16.5" r="1.6"/><circle cx="16.5" cy="16.5" r="1.6"/><path d="M4 11h16"/>',
  home: '<path d="M4 11l8-6 8 6v9H4z"/><path d="M9.5 20v-6h5v6"/>',
  phoneCase: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  briefcase: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V5h8v3"/>',
  wrench: '<path d="M14 7a4 4 0 0 1-5.4 5.4L4 17l3 3 4.6-4.6A4 4 0 0 0 17 10z"/>',
  shirt: '<path d="M8 4l4 2 4-2 4 4-3 3v11H7V11L4 8z"/>',
  sofa: '<path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M3 12h18v5H3z"/><path d="M5 17v3M19 17v3"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>',
  google: '<path fill="#4285F4" stroke="none" d="M21.6 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.75 3-4.3 3-7.4z"/><path fill="#34A853" stroke="none" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.75-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" stroke="none" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"/><path fill="#EA4335" stroke="none" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3 14.7 2 12 2A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.35 3-4 5.6-4z"/>',
  telegram: '<path d="M21 4L2.5 11.4c-.9.35-.9 1.05-.15 1.3l4.5 1.4 1.7 5.3c.2.6.4.65.85.3l2.4-1.9 4.4 3.25c.6.35 1.1.15 1.25-.55L21.9 5.1c.2-.85-.35-1.35-1-1.1z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/>',
  facebook: '<path d="M14 21v-8h3l.5-4H14V6.5c0-1.15.3-1.9 2-1.9H17.5V1.1C17.2 1.05 16 1 14.7 1 11.9 1 10 2.7 10 5.8V9H7v4h3v8z" fill="currentColor" stroke="none"/>',
  imageStack: '<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>',
  boxEmpty: '<rect x="3" y="9" width="18" height="11" rx="1"/><path d="M3 9l3-5h12l3 5"/><path d="M3 9h18"/>',
  paperPlane: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
};

function ICON(name, cls){
  const body = ICONS[name] || '';
  return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
