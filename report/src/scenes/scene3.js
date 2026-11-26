/* Scene 3 — Member 3: Life, Livelihood & Science (pp. 103–104). */
(function (R) {
  const NS = 'http://www.w3.org/2000/svg';
  const step = id => R.CONTENT.scenes.find(s => s.id === 'm3').steps.find(s => s.id === id);

  /* ---------- Blumentritt's letter ---------- */
  function blumentritt(ctx) {
    const f = R.frame(ctx, 'dapitan_village');
    R.sprite(f, R.getArt('rizal_figure'), 560, 560, 150, 300);
    const card = R.h('div', 'letter-card');
    card.innerHTML = '<span class="lc-date">Dapitan, 19 December 1893</span><p>My dear friend, I shall tell you how we live here…</p><span class="lc-sign">— Rizal</span>';
    R.place(card, 1330, 270, 470); f.appendChild(card);
    if (R.fwd(ctx)) R.anim(card, [{ opacity: 0, transform: 'translateY(-40px) rotate(-8deg)' }, { opacity: 1, transform: 'rotate(2deg)' }], { duration: 700, delay: 300 });
    R.app.ui.setLabels([]);
  }

  /* ---------- three houses ---------- */
  let houses = null;
  const KINDS = [['square', 'house_square', 370, 400, 280, 293], ['octagon', 'house_octagon', 650, 360, 320, 335], ['hexagon', 'house_hexagon', 980, 420, 260, 272]];
  function housesEnter(ctx) {
    const f = R.frame(ctx, 'dapitan_village');
    const who = step('houses').extra.who;
    houses = { list: [] };
    KINDS.forEach(([kind, art, x, y, w, h], i) => {
      const wrap = R.h('div', 'house'); wrap.dataset.kind = kind; R.place(wrap, x, y, w, h);
      const svg = R.getArt(art); svg.style.width = '100%'; svg.style.height = '100%'; wrap.appendChild(svg);
      f.appendChild(wrap);
      const tag = R.h('div', 'house-who'); tag.dataset.kind = kind; tag.textContent = who[kind];
      R.place(tag, x + w / 2 - 150, y - 110, 300); tag.style.visibility = 'hidden'; f.appendChild(tag);
      wrap.addEventListener('click', () => reveal(kind, true));
      houses.list.push({ kind, tag, shown: false });
      if (R.fwd(ctx)) R.anim(wrap, [{ opacity: 0, transform: 'translateY(60px) scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: i * 180 });
    });
    if (!R.fwd(ctx)) houses.list.forEach(hh => reveal(hh.kind, false));
    R.app.ui.setLabels(step('houses').labels.map((t, i) => ({ text: t, x: KINDS[i][2] + KINDS[i][4] / 2, y: 760, anchor: 'middle' })));
  }
  function reveal(kind, animate) {
    const hh = houses && houses.list.find(x => x.kind === kind); if (!hh || hh.shown) return false;
    hh.shown = true; hh.tag.style.visibility = 'visible'; if (animate) R.popIn(hh.tag); return true;
  }

  /* ---------- a day in Dapitan ---------- */
  const SKY = ['#F6C9A2', '#F7DDB0', '#C9E3EC', '#BFE0EA', '#BFE0EA', '#F2BE8A', '#22385A'];
  let day = null;
  function dayEnter(ctx) {
    const f = R.frame(ctx, null);
    f.classList.add('day-sky');
    const sky = document.createElementNS(NS, 'svg'); sky.setAttribute('viewBox', '0 0 1920 1080'); sky.classList.add('full'); R.place(sky, 0, 0, 1920, 1080);
    sky.innerHTML = `<g id="sun" opacity="0"></g>
      <g id="moon" opacity="0"><circle r="50" fill="#FFF0C2" stroke="#2E2117" stroke-width="6"/><circle cx="20" cy="-14" r="46" fill="#22385A"/></g>`;
    f.appendChild(sky);
    const panel = R.h('div', 'day-panel'); R.place(panel, 510, 200, 900, 520);
    const vig = R.getArt('day_vignettes'); vig.style.width = '100%'; vig.style.height = '100%'; panel.appendChild(vig); f.appendChild(panel);
    const chip = R.h('div', 'day-chip'); R.place(chip, 660, 150, 600); f.appendChild(chip);
    const ctl = R.sunSlider(f, 560, 742, 800, 6, v => setTime(v)); const sl = ctl.input;
    const ticks = R.h('div', 'day-ticks'); R.place(ticks, 560, 806, 800);
    step('day').extra.times.forEach(([t]) => ticks.appendChild(R.h('span', '', t))); f.appendChild(ticks);
    day = { f, sky, vig, chip, sl, ctl, idx: 0 };
    setTime(R.fwd(ctx) ? 0 : 6);
    R.app.ui.setLabels([]);
  }
  function setTime(i) {
    const { f, sky, vig, chip, ctl } = day; day.idx = i; ctl.set(i);
    for (let k = 1; k <= 7; k++) vig.querySelector('#vig-' + k).setAttribute('opacity', k === i + 1 ? 1 : 0);
    const [t, what] = step('day').extra.times[i]; chip.textContent = `${t} · ${what}`;
    f.style.background = SKY[i];
    const night = i === 6;
    sky.querySelector('#moon').setAttribute('transform', 'translate(1500 200)'); sky.querySelector('#moon').setAttribute('opacity', night ? 1 : 0);
    R.app.ui.stage.classList.toggle('is-dark', night);
  }

  /* ---------- farmer ---------- */
  function farmer(ctx) {
    const f = R.frame(ctx, 'talisay_farm');
    const art = f.querySelector('svg');
    R.sprite(f, R.getArt('rizal_figure'), 1180, 600, 140, 280);
    R.sprite(f, R.castMember('carreon', { mood: 'smile' }), 1700, 560, 130, 300);
    if (R.fwd(ctx)) for (let i = 1; i <= 6; i++) R.popIn(R.part(art, 'tree-' + i), 200 + i * 150);
    R.app.ui.setLabels([
      { text: 'Talisay', x: 520, y: 330, toX: 360, toY: 380 },
      { text: 'European methods', x: 1240, y: 1010, toX: 1530, toY: 920, anchor: 'middle' }
    ]);
  }

  /* ---------- Sitio Ponot (bonus) ---------- */
  function ponot(ctx) {
    const f = R.frame(ctx, null);
    const map = R.getArt('journey_map'); map.setAttribute('viewBox', '760 690 520 292'); map.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    map.classList.add('full'); R.place(map, 0, 0, 1920, 1080); f.appendChild(map);
    map.querySelectorAll('path, circle').forEach(p => p.setAttribute('vector-effect', 'non-scaling-stroke'));
    map.querySelectorAll('rect[fill="url(#journey_map-dots)"]').forEach(r => r.remove());
    ['stops', 'pin-manila', 'route', 'route-shadow'].forEach(id => { const e = R.part(map, id); if (e) e.remove(); });
    const dp = R.part(map, 'pin-dapitan'); dp.setAttribute('transform', dp.getAttribute('transform') + ' scale(.38)');
    const pin = dp.cloneNode(true); pin.removeAttribute('id'); pin.setAttribute('transform', 'translate(1006 829) scale(.38)');
    pin.querySelector('path').setAttribute('fill', '#C98A1B'); map.appendChild(pin);
    const no = R.h('div', 'no-mark', '✗'); R.place(no, 880, 520); f.appendChild(no);
    if (R.fwd(ctx)) { R.popIn(pin, 200); R.anim(pin, [{ opacity: 1 }, { opacity: .35 }], { duration: 700, delay: 900 }); R.popIn(no, 1100); }
    else pin.setAttribute('opacity', .35);
    R.app.ui.setLabels([{ text: 'Sitio Ponot', x: 1200, y: 640, toX: 990, toY: 560 }]);
  }

  /* ---------- trader ---------- */
  function trader(ctx) {
    const f = R.frame(ctx, 'dapitan_village');
    const b = [[700, 690], [860, 700], [780, 630]].map(([x, y], i) => R.sprite(f, R.getArt('hemp_bundle'), x, y, 260, 110));
    R.sprite(f, R.castMember('carreon', { mood: 'smile', extra: ['wave'] }), 1000, 470, 150, 345);
    R.sprite(f, R.getArt('rizal_figure'), 560, 520, 150, 300);
    const badge = R.h('div', 'coop-badge'); badge.innerHTML = '<b>Cooperative</b><span>Dapitan hemp</span>'; R.place(badge, 1520, 560); f.appendChild(badge);
    if (R.fwd(ctx)) { b.forEach((x, i) => R.anim(x, [{ opacity: 0, transform: 'translateY(-80px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: i * 150 })); R.popIn(badge, 900); }
    R.app.ui.setLabels([
      { text: 'hemp', x: 1180, y: 880, toX: 1090, toY: 790 },
      { text: 'Ramon Carreon', x: 1200, y: 400, toX: 1090, toY: 480 }
    ]);
  }

  /* ---------- letters to Europe: one scientist per beat ---------- */
  const CITY_KEYS = ['london', 'cologne', 'prague', 'stuttgart', 'dresden'];
  let eu = null;
  function europeEnter(ctx) {
    const f = R.frame(ctx, 'europe_letters');
    const art = f.querySelector('svg');
    const sci = step('europe').extra.scientists;
    eu = { art, cards: [], n: 0, paths: R.part(art, 'letter-paths') };
    eu.paths.setAttribute('opacity', 1);
    sci.forEach(([name, place, topic], i) => {
      const c = R.h('div', 'sci-card'); c.innerHTML = `<b>${name}</b><span>${place}</span><i>${topic}</i>`;
      R.place(c, 70, 230 + i * 118, 420); c.style.visibility = 'hidden'; f.appendChild(c); eu.cards.push(c);
    });
    showSci(R.fwd(ctx) ? 0 : sci.length, false);
    R.app.ui.setLabels([]);
  }
  function showSci(n, animate) {
    eu.cards.forEach((c, i) => { c.style.visibility = i < n ? 'visible' : 'hidden'; });
    eu.paths.textContent = '';
    for (let i = 0; i < n; i++) {
      const g = R.part(eu.art, 'city-' + CITY_KEYS[i]);
      const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute('transform'));
      const x = +m[1], y = +m[2];
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M${x} ${y} Q${(x + 1560) / 2} ${Math.min(y, 560) - 220} 1500 560`);
      eu.paths.appendChild(p);
      const card = eu.cards[i], link = document.createElementNS(NS, 'path');
      link.setAttribute('d', `M490 ${260 + i * 118} L${x - 18} ${y}`); link.setAttribute('stroke', '#2E2117'); link.setAttribute('stroke-dasharray', 'none'); link.setAttribute('stroke-width', '3'); link.setAttribute('opacity', '.5');
      eu.paths.appendChild(link);
      if (animate && i === n - 1) {
        const L = p.getTotalLength(); p.style.strokeDasharray = `4 14`;
        R.anim(p, [{ strokeDashoffset: L, opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }], { duration: 900 });
        R.slideIn(card, -60, 0, 0, 450); R.popIn(g, 100);
      }
    }
    eu.n = n;
  }

  /* ---------- new species: two flip cards ---------- */
  let spec = null;
  function speciesEnter(ctx) {
    const f = R.frame(ctx, null);
    const defs = [['specimen_frog', 'Rhacophorus rizali', 'a frog · named by Prof. Boettger'], ['specimen_beetle', 'Apogonia rizali', 'a beetle · named by Dr. Carl M. Heller']];
    spec = defs.map(([art, name, by], i) => {
      const card = R.h('div', 'spec-card'); R.place(card, 430 + i * 560, 210, 500, 560);
      const front = R.h('div', 'spec-face spec-front'); front.innerHTML = `<span class="q">?</span><span>Specimen No. ${i + 1}</span><span class="sm">sent from Dapitan</span>`;
      const back = R.h('div', 'spec-face spec-back');
      const svg = R.getArt(art); svg.classList.add('spec-art'); back.appendChild(svg);
      back.append(R.h('b', '', name), R.h('span', '', by));
      card.append(front, back); f.appendChild(card);
      card.addEventListener('click', () => flip(i, true));
      return { card, flipped: false };
    });
    if (!R.fwd(ctx)) spec.forEach((_, i) => flip(i, false));
    R.app.ui.setLabels([]);
  }
  function flip(i, animate) {
    const s = spec && spec[i]; if (!s || s.flipped) return false;
    s.flipped = true; s.card.classList.add('flipped');
    if (!animate) s.card.classList.add('no-anim');
    return true;
  }

  /* ---------- school: 16 students ---------- */
  let schoolTimer = null;
  function school(ctx) {
    const f = R.frame(ctx, 'dapitan_village');
    R.sprite(f, R.getArt('house_octagon'), 1150, 330, 320, 335);
    const board = R.h('div', 'school-board'); R.place(board, 600, 180, 560, 180); f.appendChild(board);
    const subjects = step('school').extra.subjects; let k = 0;
    const show = () => { board.innerHTML = `<span>Today's lesson</span><b>${subjects[k % subjects.length]}</b>`; };
    show(); board.addEventListener('click', () => { k++; show(); });
    clearInterval(schoolTimer); if (!(R.app.params && R.app.params.has('still'))) schoolTimer = setInterval(() => { k++; show(); }, 2600);
    const skins = ['tan', 'mid', 'deep', 'tan', 'mid', 'tan', 'deep', 'mid'];
    const shirts = ['#FBF3E2', '#E8EEF4', '#F4EBD6', '#FBF3E2', '#EEF2E4', '#FBF3E2', '#F4EBD6', '#E8EEF4'];
    for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) {
      const s = R.castMember('student', { skin: skins[(i + r * 3) % 8], color: shirts[(i + r) % 8], color2: r ? '#4F5D6E' : '#6B5A47', mood: (i + r) % 3 ? 'smile' : 'neutral' });
      s.classList.add('student');
      const w = r ? 96 : 82, x = (r ? 330 : 380) + i * (r ? 100 : 88), y = r ? 590 : 490;
      R.sprite(f, s, x, y, w, w * 2.3);
      if (R.fwd(ctx)) R.popIn(s, (r * 8 + i) * 50);
    }
    R.app.ui.setLabels([{ text: '16 students', x: 1250, y: 800, toX: 1110, toY: 720 }]);
  }

  /* ---------- plaza (bonus): before / after slider ---------- */
  let plaza = null;
  function plazaEnter(ctx) {
    const f = R.frame(ctx, 'plaza_before_after');
    const art = f.querySelector('svg'), before = R.part(art, 'before');
    const clip = document.createElementNS(NS, 'clipPath'); clip.setAttribute('id', 'plaza_before_after-clip');
    const rect = document.createElementNS(NS, 'rect'); rect.setAttribute('x', 0); rect.setAttribute('y', 0); rect.setAttribute('height', 1080); rect.setAttribute('width', 1920);
    clip.appendChild(rect); art.querySelector('defs').appendChild(clip); before.setAttribute('clip-path', 'url(#plaza_before_after-clip)');
    const ctl = R.sunSlider(f, 760, 460, 700, 100, v => set(v), 'plaza-slider');
    const tags = R.h('div', 'day-ticks'); tags.innerHTML = '<span>before</span><span>after</span>'; R.place(tags, 760, 530, 700); f.appendChild(tags);
    const set = v => { rect.setAttribute('x', 1920 * v / 100); ctl.set(v); plaza.v = v; };
    plaza = { set, v: 0 };
    set(R.fwd(ctx) ? 0 : 100);
    R.app.ui.setLabels([
      { text: 'relief map', x: 780, y: 820, toX: 960, toY: 900 },
      { text: 'waterworks', x: 1500, y: 700, toX: 1600, toY: 800, anchor: 'middle' }
    ]);
  }

  R.registerScene('m3', {
    steps: {
      blumentritt: { enter: blumentritt },
      houses: {
        enter: housesEnter,
        advance() { const nx = houses && houses.list.find(x => !x.shown); return nx ? reveal(nx.kind, true) : false; },
        exit() { houses = null; }
      },
      day: {
        enter: dayEnter,
        advance() { if (day && day.idx < 6) { setTime(day.idx + 1); return true; } return false; },
        retreat() { if (day && day.idx > 0) { setTime(day.idx - 1); return true; } return false; },
        exit() { day = null; R.app.ui.stage.classList.remove('is-dark'); }
      },
      farmer: { enter: farmer },
      ponot: { enter: ponot },
      trader: { enter: trader },
      europe: {
        enter: europeEnter,
        advance() { if (eu && eu.n < eu.cards.length) { showSci(eu.n + 1, true); return true; } return false; },
        retreat() { if (eu && eu.n > 0) { showSci(eu.n - 1, false); return true; } return false; },
        exit() { eu = null; }
      },
      species: {
        enter: speciesEnter,
        advance() { const i = spec ? spec.findIndex(s => !s.flipped) : -1; return i >= 0 ? flip(i, true) : false; },
        exit() { spec = null; }
      },
      school: { enter: school, exit() { clearInterval(schoolTimer); } },
      plaza: {
        enter: plazaEnter,
        advance() { if (plaza && plaza.v < 100) { const from = plaza.v; let t = 0; const id = setInterval(() => { t += .1; plaza.set(Math.min(100, from + (100 - from) * t)); if (t >= 1) clearInterval(id); }, 40); const done = R.app.engine.busy(() => { clearInterval(id); plaza.set(100); }); setTimeout(done, 450); return true; } return false; },
        exit() { plaza = null; }
      }
    }
  });
})(globalThis.Report = globalThis.Report || {});
