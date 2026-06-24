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

function img(src, alt, cls) {
  if (src) return `<img src="${src}" alt="${alt || ''}" class="${cls || ''}" loading="lazy">`;
  return `<div class="${cls}-placeholder"><span>${alt || 'Image'}</span></div>`;
}

/* ── NAV ──────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  // Mark active link
  const path = window.location.pathname.replace(/\/$/, '') || '/index';
  nav.querySelectorAll('.nav__link').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/index';
    if (path === href || (href !== '/index' && path.startsWith(href))) {
      a.classList.add('active');
    }
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
    w.year       && ['Year', w.year],
    w.medium     && ['Medium', w.medium],
    w.dimensions && ['Dimensions', w.dimensions],
    w.edition    && ['Edition', w.edition],
    w.category   && ['Category', w.category],
    w.provenance && ['Provenance', w.provenance],
  ].filter(Boolean);

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
          <p class="work-modal__artist">${w.artist}</p>
          <h2 class="work-modal__title">${w.title}</h2>
          <dl class="work-modal__specs">
            ${specs.map(([k,v]) => `<div><dt class="spec__key">${k}</dt><dd class="spec__val">${v}</dd></div>`).join('')}
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
          <p class="artist-modal__discipline">${a.discipline}</p>
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
        <p class="journal-modal__cat">${p.category}</p>
        <h2 class="journal-modal__title">${p.title}</h2>
        <div class="journal-modal__meta">
          ${p.author ? `<span>${p.author}</span>` : ''}
          <span>${fmtDate(p.date)}</span>
        </div>
        <div class="journal-modal__content">${p.body || p.excerpt || ''}</div>
      </div>
    </div>`;
}

/* ── REVEAL ON SCROLL ─────────────────────────────────── */
function initReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveals);
