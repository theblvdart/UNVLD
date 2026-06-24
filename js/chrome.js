/* nav + footer + modal backdrop injected into every page */
document.addEventListener('DOMContentLoaded', () => {

  // ── NAV
  const navEl = document.querySelector('body');
  const navHTML = `
<nav class="nav" role="navigation">
  <div class="wrap">
    <div class="nav__inner">
      <a href="/index.html" class="nav__logo">UNVLD<em>.</em></a>
      <ul class="nav__links">
        <li><a href="/works.html" class="nav__link">Works</a></li>
        <li><a href="/artists.html" class="nav__link">Artists</a></li>
        <li><a href="/journal.html" class="nav__link">Journal</a></li>
        <li><a href="/about.html" class="nav__link">About</a></li>
      </ul>
      <a href="/contact.html" class="nav__cta">Enquire</a>
      <button class="nav__burger" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<div class="mobile-nav">
  <button class="mobile-nav__close" aria-label="Close">&#x2715;</button>
  <nav class="mobile-nav__links">
    <a href="/works.html" class="mobile-nav__link">Works</a>
    <a href="/artists.html" class="mobile-nav__link">Artists</a>
    <a href="/journal.html" class="mobile-nav__link">Journal</a>
    <a href="/about.html" class="mobile-nav__link">About</a>
    <a href="/contact.html" class="mobile-nav__link">Enquire</a>
  </nav>
</div>`;

  const footerHTML = `
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <a href="/index.html" class="footer__logo">UNVLD<em>.</em></a>
        <p class="footer__tagline">Where art is UNVLD.</p>
      </div>
      <div>
        <p class="footer__col-head">Navigate</p>
        <ul class="footer__links">
          <li><a href="/works.html" class="footer__link">Works</a></li>
          <li><a href="/artists.html" class="footer__link">Artists</a></li>
          <li><a href="/journal.html" class="footer__link">Journal</a></li>
          <li><a href="/about.html" class="footer__link">About</a></li>
        </ul>
      </div>
      <div>
        <p class="footer__col-head">Collect</p>
        <ul class="footer__links">
          <li><a href="/contact.html" class="footer__link">Enquire</a></li>
          <li><a href="/contact.html" class="footer__link">Sourcing</a></li>
          <li><a href="/contact.html" class="footer__link">Advisory</a></li>
        </ul>
      </div>
      <div>
        <p class="footer__col-head">Connect</p>
        <ul class="footer__links">
          <li><a href="https://instagram.com" class="footer__link" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="mailto:hello@unvld.com" class="footer__link">hello@unvld.com</a></li>
          <li><span class="footer__link">London &amp; Dubai</span></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__copy">&copy; 2025 UNVLD. All rights reserved.</p>
      <a href="https://theblvd.com" class="footer__blvd" target="_blank" rel="noopener">Part of THE BLVD</a>
    </div>
  </div>
</footer>`;

  const modalHTML = `
<div id="modal-backdrop" class="modal-backdrop" role="dialog" aria-modal="true">
  <div id="modal-inner"></div>
</div>`;

  // Insert nav before first child of body
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  // Insert footer and modal before closing body
  document.body.insertAdjacentHTML('beforeend', footerHTML + modalHTML);
});
