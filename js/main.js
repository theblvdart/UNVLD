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

/* ── NAV ──────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  const path = window.location.pathname;
  nav.querySelectorAll('.nav__link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

/* ── MOBILE NAV ───────────────────────────────────────── */
const burger = document.querySelector('.nav__burger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav__close');
if (burger && mobileNav) {
  burger.addEventListener('click', () => mobileNav.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

/* ── MODAL ────────────────────────────────────────────── */
const backdrop = document.getElementById('modal-backdrop');
const modalInner = document.getElementById('modal-inner');

function openModal(html) {
  if (!backdrop || !modalInner) return;
  modalInner.innerHTML = html;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalInner.querySelector('.modal__close')?.addEventListener('click', closeModal);
}

function closeModal() {
  backdrop?.classList.remove('open');
  document.body.style.overflow = '';
}

if (backdrop) {
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── WORK MODAL ───────────────────────────────────────── */
function workModalHTML(w) {
  const specs = [
    ['Year', w.year],
    ['Medium', w.medium],
    ['Dimensions', w.dimensions],
    ['Edition', w.edition],
    ['Category', w.category],
    ['Provenance', w.provenance],
  ].filter(([, v]) => v);

  return `
    <div class="modal">
      <button class="modal__close" aria-label="Close">&#x2715;</button>
      <div class="work-modal__inner">
        <div class="work-modal__image">
          ${w.image
            ? `<img src="${w.image}" alt="${w.title}" loading="lazy">`
            : `<div class="work-modal__image-placeholder"></div>`}
        </div>
        <div class="work-modal__info">
          <p class="work-modal__artist">${w.artist || ''}</p>
          <h2 class="work-modal__title">${w.title}</h2>
          <dl class="work-modal__specs">
            ${specs.map(([k, v]) => `<div><dt class="spec__key">${k}</dt><dd class="spec__val">${v}</dd></div>`).join('')}
          </dl>
          ${w.description ? `<p class="work-modal__desc">${w.description}</p>` : ''}
          <a href="/contact.html?work=${encodeURIComponent(w.title)}" class="btn btn-primary">Enquire about this work</a>
        </div>
      </div>
    </div>`;
}

/* ── ARTIST MODAL ─────────────────────────────────────── */
function artistModalHTML(a) {
  return `
    <div class="modal">
      <button class="modal__close" aria-label="Close">&#x2715;</button>
      <div class="artist-modal__inner">
        <div class="artist-modal__image">
          ${a.image
            ? `<img src="${a.image}" alt="${a.name}" loading="lazy">`
            : `<div class="artist-modal__image-placeholder"></div>`}
        </div>
        <div class="artist-modal__info">
          <p class="artist-modal__discipline">${a.discipline || ''}</p>
          <h2 class="artist-modal__name">${a.name}</h2>
          ${a.bio ? `<p class="artist-modal__bio">${a.bio}</p>` : ''}
        </div>
      </div>
    </div>`;
}

/* ── JOURNAL MODAL ────────────────────────────────────── */
function journalModalHTML(p) {
  return `
    <div class="modal">
      <button class="modal__close" aria-label="Close">&#x2715;</button>
      <div class="journal-modal__image">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
          : `<div class="journal-modal__image-placeholder"></div>`}
      </div>
      <div class="journal-modal__body">
        <p class="journal-modal__cat">${p.category || ''}</p>
        <h2 class="journal-modal__title">${p.title}</h2>
        <div class="journal-modal__meta">
          ${p.author ? `<span>${p.author}</span>` : ''}
          <span>${fmtDate(p.date)}</span>
        </div>
        <div class="journal-modal__content">${p.body || p.excerpt || ''}</div>
      </div>
    </div>`;
}

/* ── CARD BUILDER ─────────────────────────────────────── */
// Store data objects by index so onclick doesn't rely on inline JSON
const _store = { works: [], artists: [], journal: [] };

function workCard(w, i) {
  _store.works[i] = w;
  return `
    <div class="work-card reveal" data-type="work" data-index="${i}">
      <div class="work-card__image">
        ${w.image
          ? `<img src="${w.image}" alt="${w.title}" loading="lazy">`
          : `<div class="work-card__placeholder"><span>${w.title}</span></div>`}
      </div>
      <div class="work-card__meta">
        <p class="work-card__artist">${w.artist || ''}</p>
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
  return `
    <div class="artist-card reveal" data-type="artist" data-index="${i}">
      <div class="artist-card__image">
        ${a.image
          ? `<img src="${a.image}" alt="${a.name}" loading="lazy">`
          : `<div class="artist-card__placeholder"><span>${a.name}</span></div>`}
      </div>
      <div class="artist-card__meta">
        <p class="artist-card__name">${a.name}</p>
        <p class="artist-card__discipline">${a.discipline || ''}</p>
      </div>
    </div>`;
}

function journalCard(p, i) {
  _store.journal[i] = p;
  return `
    <div class="journal-card reveal" data-type="journal" data-index="${i}">
      <div class="journal-card__image">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
          : `<div class="journal-card__placeholder"><span>${p.title}</span></div>`}
      </div>
      <div class="journal-card__body">
        <p class="journal-card__cat">${p.category || ''}</p>
        <p class="journal-card__title">${p.title}</p>
        <p class="journal-card__date">${fmtDate(p.date)}</p>
      </div>
    </div>`;
}

/* ── DELEGATED CLICK HANDLER ──────────────────────────── */
document.addEventListener('click', e => {
  const card = e.target.closest('[data-type]');
  if (!card) return;
  const type = card.dataset.type;
  const i = parseInt(card.dataset.index, 10);
  if (type === 'work')    openModal(workModalHTML(_store.works[i]));
  if (type === 'artist')  openModal(artistModalHTML(_store.artists[i]));
  if (type === 'journal') openModal(journalModalHTML(_store.journal[i]));
});

/* ── REVEAL ON SCROLL ─────────────────────────────────── */
function initReveals() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveals);
