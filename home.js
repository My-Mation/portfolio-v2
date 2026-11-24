/* =====================================================================
   DEB / FIELD ARCHIVE — homepage interactions
   Junction preview, live Kolkata clock. Shared chrome lives in script.js.
   ===================================================================== */

const preview = document.getElementById('jPreview');
const rows = [...document.querySelectorAll('.j-row')];

if (preview && rows.length) {
  const fields = {
    code: document.getElementById('jpCode'),
    num: document.getElementById('jpNum'),
    title: document.getElementById('jpTitle'),
    desc: document.getElementById('jpDesc'),
    meta: document.getElementById('jpMeta')
  };

  let current = rows[0];

  const activate = row => {
    if (!row || row === current) return;
    current = row;

    rows.forEach(r => {
      const on = r === row;
      r.classList.toggle('is-active', on);
      if (on) r.setAttribute('aria-current', 'true');
      else r.removeAttribute('aria-current');
    });

    const d = row.dataset;
    preview.style.setProperty('--accent', '#c93a1e');
    preview.style.setProperty('--accent-ink', '#f1ede3');
    preview.dataset.href = row.getAttribute('href');
    preview.setAttribute('aria-label', `Open ${row.querySelector('strong')?.textContent || 'sector'}`);

    if (fields.code) fields.code.textContent = d.code || '';
    if (fields.num) fields.num.textContent = d.index || '';
    if (fields.title) fields.title.textContent = d.title || '';
    if (fields.desc) fields.desc.textContent = d.desc || '';
    if (fields.meta) fields.meta.textContent = d.meta || '';

    preview.classList.remove('jp-changing');
    void preview.offsetWidth;
    preview.classList.add('jp-changing');
  };

  rows.forEach(row => {
    row.addEventListener('pointerenter', () => activate(row));
    row.addEventListener('focus', () => activate(row));
  });

  const go = () => {
    const href = current?.getAttribute('href');
    if (href) window.location.href = href;
  };
  preview.addEventListener('click', go);
  preview.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  });
}

/* ---------- page bar appears once the cover is cleared ---------- */
const setChrome = () => {
  document.body.classList.toggle('is-scrolled', scrollY > innerHeight * 0.82);
};
addEventListener('scroll', setChrome, {passive:true});
addEventListener('resize', setChrome);
setChrome();

/* ---------- live clock: Asia/Kolkata ---------- */
const clocks = [...document.querySelectorAll('.js-clock')];
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });
  const tick = () => {
    const t = fmt.format(new Date());
    clocks.forEach(el => {
      el.textContent = el.dataset.clock === 'full' ? `KOLKATA ${t}` : t;
    });
  };
  tick();
  setInterval(tick, 1000);
}
