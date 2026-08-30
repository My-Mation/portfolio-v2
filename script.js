/* =====================================================================
   CONTENT MODEL & SOCIAL LINKS
   ===================================================================== */
const CONTACT = {
  email: "", // deliberately empty
  github: "https://github.com/My-Mation",
  linkedin: "https://www.linkedin.com/in/debargha-sarkar-72575937/",
  instagram: "https://www.instagram.com/local_first_lab/"
};

const HL_NODES = {
  termux:{t:"TERMUX",m:"LAYER 01 / THE DOOR",d:"The Android terminal environment. No root, no custom ROM — just Linux userland running on a phone."},
  ubuntu:{t:"UBUNTU",m:"LAYER 02 / PROOT USERLAND",d:"A full Linux distribution inside Termux via proot. Package management, toolchains, and real services in an unprivileged container."},
  navidrome:{t:"NAVIDROME",m:"SERVICE / MUSIC",d:"Self-hosted music server. Streams personal audio collection over LAN or remote tunnels to any client device."},
  jellyfin:{t:"JELLYFIN",m:"SERVICE / VIDEO",d:"Self-hosted video streaming server running directly on phone storage, serving movies and video content."},
  books:{t:"BOOKS",m:"SERVICE / DIGITAL LIBRARY",d:"A personal EPUB and PDF server accessible across devices on the hotspot LAN or VPN."},
  llm:{t:"LOCAL LLM",m:"SERVICE / LOCAL INFERENCE",d:"Local language model running on 32-bit Android hardware using quantized weights without cloud APIs. (https://github.com/My-Mation/termux_llm)"},
  network:{t:"NETWORK SCANNER",m:"SERVICE / WIRELESS MONITOR",d:"Wireless network monitoring and RF telemetry dashboard running on Android. (https://github.com/My-Mation/network-scanner)"},
  storage:{t:"STORAGE & REMOTE",m:"LAYER 00 / STORAGE TIER",d:"Internal flash storage paired with Cloudflare Tunnels, VPN routing, and rclone remote storage integration."}
};

/* ============ BOOT ============ */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
if (FINE && !REDUCED) document.documentElement.classList.add('fine');

/* ============ CURSOR + RISO TRAIL ============ */
const cursor = $('#cursor'), tag = $('#cursorTag'), trail = $('#trail');
let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
const dots = []; let ltx = -99, lty = -99;
if (FINE && !REDUCED) {
  const tctx = trail.getContext('2d');
  const fit = () => { trail.width = innerWidth; trail.height = innerHeight; };
  fit(); addEventListener('resize', fit);
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    const dx = mx - ltx, dy = my - lty;
    if (dx*dx + dy*dy > 240) {
      ltx = mx; lty = my;
      dots.push({x:mx, y:my, r:1.2 + Math.random()*2, a:.4 + Math.random()*.15});
      if (dots.length > 130) dots.shift();
    }
  });
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a,button,input,summary,[role="button"],.specimen,.hn,#quad3dContainer');
    if (t) {
      cursor.classList.add('hot');
      tag.textContent = t.dataset.cursor || (t.id === 'quad3dContainer' ? 'ROTATE 3D' : 'OPEN');
      tag.classList.add('show');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button,input,summary,[role="button"],.specimen,.hn,#quad3dContainer')) {
      cursor.classList.remove('hot'); tag.classList.remove('show');
    }
  });
  (function cloop(){
    cx += (mx - cx) * .42; cy += (my - cy) * .42;
    cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    tag.style.left = cx + 'px'; tag.style.top = cy + 'px';
    tctx.clearRect(0, 0, trail.width, trail.height);
    for (let i = dots.length - 1; i >= 0; i--) {
      const d = dots[i]; d.a *= .962;
      if (d.a < .02) { dots.splice(i, 1); continue; }
      tctx.globalAlpha = d.a * .55; tctx.fillStyle = '#bf3016';
      tctx.beginPath(); tctx.arc(d.x, d.y, d.r, 0, 7); tctx.fill();
      tctx.globalAlpha = d.a * .3; tctx.fillStyle = '#171512';
      tctx.beginPath(); tctx.arc(d.x + 1.1, d.y - .8, d.r * .8, 0, 7); tctx.fill();
    }
    tctx.globalAlpha = 1;
    requestAnimationFrame(cloop);
  })();
}

/* ============ REVEAL + PAGE BAR ============ */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), {rootMargin:'0px 0px -10% 0px', threshold:.05});
$$('.rv-scope').forEach(s => io.observe(s));

const pgL = $('#pgL');
const po = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) pgL.textContent = `${e.target.dataset.page} — ${e.target.dataset.name}`;
}), {rootMargin:'-45% 0px -45% 0px'});
$$('[data-page]').forEach(s => po.observe(s));

/* ============ TOC ============ */
const toc = $('#toc'), tocBtn = $('#tocBtn'), tocClose = $('#tocClose');
const setToc = open => {
  toc.classList.toggle('open', open);
  tocBtn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) tocClose.focus(); else tocBtn.focus();
};
if (tocBtn) tocBtn.addEventListener('click', () => setToc(true));
if (tocClose) tocClose.addEventListener('click', () => setToc(false));
if (toc) toc.addEventListener('click', e => { if (e.target.closest('a')) setToc(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && toc && toc.classList.contains('open')) setToc(false); });

/* ============ SPREAD PARALLAX ============ */
const spreads = $$('.spread').map((s, i) => ({inner: s.querySelector('.spread-inner'), dir: i % 2 ? 1 : -1, el: s}));
if (!REDUCED) {
  let ticking = false;
  const shift = () => {
    ticking = false;
    const vh = innerHeight;
    for (const s of spreads) {
      if (!s.inner) continue;
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) continue;
      const p = Math.max(-1, Math.min(1, (r.top + r.height/2 - vh/2) / vh));
      s.inner.style.transform = `translateX(${(p * s.dir * 30).toFixed(1)}px)`;
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(shift); } }, {passive:true});
  shift();
}

/* ============ PINNED HORIZONTAL SCROLL ANIMATION ============ */
const hWrapper = $('.h-scroll-wrapper');
const hTrack = $('.h-scroll-track');
if (hWrapper && hTrack && !REDUCED) {
  let hTicking = false;
  const updateHScroll = () => {
    hTicking = false;
    const rect = hWrapper.getBoundingClientRect();
    const totalDist = hWrapper.offsetHeight - innerHeight;
    if (rect.top <= 0 && rect.bottom >= innerHeight) {
      const p = Math.abs(rect.top) / totalDist;
      const maxTranslate = hTrack.scrollWidth - innerWidth + 140;
      hTrack.style.transform = `translateX(${-p * Math.max(0, maxTranslate)}px)`;
    }
  };
  addEventListener('scroll', () => { if (!hTicking) { hTicking = true; requestAnimationFrame(updateHScroll); } }, {passive:true});
  updateHScroll();
}

/* ============ HERO TYPESET ============ */
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('loaded')));

/* ============ LOOP HELPER ============ */
function loopWhen(el, fn){
  let on = false;
  new IntersectionObserver(es => { on = es[0].isIntersecting; }, {threshold:0}).observe(el);
  (function f(){ requestAnimationFrame(f); if (on && !document.hidden && !REDUCED) fn(); })();
}
function fitCanvas(c, ratio){
  const r = c.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  c.width = Math.round(r.width * dpr); c.height = Math.round(r.width * dpr * ratio);
  const s = c.width / c.getAttribute('width');
  c.style.height = (r.width * ratio) + 'px';
  c.getContext('2d').setTransform(s, 0, 0, s, 0, 0);
}
addEventListener('resize', () => ['repCv','visoCv','foxCv'].forEach(id => { const c = $('#'+id); if (c) fit(c); }));
function fit(c){
  if (c.id === 'repCv') fitCanvas(c, 440/640);
  if (c.id === 'visoCv') fitCanvas(c, 420/640);
  if (c.id === 'foxCv') fitCanvas(c, 320/480);
}

/* ============ 01 OSAMU DEMO & ADAPTIVE QUESTION SIMULATOR ============ */
const pushBtn = $('#pushBtn'), oLog = $('#osamuLog');
let oBusy = false;
if (pushBtn && oLog) {
  const steps = [
    { s: "ENCRYPTING & BROADCASTING...", q: '"WHAT IS THE TIME COMPLEXITY OF HEAPSORT?"', i: "ESP32 KEYPAD PRESSED: [O(N LOG N)]", a: "RESPONSE TIME: 1.2s (FAST) — ACCURATE" },
    { s: "EVALUATING BEHAVIOR...", q: '"EXPLAIN DYNAMIC MEMORY IN EMBEDDED C++"', i: "ESP32 KEYPAD PRESSED: HESITATION DETECTED (5.4s)", a: "TRIGGERING ADAPTIVE DEEP-DIVE PROBE..." },
    { s: "ADAPTIVE PROBE LIVE ⚡", q: '"WHY DOES HEAP ALLOCATION CAUSE FRAGMENTATION IN ESP32?"', i: "ESP32 KEYPAD PRESSED: [CORRECT PROBE ANSWER]", a: "ZERO-BIAS EVALUATION: 96.8% CONCEPT MASTERY" }
  ];
  let stepIdx = 0;

  pushBtn.addEventListener('click', () => {
    if (oBusy) return;
    oBusy = true;
    const cur = steps[stepIdx % steps.length];
    stepIdx++;

    oLog.children[0].querySelector('.v').textContent = cur.s;
    oLog.children[1].querySelector('.v').textContent = cur.q;
    oLog.children[2].querySelector('.v').textContent = cur.i;
    oLog.children[3].querySelector('.v').textContent = cur.a;

    setTimeout(() => { oBusy = false; }, 600);
  });
}

/* ============ 02 QUADRUPED 3D ENGINE (COMPACT SIZE) ============ */
(function initQuad3D() {
  const container = $('#quad3dContainer');
  const canvas = $('#quad3dCv');
  const loaderEl = $('#quad3dLoader');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x181614);
  scene.fog = new THREE.FogExp2(0x181614, 0.004);

  // CAMERA SETTINGS FOR COMPACT 380PX VIEWPORT
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 38, 190);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // LIGHTING
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  scene.add(ambientLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 3.8);
  topLight.position.set(0, 250, 150);
  scene.add(topLight);

  const redLight = new THREE.DirectionalLight(0xbf3016, 2.8);
  redLight.position.set(150, 150, 120);
  scene.add(redLight);

  const keyLight = new THREE.DirectionalLight(0xf1ede2, 3.0);
  keyLight.position.set(-150, 160, -100);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xe6c229, 2.4, 320);
  fillLight.position.set(0, -20, 120);
  scene.add(fillLight);

  // Technical Floor Grid
  const gridHelper = new THREE.GridHelper(360, 24, 0xbf3016, 0x44403a);
  gridHelper.position.y = -45;
  scene.add(gridHelper);

  let dogMesh = null;
  let targetRotY = 0;
  let targetRotX = 0;
  let scrollProgress = 0;

  // Load dog02_web.stl
  if (typeof THREE.STLLoader !== 'undefined') {
    const loader = new THREE.STLLoader();
    loader.load('model/dog02_web.stl', (geometry) => {
      geometry.center();
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0x888278,
        metalness: 0.5,
        roughness: 0.3
      });

      dogMesh = new THREE.Mesh(geometry, material);

      // Blueprint Wireframe Overlay
      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xbf3016, opacity: 0.6, transparent: true });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      dogMesh.add(wireframe);

      // COMPACT SCALE
      dogMesh.scale.set(0.32, 0.32, 0.32);
      dogMesh.position.set(0, 10, 0);
      dogMesh.rotation.x = -Math.PI / 2;
      scene.add(dogMesh);

      if (loaderEl) loaderEl.style.display = 'none';
    }, 
    undefined, 
    (err) => {
      console.warn('STL Loader warning:', err);
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888278, wireframe: true });
      const body = new THREE.Mesh(new THREE.BoxGeometry(50, 22, 30), bodyMat);
      group.add(body);
      dogMesh = group;
      dogMesh.position.set(0, 10, 0);
      scene.add(dogMesh);
      if (loaderEl) loaderEl.style.display = 'none';
    });
  }

  // Pointer hover interaction
  let mouseX = 0, mouseY = 0;
  container.addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    mouseX = ((e.clientX - r.left) / container.clientWidth - 0.5) * 2;
    mouseY = ((e.clientY - r.top) / container.clientHeight - 0.5) * 2;
  });

  // Cinematic scroll calculation
  const p02 = $('#p02');
  function onScrollCinematic() {
    if (!p02) return;
    const r = p02.getBoundingClientRect();
    const vh = innerHeight;
    if (r.top < vh && r.bottom > 0) {
      scrollProgress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    }
  }
  addEventListener('scroll', onScrollCinematic, { passive: true });

  // Optimized Render Loop
  loopWhen(container, () => {
    if (dogMesh) {
      targetRotY = (scrollProgress * Math.PI * 2.4) + (mouseX * 0.7);
      targetRotX = (mouseY * 0.35);

      dogMesh.rotation.z += (targetRotY - dogMesh.rotation.z) * 0.08;
      dogMesh.rotation.y += (targetRotX - dogMesh.rotation.y) * 0.08;
      dogMesh.position.y = 10 + Math.sin(Date.now() * 0.0035) * 3;
    }
    renderer.render(scene, camera);
  });

  addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();

/* ============ 03 HOMELAB MAP ============ */
$$('.hn').forEach(g => {
  const open = () => {
    const n = HL_NODES[g.dataset.k];
    if (n) {
      $('#hlTitle').textContent = n.t;
      $('#hlMeta').textContent = n.m;
      $('#hlDesc').textContent = n.d;
      $$('.hn').forEach(x => x.classList.toggle('on', x === g));
    }
  };
  g.addEventListener('click', open);
  g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});
if ($('.hn[data-k="navidrome"]')) {
  $('.hn[data-k="navidrome"]').classList.add('on');
  const n = HL_NODES.navidrome;
  if (n) { $('#hlTitle').textContent = n.t; $('#hlMeta').textContent = n.m; $('#hlDesc').textContent = n.d; }
}

/* ============ 05 REPBOT REAL-TIME POSE ENGINE ============ */
const pc = $('#repCv');
if (pc) {
  fit(pc);
  const pctx = pc.getContext('2d');
  let ex = 'push', pt = 0, reps = 14, lastCyc = 0;

  function getPose(exercise, b) {
    const j = {};
    if (exercise === 'push') {
      const bodyY = 325 - 65 * b;
      j.head = [150, bodyY - 10];
      j.sho = [210, bodyY];
      j.hip = [360, bodyY + 5];
      j.kne = [440, bodyY + 10];
      j.ank = [520, 335];
      j.wri = [210, 345];
      j.elb = [170 + 40 * b, (bodyY + 345) / 2 + 10 * (1 - b)];
    } else if (exercise === 'pull') {
      const barY = 70;
      const headY = 210 - 130 * b;
      const shoY = 250 - 130 * b;
      const hipY = 340 - 120 * b;
      j.head = [320, headY];
      j.sho = [320, shoY];
      j.hip = [320, hipY];
      j.kne = [320, hipY + 50];
      j.ank = [320, hipY + 95];
      j.wri = [270, barY];
      j.wriR = [370, barY];
      j.elb = [240 - 30 * b, (shoY + barY) / 2];
      j.elbR = [400 + 30 * b, (shoY + barY) / 2];
    } else if (exercise === 'squat') {
      const headY = 80 + 130 * (1 - b);
      const shoY = 120 + 130 * (1 - b);
      const hipY = 210 + 120 * (1 - b);
      const kneX = 320 + 55 * (1 - b);
      const kneY = 290 + 50 * (1 - b);
      j.head = [320, headY];
      j.sho = [320, shoY];
      j.hip = [300 - 20 * (1 - b), hipY];
      j.kne = [kneX, kneY];
      j.ank = [320, 370];
      j.wri = [410, shoY + 10];
      j.elb = [365, shoY + 5];
    } else if (exercise === 'curl') {
      j.head = [320, 80];
      j.sho = [320, 120];
      j.hip = [320, 220];
      j.kne = [320, 300];
      j.ank = [320, 375];
      j.elb = [335, 185];
      const angle = 0.2 + 2.3 * b;
      j.wri = [335 + Math.sin(angle) * 50, 185 + Math.cos(angle) * 50];
    }
    return j;
  }

  function drawPoseSkeleton() {
    pctx.clearRect(0, 0, 640, 440);
    const b = (Math.sin(pt) + 1) / 2;
    const j = getPose(ex, b);

    pctx.strokeStyle = 'rgba(241,237,226,.06)'; pctx.lineWidth = 1;
    for (let x = 40; x < 640; x += 60) { pctx.beginPath(); pctx.moveTo(x, 0); pctx.lineTo(x, 440); pctx.stroke(); }
    for (let y = 40; y < 440; y += 60) { pctx.beginPath(); pctx.moveTo(0, y); pctx.lineTo(640, y); pctx.stroke(); }

    pctx.strokeStyle = 'rgba(241,237,226,.25)'; pctx.lineWidth = 1.5;
    if (ex === 'pull') {
      pctx.beginPath(); pctx.moveTo(220, 70); pctx.lineTo(420, 70); pctx.stroke();
      pctx.fillStyle = '#bf3016'; pctx.fillRect(220, 66, 200, 8);
    } else {
      pctx.beginPath(); pctx.moveTo(40, 350); pctx.lineTo(600, 350); pctx.stroke();
    }

    let minX = 640, maxX = 0, minY = 440, maxY = 0;
    Object.values(j).forEach(([x, y]) => {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    });
    minX = Math.max(20, minX - 35); maxX = Math.min(620, maxX + 35);
    minY = Math.max(20, minY - 35); maxY = Math.min(420, maxY + 25);

    pctx.strokeStyle = 'rgba(191,48,22,.65)'; pctx.lineWidth = 1; pctx.setLineDash([6, 6]);
    pctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    pctx.setLineDash([]);

    pctx.fillStyle = '#bf3016'; pctx.fillRect(minX, minY - 18, 140, 18);
    pctx.font = '600 9px "IBM Plex Mono"'; pctx.fillStyle = '#f1ede2';
    pctx.fillText(`POSE TRACKED · 98.6%`, minX + 6, minY - 5);

    const bones = ex === 'pull' ? [
      ['wri','elb'],['elb','sho'],['wriR','elbR'],['elbR','sho'],
      ['sho','hip'],['hip','kne'],['kne','ank']
    ] : [
      ['head','sho'],['sho','elb'],['elb','wri'],['sho','hip'],['hip','kne'],['kne','ank']
    ];

    pctx.strokeStyle = 'rgba(191,48,22,.25)'; pctx.lineWidth = 14; pctx.lineCap = 'round';
    bones.forEach(([p1, p2]) => {
      if (j[p1] && j[p2]) { pctx.beginPath(); pctx.moveTo(j[p1][0], j[p1][1]); pctx.lineTo(j[p2][0], j[p2][1]); pctx.stroke(); }
    });

    pctx.strokeStyle = '#f1ede2'; pctx.lineWidth = 3;
    bones.forEach(([p1, p2]) => {
      if (j[p1] && j[p2]) { pctx.beginPath(); pctx.moveTo(j[p1][0], j[p1][1]); pctx.lineTo(j[p2][0], j[p2][1]); pctx.stroke(); }
    });

    if (j.head) {
      pctx.fillStyle = '#f1ede2'; pctx.beginPath(); pctx.arc(j.head[0], j.head[1], 12, 0, 7); pctx.fill();
      pctx.strokeStyle = '#bf3016'; pctx.lineWidth = 2; pctx.beginPath(); pctx.arc(j.head[0], j.head[1], 12, 0, 7); pctx.stroke();
    }

    Object.entries(j).forEach(([name, [x, y]]) => {
      if (name === 'head') return;
      pctx.fillStyle = '#bf3016'; pctx.beginPath(); pctx.arc(x, y, 5, 0, 7); pctx.fill();
      pctx.fillStyle = '#f1ede2'; pctx.beginPath(); pctx.arc(x, y, 2, 0, 7); pctx.fill();
    });

    if (j.elb && j.sho && j.wri) {
      const deg = Math.round(70 + 80 * b);
      pctx.fillStyle = 'rgba(23,21,18,.85)';
      pctx.fillRect(j.elb[0] + 12, j.elb[1] - 12, 44, 20);
      pctx.strokeStyle = '#bf3016'; pctx.lineWidth = 1;
      pctx.strokeRect(j.elb[0] + 12, j.elb[1] - 12, 44, 20);
      pctx.font = '600 10px "IBM Plex Mono"'; pctx.fillStyle = '#f1ede2';
      pctx.fillText(`${deg}°`, j.elb[0] + 18, j.elb[1] + 2);
    }

    pctx.font = '600 11px "IBM Plex Mono"'; pctx.fillStyle = 'rgba(241,237,226,.7)';
    pctx.fillText(`EXERCISE: ${ex.toUpperCase()}`, 24, 30);
    pctx.fillText(`AUTO-COUNTING: ACTIVE`, 460, 30);
  }

  loopWhen(pc, () => {
    pt += ex === 'push' ? .05 : ex === 'pull' ? .045 : ex === 'squat' ? .04 : .06;
    drawPoseSkeleton();
    const cyc = Math.floor(pt / Math.PI);
    if (cyc !== lastCyc) {
      lastCyc = cyc; reps++;
      const el = $('#repNum');
      if (el) el.textContent = String(reps).padStart(2, '0');
    }
  });
  if (REDUCED) drawPoseSkeleton();

  $$('[data-rep]').forEach(b => b.addEventListener('click', () => {
    $$('[data-rep]').forEach(x => x.setAttribute('aria-pressed', x === b));
    ex = b.dataset.rep; pt = 0; lastCyc = 0;
  }));
}

/* ============ 06 VISO PANEL ============ */
const vc = $('#visoCv');
if (vc) {
  fit(vc);
  const vctx = vc.getContext('2d');
  let vt = 0;
  const bars = Array.from({length: 22}, () => .3);
  setInterval(() => { for (let i = 0; i < 22; i++) bars[i] = Math.max(.05, Math.min(1, bars[i] + (Math.random() - .48) * .3)); }, 160);
  function drawViso(){
    vctx.clearRect(0, 0, 640, 420);
    vt += .06;
    vctx.font = '600 10px "IBM Plex Mono"';
    vctx.strokeStyle = 'rgba(241,237,226,.85)'; vctx.lineWidth = 1.6; vctx.beginPath();
    for (let x = 0; x <= 600; x += 4) {
      const y = 120 + Math.sin(x * .045 + vt * 3) * (7 + 5 * Math.sin(vt)) + Math.sin(x * .13 + vt * 7) * 3;
      x === 0 ? vctx.moveTo(20 + x, y) : vctx.lineTo(20 + x, y);
    }
    vctx.stroke();
    vctx.fillStyle = 'rgba(241,237,226,.5)'; vctx.fillText('VIBRATION — ACCELEROMETER TELEMETRY', 20, 34);
    const bw = 600 / 22;
    for (let i = 0; i < 22; i++) {
      vctx.fillStyle = i === 17 ? 'rgba(191,48,22,.9)' : 'rgba(241,237,226,.55)';
      vctx.fillRect(20 + i * bw + 2, 232 - bars[i] * 60, bw - 5, bars[i] * 60);
    }
    vctx.fillText('ACOUSTIC SPECTRUM — 22 FREQUENCY BANDS', 20, 154);
    const smoke = 190 + Math.sin(vt * .35) * 26 + Math.sin(vt * .11) * 14;
    vctx.strokeStyle = 'rgba(191,48,22,.9)'; vctx.setLineDash([5, 5]);
    vctx.beginPath(); vctx.moveTo(20, 300); vctx.lineTo(620, 300); vctx.stroke(); vctx.setLineDash([]);
    vctx.strokeStyle = 'rgba(241,237,226,.8)';
    vctx.beginPath(); vctx.moveTo(20, 340);
    for (let x = 0; x <= 600; x += 6) vctx.lineTo(20 + x, 340 - Math.max(0, Math.sin(x * .012 + vt * .4)) * (smoke - 150) * .9);
    vctx.stroke();
    vctx.fillStyle = 'rgba(241,237,226,.5)';
    vctx.fillText('SMOKE DENSITY — SENSOR THRESHOLD MARKED', 20, 272);
    vctx.fillStyle = '#bf3016'; vctx.fillText('ALERT', 580, 296);
  }
  loopWhen(vc, drawViso);
  if (REDUCED) drawViso();
}

/* ============ 07 SARBANASH SURVIVAL HORROR CRT CANVAS WITH SCREEN SHAKE ============ */
const fc = $('#foxCv');
if (fc) {
  fit(fc);
  const fctx = fc.getContext('2d');
  const FOX = [
    "                    ",
    "  ww          ww    ",
    "  www        www    ",
    "  www        www    ",
    "  wwwwwwwwwwwwww    ",
    "  wwwwwwwwwwwwww rr ",
    " wwrwwwwrwwwwwwwwrrr",
    " wwwwwwwwwwwwwwwrrrr",
    "  wwwwwwwwwwwwww rr ",
    "  wwwwwwwwwwwwww    ",
    "  ww wwwwwwww ww    ",
    "  www  wwww  www    ",
    "  ww    ww    ww    "
  ];
  let monsterVision = false, ft = 0;
  
  const mBtn = $('#foxVisionBtn');
  if (mBtn) {
    mBtn.addEventListener('click', () => {
      monsterVision = !monsterVision;
      mBtn.setAttribute('aria-pressed', monsterVision);
      mBtn.textContent = monsterVision ? 'NORMAL VISION 👁' : 'MONSTER VISION 👁';

      // TRIGGER SCREEN SHAKE ON TOGGLE
      fc.classList.add('shake');
      setTimeout(() => fc.classList.remove('shake'), 420);
    });
  }

  function drawFox(){
    fctx.clearRect(0, 0, 480, 320);
    const s = 16, ox = 60, oy = 48 + ((ft >> 4) % 2);

    // Dark Horror Grid Background
    fctx.strokeStyle = monsterVision ? 'rgba(191,48,22,.25)' : 'rgba(241,237,226,.08)';
    fctx.lineWidth = 1;
    for (let x = 0; x < 480; x += 30) { fctx.beginPath(); fctx.moveTo(x,0); fctx.lineTo(x,320); fctx.stroke(); }
    for (let y = 0; y < 320; y += 30) { fctx.beginPath(); fctx.moveTo(0,y); fctx.lineTo(480,y); fctx.stroke(); }

    // Sprite Pixels
    FOX.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === 'w') {
        fctx.fillStyle = monsterVision ? '#bf3016' : '#f1ede2';
        fctx.fillRect(ox + x * s, oy + y * s, s - 1, s - 1);
      } else if (ch === 'r') {
        fctx.fillStyle = monsterVision ? '#e6c229' : '#bf3016';
        fctx.fillRect(ox + x * s, oy + y * s, s - 1, s - 1);
      }
    }));

    // Monster Radar Sweep
    const sweepX = (ft * 4) % 480;
    fctx.fillStyle = monsterVision ? 'rgba(191,48,22,.35)' : 'rgba(230,194,41,.18)';
    fctx.fillRect(sweepX, 0, 10, 320);

    // CRT Telemetry Overlay
    fctx.font = '600 11px "IBM Plex Mono"';
    fctx.fillStyle = monsterVision ? '#bf3016' : '#f1ede2';
    fctx.fillText(`SARBANASH // ${monsterVision ? 'ALERT: MONSTER DETECTED' : 'FOX SPRITE ACTIVE'}`, 40, 290);
  }

  if (REDUCED) drawFox();
  else loopWhen(fc, () => { ft++; drawFox(); });
  drawFox();
}

/* ============ CONTACT ROWS ============ */
const cRows = $('#contactRows');
if (cRows) {
  function crow(label, inner){
    const d = document.createElement('div');
    d.className = 'c-row';
    d.innerHTML = `<span class="cl">${label}</span>${inner}`;
    cRows.appendChild(d);
  }
  crow('LAB CHANNEL', `<a class="cv" href="${CONTACT.instagram}" target="_blank" rel="noopener">LOCAL_FIRST_LAB / 13K+ ↗</a>`);
  crow('GITHUB', `<a class="cv" href="${CONTACT.github}" target="_blank" rel="noopener">@My-Mation ↗</a>`);
  crow('LINKEDIN', `<a class="cv" href="${CONTACT.linkedin}" target="_blank" rel="noopener">DEBARGHA SARKAR ↗</a>`);
}
