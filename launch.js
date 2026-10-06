/* Launch essentials; approved site interactions stay in script.js. */
(() => {
  'use strict';
  const key = 'esbd_preferences_v1';
  const lifetime = 180 * 86400000;
  let choice = null;
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && typeof saved.maps === 'boolean' && Date.now() - saved.time < lifetime) choice = saved; } catch (_) {}
  if (navigator.globalPrivacyControl) choice = { maps: false, time: Date.now() };
  const panel = document.createElement('dialog');
  panel.className = 'cookie-panel';
  panel.setAttribute('aria-labelledby', 'cookieTitle');
  panel.innerHTML = '<h2 id="cookieTitle">Your privacy choices</h2><p>Optional Google Maps stays off unless you allow it. The enquiry form works without maps. This site has no analytics or advertising tags.</p><p><a href="cookies.html">Read about cookies and external services</a></p><label class="cookie-option"><input id="allowMaps" type="checkbox"> Allow Google Maps</label><p id="privacySignal" hidden>Your browser’s privacy signal keeps optional maps off.</p><div class="cookie-actions"><button type="button" data-choice="accept">Accept optional maps</button><button type="button" data-choice="reject">Reject optional maps</button><button type="button" data-choice="save">Save choices</button><button type="button" data-choice="close">Close</button></div>';
  document.body.append(panel);
  const check = panel.querySelector('input');
  if (navigator.globalPrivacyControl) { check.disabled = true; panel.querySelector('[data-choice="accept"]').disabled = true; panel.querySelector('#privacySignal').hidden = false; }
  const banner = document.createElement('aside');
  banner.className = 'cookie-banner'; banner.setAttribute('aria-label', 'Optional map preferences');
  banner.innerHTML = '<p>Allow optional Google Maps? Maps stay off until you choose. <a href="cookies.html">Cookie information</a></p><div class="cookie-actions"><button type="button" data-choice="accept">Accept</button><button type="button" data-choice="reject">Reject</button><button type="button" data-cookie-settings>Manage</button></div>';
  document.body.append(banner);
  let returnFocus = null;
  function apply() {
    banner.hidden = Boolean(choice);
    document.querySelectorAll('iframe[data-map-src]').forEach(frame => {
      const allowed = Boolean(choice?.maps) && !navigator.globalPrivacyControl;
      frame.hidden = !allowed;
      if (allowed && !frame.hasAttribute('src')) frame.src = frame.dataset.mapSrc;
      if (!allowed) frame.removeAttribute('src');
      const wrap = frame.closest('.map-consent');
      if (wrap) wrap.querySelector('p').hidden = allowed;
    });
  }
  function save(allow) {
    choice = { maps: Boolean(allow) && !navigator.globalPrivacyControl, time: Date.now() };
    try { localStorage.setItem(key, JSON.stringify(choice)); } catch (_) {}
    apply(); if (panel.open) panel.close();
  }
  document.addEventListener('click', event => {
    if (event.target.closest('[data-cookie-settings]')) {
      returnFocus = event.target.closest('button'); check.checked = Boolean(choice?.maps); panel.showModal();
    }
    const action = event.target.closest('[data-choice]')?.dataset.choice;
    if (action === 'accept') save(true);
    if (action === 'reject') save(false);
    if (action === 'save') save(check.checked);
    if (action === 'close') panel.close();
  });
  panel.addEventListener('close', () => returnFocus?.focus()); apply();

  const form = document.querySelector('#contactForm');
  if (form) {
    const submit = form.querySelector('[type="submit"]'), status = document.querySelector('#formStatus');
    submit.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (!form.reportValidity() || submit.disabled) return;
      submit.disabled = true; form.setAttribute('aria-busy', 'true'); status.textContent = 'Sending your enquiry…';
      const abort = new AbortController(), timeout = setTimeout(() => abort.abort(), 20000);
      try {
        const session = await fetch('api/contact.php', { credentials: 'same-origin', cache: 'no-store', signal: abort.signal });
        const auth = await session.json(); if (!session.ok || !auth.token) throw new Error(auth.message || 'The form is temporarily unavailable. Please email info@esbd.co.za.');
        const data = Object.fromEntries(new FormData(form)); data.token = auth.token;
        const response = await fetch('api/contact.php', { method: 'POST', credentials: 'same-origin', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data), signal: abort.signal });
        const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.message || 'Your enquiry could not be sent. Please try again.');
        status.textContent = result.message; form.reset();
      } catch (error) {
        status.textContent = error.name === 'AbortError' ? 'We could not confirm submission in time. Your details are still here. Please contact info@esbd.co.za before resending.' : (error instanceof SyntaxError || error instanceof TypeError ? 'We could not confirm submission. Your details are still here. Please contact info@esbd.co.za before resending.' : error.message);
      } finally { clearTimeout(timeout); submit.disabled = false; form.removeAttribute('aria-busy'); }
    });
  }
  // Pause controls for decorative motion, including reduced-motion visitors.
  const videos = [...document.querySelectorAll('video')];
  if (videos.length) {
    const button = document.createElement('button'); button.className = 'motion-toggle'; button.type = 'button';
    let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function update() { button.textContent = paused ? 'Play background motion' : 'Pause background motion'; videos.forEach(v => { if (paused) { v.autoplay = false; v.pause(); } else v.play().catch(() => {}); }); }
    videos.forEach(v => v.addEventListener('play', () => { if (paused) v.pause(); }));
    button.addEventListener('click', () => { paused = !paused; update(); }); document.body.append(button); update();
  }
  document.querySelectorAll('img').forEach(img => { if (img.getBoundingClientRect().top > innerHeight * 1.5) img.loading = 'lazy'; });
  const menu = document.querySelector('#menuButton'), drawer = document.querySelector('#mobileDrawer');
  if (menu && drawer) {
    const sync = () => { drawer.inert = menu.getAttribute('aria-expanded') !== 'true'; };
    new MutationObserver(sync).observe(menu, {attributes:true,attributeFilter:['aria-expanded']});sync();
    document.addEventListener('keydown', event => {
      if (menu.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') menu.focus();
      if (event.key !== 'Tab') return;
      const focusable=[menu,...drawer.querySelectorAll('a,summary,button')].filter(e=>e.getClientRects().length);
      const first=focusable[0],last=focusable[focusable.length-1];
      if (event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    },true);
  }
})();
