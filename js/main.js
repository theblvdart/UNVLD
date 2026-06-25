/* ── CONTENT ──────────────────────────────────────────── */
let CONTENT = null;

async function loadContent() {
  if (CONTENT) return CONTENT;
  const res = await fetch('/content/content.json');
  CONTENT = await res.json();
  return CONTENT;
}

/* ── UTILS ────────────────────────────────────────────── */
function fmtDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── COLLABORATION HELPERS ────────────────────────────── */
function workBelongsToArtist(w, artistName) {
  if (w.artist === artistName) return true;
  if (w.collaborators && w.collaborators.includes(artistName)) return true;
  return false;
}

function displayArtist(w) {
  if (!w.collaborators || !w.collaborators.length) return w.artist;
  return [w.artist, ...w.collaborators].join(' & ');
}


function openModal(html) {
  const backdrop = document.getElementById('modal-backdrop');
  const inner = document.getElementById('modal-inner');
  if (!backdrop || !inner) return;
  inner.innerHTML = html;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  inner.querySelector('.modal__close').addEventListener('click', closeModal);
  backdrop.onclick = e => { if (e.target === backdrop) closeModal(); };
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeArtistPanel(); } });

function workModalHTML(w) {
  const specs = [
    ['Year', w.year], ['Medium', w.medium], ['Dimensions', w.dimensions],
    ['Edition', w.edition], ['Category', w.category], ['Provenance', w.provenance]
  ].filter(([, v]) => v);

  const priceHTML = w.price
    ? `<p class="work-modal__price">${w.price}</p>`
    : `<p class="work-modal__price work-modal__price--poa">Price on application</p>`;
  return `<div class="modal">
    <button class="modal__close" aria-label="Close">&#x2715;</button>
    <div class="work-modal__inner">
      <div class="work-modal__image">
        ${w.image ? `<img src="${w.image}" alt="${w.title}" loading="lazy">` : '<div class="work-modal__image-placeholder"></div>'}
      </div>
      <div class="work-modal__info">
        <p class="work-modal__artist">${displayArtist(w)}</p>
        <h2 class="work-modal__title">${w.title}</h2>
        <dl class="work-modal__specs">
          ${specs.map(([k,v]) => `<div><dt class="spec__key">${k}</dt><dd class="spec__val">${v}</dd></div>`).join('')}
        </dl>
        ${w.description ? `<p class="work-modal__desc">${w.description}</p>` : ''}
        ${priceHTML}
        <a href="/contact.html?work=${encodeURIComponent(w.title)}" class="btn btn-primary">Enquire about this work</a>
      </div>
    </div>
  </div>`;
}

function journalModalHTML(p) {
  return `<div class="modal">
    <button class="modal__close" aria-label="Close">&#x2715;</button>
    <div class="journal-modal__image">
      ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : '<div class="journal-modal__image-placeholder"></div>'}
    </div>
    <div class="journal-modal__body">
      <p class="journal-modal__cat">${p.category || ''}</p>
      <h2 class="journal-modal__title">${p.title}</h2>
      <div class="journal-modal__meta">
        ${p.author ? `<span>${p.author}</span>` : ''}<span>${fmtDate(p.date)}</span>
      </div>
      <div class="journal-modal__content">${p.body || p.excerpt || ''}</div>
    </div>
  </div>`;
}

/* ── ARTIST PANEL ─────────────────────────────────────── */
function openArtistPanel(a) {
  const panel = document.getElementById('artist-panel');
  const inner = document.getElementById('artist-panel-inner');
  const closeBtn = document.getElementById('artist-panel-close');
  if (!panel || !inner) return;

  const artistWorks = [];
  (_store.works || []).forEach((w, i) => {
    if (workBelongsToArtist(w, a.name)) artistWorks.push({ w, i });
  });

  const worksSection = artistWorks.length
    ? `<div class="artist-panel__works-grid">
        ${artistWorks.map(({ w, i }) => workCard(w, i)).join('')}
       </div>`
    : `<p class="artist-panel__empty">No works currently in stock</p>`;

  inner.innerHTML = `
    <div class="artist-panel__hero">
      <div class="artist-panel__image">
        ${a.image
          ? `<img src="${a.image}" alt="${a.name}" loading="lazy">`
          : '<div class="artist-panel__image-placeholder"></div>'}
      </div>
      <div class="artist-panel__info">
        <p class="artist-panel__discipline">${a.discipline || ''}</p>
        <h2 class="artist-panel__name">${a.name}</h2>
        ${a.bio ? `<p class="artist-panel__bio">${a.bio}</p>` : ''}
      </div>
    </div>
    <div class="artist-panel__works">
      <p class="artist-panel__works-heading">Works in stock</p>
      ${worksSection}
    </div>`;

  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
  panel.scrollTop = 0;
  closeBtn.onclick = closeArtistPanel;
  initReveals();
}

function closeArtistPanel() {
  const panel = document.getElementById('artist-panel');
  if (!panel) return;
  panel.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── DATA STORE ───────────────────────────────────────── */
const _store = { works: [], artists: [], journal: [] };

/* ── CARD BUILDERS ────────────────────────────────────── */
function workCard(w, i) {
  _store.works[i] = w;
  return `<div class="work-card reveal" data-type="work" data-index="${i}">
    <div class="work-card__image">
      ${w.image ? `<img src="${w.image}" alt="${w.title}" loading="lazy">` : `<div class="work-card__placeholder"><span>${w.title}</span></div>`}
    </div>
    <div class="work-card__meta">
      <p class="work-card__artist">${displayArtist(w)}</p>
      <p class="work-card__title">${w.title}</p>
      <div class="work-card__foot">
        <span class="work-card__year">${w.year || ''}</span>
        <span class="work-card__cat">${w.category || ''}</span>
      </div>
    </div>
    <div class="work-card__overlay"><span>View Work</span></div>
  </div>`;
}

function artistCard(a, i) {
  _store.artists[i] = a;
  return `<div class="artist-card" data-type="artist" data-index="${i}">
    <div class="artist-card__image">
      ${a.image ? `<img src="${a.image}" alt="${a.name}" loading="lazy">` : `<div class="artist-card__placeholder"><span>${a.name}</span></div>`}
    </div>
    <div class="artist-card__meta">
      <p class="artist-card__name">${a.name}</p>
      <p class="artist-card__discipline">${a.discipline || ''}</p>
    </div>
  </div>`;
}

function journalCard(p, i) {
  _store.journal[i] = p;
  return `<div class="journal-card reveal" data-type="journal" data-index="${i}">
    <div class="journal-card__image">
      ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div class="journal-card__placeholder"><span>${p.title}</span></div>`}
    </div>
    <div class="journal-card__body">
      <p class="journal-card__cat">${p.category || ''}</p>
      <p class="journal-card__title">${p.title}</p>
      <p class="journal-card__date">${fmtDate(p.date)}</p>
    </div>
  </div>`;
}

/* ── DELEGATED CLICK HANDLER ──────────────────────────── */
document.addEventListener('click', function(e) {
  const card = e.target.closest('[data-type]');
  if (!card) return;
  const type = card.dataset.type;
  const i = parseInt(card.dataset.index, 10);
  if (type === 'work')    openModal(workModalHTML(_store.works[i]));
  if (type === 'artist')  openArtistPanel(_store.artists[i]);
  if (type === 'journal') openModal(journalModalHTML(_store.journal[i]));
});

/* ── REVEAL ───────────────────────────────────────────── */
function initReveals() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }});
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveals);
