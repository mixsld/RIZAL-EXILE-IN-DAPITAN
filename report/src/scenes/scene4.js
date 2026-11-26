/* Scene 4 — Member 4: Workshop, Arts, Medicine & Departure (pp. 105–106). */
(function (R) {
  const NS = 'http://www.w3.org/2000/svg';
  const step = id => R.CONTENT.scenes.find(s => s.id === 'm4').steps.find(s => s.id === id);

  /* ---------- lighting Dapitan ---------- */
  let lampsF = null, lit = false;
  function lightAll(animate) {
    if (!lampsF || lit) return false;
    lit = true;
    const art = lampsF.querySelector('svg');
    ['lamp-1', 'lamp-2', 'lamp-3', 'lamp-main'].forEach((id, i) => {
      const g = R.part(art, id); g.classList.add('lit');
      g.querySelectorAll('[data-glow]').forEach(x => { x.setAttribute('opacity', 1); if (animate) R.anim(x, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: i * 180 }); });
      g.querySelectorAll('[data-flame]').forEach(x => x.setAttribute('fill', '#F4B942'));
    });
    const marsh = R.part(art, 'marsh'), mos = R.part(art, 'mosquitoes');
    marsh.setAttribute('opacity', .25); mos.setAttribute('opacity', 0);
    if (animate) { R.anim(marsh, [{ opacity: 1 }, { opacity: .25 }], { duration: 1200, delay: 500 }); R.anim(mos, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 600 }); }
    const ring = lampsF.querySelector('.hint-ring'); if (ring) ring.remove();
    const tag = R.h('div', 'malaria-tag', 'malaria ↓'); R.place(tag, 760, 470); lampsF.appendChild(tag); if (animate) R.popIn(tag, 900);
    return true;
  }
  function lamps(ctx) {
    lit = false;
    lampsF = R.frame(ctx, 'night_street_lamps', { dark: true });
    const art = lampsF.querySelector('svg');
    const main = R.part(art, 'lamp-main'); main.style.cursor = 'pointer';
    main.addEventListener('click', () => lightAll(true));
    const ring = R.h('div', 'hint-ring'); R.place(ring, 1350, 330, 180, 220); lampsF.appendChild(ring);
    if (!R.fwd(ctx)) lightAll(false);
    R.app.ui.setLabels([{ text: 'coconut-oil lamp', x: 1150, y: 300, toX: 1390, toY: 430, anchor: 'middle' }]);
  }

  /* ---------- workbench: beat 1 press, beat 2 lighter ---------- */
  let wb = null;
  function workbench(ctx) {
    const f = R.frame(ctx, 'workbench');
    const art = f.querySelector('svg');
    wb = { art, n: 0 };
    R.setOpacity(R.part(art, 'bricks'), 0);
    if (!R.fwd(ctx)) { press(false); spark(false); }
    R.app.ui.setLabels([
      { text: 'brick machine', x: 560, y: 300, toX: 500, toY: 400, anchor: 'middle' },
      { text: 'wooden lighter', x: 1640, y: 470, toX: 1440, toY: 520, anchor: 'middle' }
    ]);
  }
  function press(animate) {
    const lever = R.part(wb.art, 'lever'), plate = R.part(wb.art, 'press-plate'), bricks = R.part(wb.art, 'bricks');
    [lever].forEach(x => { x.style.transformBox = 'view-box'; x.style.transformOrigin = '490px 430px'; });
    bricks.setAttribute('opacity', 1);
    if (animate) {
      R.anim(lever, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(22deg)' }, { transform: 'rotate(0deg)' }], { duration: 900 });
      R.anim(plate, [{ transform: 'translateY(0)' }, { transform: 'translateY(40px)' }, { transform: 'translateY(0)' }], { duration: 900 });
      R.anim(bricks, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 700 });
    }
    wb.n = 1; return true;
  }
  function spark(animate) {
    const plunger = R.part(wb.art, 'plunger'), sp = R.part(wb.art, 'spark');
    sp.setAttribute('opacity', 1);
    if (animate) {
      R.anim(plunger, [{ transform: 'translateY(0)' }, { transform: 'translateY(80px)' }, { transform: 'translateY(0)' }], { duration: 700 });
      R.anim(sp, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, delay: 350 });
    }
    wb.n = 2; return true;
  }

  /* ---------- gallery of poems ---------- */
  function gallery(ctx) {
    const f = R.frame(ctx, null); f.classList.add('wall');
    step('gallery').extra.poems.forEach((t, i) => {
      const fr = R.h('div', 'poem-frame');
      fr.innerHTML = `<span class="pf-nail"></span><b>${t}</b><span class="pf-lines"></span>`;
      R.place(fr, 330 + i * 330, 260 + (i % 2) * 70, 290, 330); f.appendChild(fr);
      if (R.fwd(ctx)) R.anim(fr, [{ opacity: 0, transform: 'rotate(-14deg) translateY(-50px)' }, { opacity: 1, transform: 'rotate(4deg)' }, { opacity: 1, transform: `rotate(${[-2, 2, -1.5, 1.5][i]}deg)` }], { duration: 800, delay: i * 160 });
      else fr.style.transform = `rotate(${[-2, 2, -1.5, 1.5][i]}deg)`;
    });
    R.app.ui.setLabels([]);
  }

  /* ---------- sculpture spotlight ---------- */
  function sculpture(ctx) {
    const f = R.frame(ctx, null, { dark: true }); f.classList.add('spotlight');
    const s = R.sprite(f, R.getArt('mothers_revenge'), 520, 260, 880, 557);
    if (R.fwd(ctx)) R.anim(s, [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 700 });
    R.app.ui.setLabels([{ text: 'Syria', x: 690, y: 270, toX: 790, toY: 360, anchor: 'end' }]);
  }

  /* ---------- linguist (bonus) ---------- */
  function linguist(ctx) {
    const f = R.frame(ctx, null);
    const bust = R.sprite(f, R.getArt('rizal_bust'), 790, 330, 340, 434);
    R.setOpacity(R.part(bust, 'brows-calm'), 0); R.setOpacity(R.part(bust, 'brows-think'), 1);
    const spots = [['Tagalog', 380, 260], ['Bisayan', 1300, 260], ['Subanon', 380, 560], ['Malay', 1300, 560]];
    spots.forEach(([t, x, y], i) => { const b = R.bubble(f, t, x, y, 260, i % 2 ? 'left' : 'right'); b.classList.add('lang-bubble'); if (R.fwd(ctx)) R.popIn(b, i * 200); });
    const link = R.h('div', 'compare-link', '⇅ compared'); R.place(link, 1330, 430); f.appendChild(link); if (R.fwd(ctx)) R.popIn(link, 900);
    R.app.ui.setLabels([]);
  }

  /* ---------- doctor ---------- */
  function doctor(ctx) {
    const f = R.frame(ctx, null); f.classList.add('clinic');
    const chart = R.h('div', 'eye-chart'); chart.innerHTML = '<b>E</b><span>F P</span><span>T O Z</span><span>L P E D</span><span>P E C F D</span>';
    R.place(chart, 170, 230, 220, 330); f.appendChild(chart);
    const doc = R.sprite(f, R.getArt('rizal_bust'), 470, 360, 330, 421);
    R.setOpacity(R.part(doc, 'mouth-calm'), 0); R.setOpacity(R.part(doc, 'mouth-smile'), 1);
    const mother = R.sprite(f, R.castMember('mother'), 790, 420, 170, 391);
    const q = [['patient', {}], ['patient', { skin: 'deep', color: '#9FB0A0' }], ['patient', { outfit: 'baro', hair: 'bun', color: '#7A6650', color2: '#C9B48E', color3: '#FBF3E2' }]]
      .map(([c, o], i) => R.sprite(f, R.castMember(c, o), 1150 + i * 170, 450 + (i % 2) * 20, 150, 345));
    const free = R.h('div', 'free-tag', 'FREE'); R.place(free, 1320, 330); f.appendChild(free);
    if (R.fwd(ctx)) { q.forEach((p, i) => R.slideIn(p, 200, 0, 300 + i * 150, 600)); R.popIn(free, 900); }
    R.app.ui.setLabels([
      { text: 'his mother', x: 880, y: 360, toX: 875, toY: 430, anchor: 'middle' },
      { text: 'free care', x: 1500, y: 300, toX: 1400, toY: 330, anchor: 'start' }
    ]);
  }

  /* ---------- Josephine: four gentle comic panels, one per beat ---------- */
  let jo = null;
  function josephineEnter(ctx) {
    const f = R.frame(ctx, null);
    const caps = step('josephine').extra.panels;
    const build = [
      p => { put(p, R.castMember('tauffer'), 40, 50, 130, 300); put(p, R.castMember('josephine'), 190, 50, 130, 300); },
      p => { put(p, R.getArt('rizal_figure'), 60, 70, 140, 280); put(p, R.castMember('josephine', { mood: 'smile' }), 190, 50, 130, 300); heart(p, 150, 30); const ch = R.h('div', 'jo-church', '⛪✗'); R.place(ch, 260, 16); p.appendChild(ch); },
      p => { const hut = R.getArt('house_square'); put(p, hut, 30, 40, 300, 314); },
      p => { const c = R.h('div', 'jo-baby'); c.innerHTML = '<svg viewBox="0 0 200 160"><path d="M40 120 C40 70 160 70 160 120 Z" fill="#FFF8EA" stroke="#2E2117" stroke-width="6" stroke-linejoin="round"/><path d="M20 120 H180 L170 140 H30 Z" fill="#C9A26A" stroke="#2E2117" stroke-width="6" stroke-linejoin="round"/><circle cx="100" cy="86" r="18" fill="#EFC69A" stroke="#2E2117" stroke-width="5"/><path d="M70 50 C60 30 80 20 92 34 M130 50 C140 30 120 20 108 34" fill="none" stroke="#E8C25A" stroke-width="6" stroke-linecap="round"/><path d="M100 20 C94 8 106 8 100 20 Z" fill="#F4B942" stroke="#2E2117" stroke-width="3"/></svg><span>Francisco</span>'; R.place(c, 60, 70, 240, 260); p.appendChild(c); }
    ];
    const panels = caps.map((cap, i) => {
      const p = R.h('div', 'jo-panel'); R.place(p, 150 + i * 410, 230, 380, 440);
      build[i](p); const cp = R.h('div', 'jo-cap', cap); p.appendChild(cp);
      f.appendChild(p); return p;
    });
    jo = { panels, n: 0 };
    showPanels(R.fwd(ctx) ? 1 : 4, R.fwd(ctx));
    R.app.ui.setLabels([]);
  }
  function put(p, el, x, y, w, h) { R.place(el, x, y, w, h); p.appendChild(el); }
  function heart(p, x, y) { const hh = R.h('div', 'jo-heart', '♥'); R.place(hh, x, y); p.appendChild(hh); }
  function showPanels(n, animate) {
    jo.panels.forEach((p, i) => { const on = i < n; p.classList.toggle('shown', on); p.style.visibility = on ? 'visible' : 'hidden'; if (on && animate && i === n - 1) R.slideIn(p, 0, 30, 0, 500); });
    jo.n = n;
  }

  /* ---------- the vote ---------- */
  let vote = null;
  function voteEnter(ctx) {
    const f = R.frame(ctx, null); f.classList.add('wall');
    R.sprite(f, R.castMember('valenzuela'), 230, 330, 190, 437);
    const bust = R.sprite(f, R.getArt('rizal_bust'), 1440, 360, 320, 408);
    R.setOpacity(R.part(bust, 'brows-calm'), 0); R.setOpacity(R.part(bust, 'brows-think'), 1);
    R.bubble(f, 'The Katipunan plans a revolution. Will you support it?', 420, 230, 520, 'left');
    const box = R.h('div', 'vote-box'); R.place(box, 560, 470, 800);
    const mk = (v, label) => { const b = R.h('button', 'vote-btn ' + v); b.dataset.v = v; b.textContent = label;
      b.addEventListener('click', () => { box.querySelectorAll('.vote-btn').forEach(x => x.classList.toggle('selected', x === b)); R.popIn(b); }); return b; };
    box.append(mk('support', 'Support'), mk('oppose', 'Oppose'));
    box.appendChild(R.h('div', 'vote-hint', 'Think about it: if you were Rizal, what would you decide?'));
    f.appendChild(box);
    vote = { f, box, shown: false, bust };
    if (!R.fwd(ctx)) revealVote(false);
    R.app.ui.setLabels([]);
  }
  function revealVote(animate) {
    if (!vote || vote.shown) return false;
    vote.shown = true; vote.box.querySelector('.vote-hint').style.visibility = 'hidden';
    const a = R.h('div', 'vote-answer');
    a.innerHTML = '<div class="va-head">Rizal answered: <b>OPPOSE</b></div>';
    const list = R.h('div', 'va-reasons');
    step('vote').extra.reasons.forEach((r, i) => { const c = R.h('div', 'vote-reason'); c.innerHTML = `<i>${['👥', '💰', '🗺️'][i]}</i><span>${r}</span>`; list.appendChild(c); });
    a.appendChild(list); R.place(a, 560, 650, 800); vote.f.appendChild(a);
    R.setOpacity(R.part(vote.bust, 'mouth-calm'), 0); R.setOpacity(R.part(vote.bust, 'mouth-firm'), 1);
    if (animate) R.popIn(a);
    return true;
  }
  function hideVote() {
    vote.shown = false; vote.box.querySelector('.vote-hint').style.visibility = 'visible'; const a = vote.f.querySelector('.vote-answer'); if (a) a.remove();
    vote.box.querySelectorAll('.vote-btn').forEach(t => t.classList.remove('selected'));
    R.setOpacity(R.part(vote.bust, 'mouth-calm'), 1); R.setOpacity(R.part(vote.bust, 'mouth-firm'), 0);
  }

  /* ---------- Cuba letter ---------- */
  function cuba(ctx) {
    const f = R.frame(ctx, null);
    const letter = R.h('div', 'cuba-letter');
    letter.innerHTML = '<div class="cl-seal"></div><span class="cl-from">From the Governor General, Manila</span><b>Your offer to serve as a doctor in Cuba is accepted.</b><span class="cl-pass">Safe-conduct pass enclosed</span><span class="cl-sign">— Ramon Blanco</span>';
    R.place(letter, 520, 210, 760, 520); f.appendChild(letter);
    const st = R.stamp('stamp-accepted'); R.place(st, 1080, 520, 520, 245); f.appendChild(st);
    if (R.fwd(ctx)) {
      R.anim(letter, [{ opacity: 0, transform: 'translateY(60px) rotate(-6deg)' }, { opacity: 1, transform: 'rotate(-1.5deg)' }], { duration: 700 });
      R.anim(st, [{ opacity: 0, transform: 'scale(2.2) rotate(10deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 380, delay: 900, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    }
    R.app.ui.setLabels([]);
  }

  /* ---------- farewell ---------- */
  function farewell(ctx) {
    const f = R.frame(ctx, 'sunset_farewell', { dark: true });
    const ship = R.sprite(f, R.getArt('steamer'), 1060, 300, 660, 474);
    R.part(ship, 'name-plate').textContent = 'ESPAÑA';
    const crowd = [['townsman', 120], ['townswoman', 230], ['student', 340], ['townsman', 430], ['townswoman', 540], ['carnicero', 650]].map(([c, x], i) => {
      const p = R.castMember(c, c === 'carnicero' ? { mood: 'sad', extra: ['wave'] } : (c === 'student' ? { extra: ['wave'] } : {}));
      p.classList.add('silhouette'); return R.sprite(f, p, x, 560 + (i % 2) * 20, 110, 253);
    });
    const counter = R.h('div', 'day-counter'); counter.innerHTML = '<span>Time in Dapitan</span><b>0 days</b>'; R.place(counter, 760, 150, 400); f.appendChild(counter);
    const b = counter.querySelector('b'), final = step('farewell').extra.counter;
    if (R.fwd(ctx) && !(R.app.params && R.app.params.has('still'))) {
      R.anim(ship, [{ transform: 'translateX(-260px) scale(1.15)' }, { transform: 'translateX(0) scale(1)' }], { duration: 1500, easing: 'ease-in-out' });
      let d = 0; const total = 4 * 365 + 13;
      const id = setInterval(() => { d = Math.min(total, d + 37); b.textContent = d < total ? `${d} days` : final; if (d >= total) clearInterval(id); }, 30);
      const done = R.app.engine.busy(() => { clearInterval(id); b.textContent = final; });
      setTimeout(done, 1500);
    } else b.textContent = final;
    R.app.ui.setLabels([{ text: 'España', x: 1500, y: 280, toX: 1420, toY: 400, anchor: 'start' }]);
  }

  R.registerScene('m4', {
    steps: {
      lamps: { enter: lamps, advance: () => lightAll(true), exit() { lampsF = null; } },
      workbench: {
        enter: workbench,
        advance() { if (!wb) return false; if (wb.n === 0) return press(true); if (wb.n === 1) return spark(true); return false; },
        exit() { wb = null; }
      },
      gallery: { enter: gallery },
      sculpture: { enter: sculpture },
      linguist: { enter: linguist },
      doctor: { enter: doctor },
      josephine: {
        enter: josephineEnter,
        advance() { if (jo && jo.n < 4) { showPanels(jo.n + 1, true); return true; } return false; },
        retreat() { if (jo && jo.n > 1) { showPanels(jo.n - 1, false); return true; } return false; },
        exit() { jo = null; }
      },
      vote: {
        enter: voteEnter,
        advance: () => revealVote(true),
        retreat() { if (vote && vote.shown) { hideVote(); return true; } return false; },
        exit() { vote = null; }
      },
      cuba: { enter: cuba },
      farewell: { enter: farewell }
    }
  });
})(globalThis.Report = globalThis.Report || {});
