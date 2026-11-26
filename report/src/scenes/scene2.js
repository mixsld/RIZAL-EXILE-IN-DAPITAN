/* Scene 2 — Member 2: Arrest, Exile & Fr. Pastells (pp. 102–103). */
(function (R) {
  const NS = 'http://www.w3.org/2000/svg';
  const step = id => R.CONTENT.scenes.find(s => s.id === 'm2').steps.find(s => s.id === id);
  const head = (svg, vb) => { svg.setAttribute('viewBox', vb); return svg; };

  /* ---------- fort ---------- */
  function fort(ctx) {
    const f = R.frame(ctx, 'fort_santiago_gate');
    const bars = R.part(f.querySelector('svg'), 'bars');
    const g1 = R.sprite(f, R.castMember('carnicero', { facial: 'moustache', mood: 'stern', color2: '#B23A2E' }), 610, 520, 150, 345);
    const g2 = R.sprite(f, R.castMember('carnicero', { facial: null, mood: 'stern', skin: 'tan' }), 1160, 520, 150, 345);
    const order = R.h('div', 'order-scroll');
    order.innerHTML = '<b>ORDER</b><span>Arrest. Detain.<br>Exile to the south.</span><i>— Despujol</i>';
    R.place(order, 1420, 560, 360); f.appendChild(order);
    if (R.fwd(ctx)) {
      R.anim(bars, [{ transform: 'translateY(-470px)' }, { transform: 'translateY(-470px)', offset: .3 }, { transform: 'translateY(0)' }], { duration: 1000, easing: 'cubic-bezier(.6,0,1,1)' });
      R.anim(f, [{ transform: 'translateY(0)' }, { transform: 'translateY(7px)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 220, delay: 1000 });
      R.popIn(order, 1150);
    }
    R.app.ui.setLabels([{ text: 'Fort Santiago', x: 1500, y: 300, toX: 1240, toY: 250 }]);
  }

  /* ---------- voyage (+ beat: hand-over panel) ---------- */
  let voyage = null;
  function voyageEnter(ctx) {
    const f = R.frame(ctx, 'sea_voyage');
    const ship = R.sprite(f, R.getArt('steamer'), 740, 300, 780, 560);
    R.part(ship, 'name-plate').textContent = 'CEBU';
    R.loop(R.part(ship, 'ship'), [{ transform: 'translateY(0)' }, { transform: 'translateY(5px)' }], { duration: 1800 });
    const panel = R.h('div', 'comic-panel'); R.place(panel, 1290, 236, 580, 340); panel.style.opacity = 0;
    const people = [[R.castMember('delgas'), 30], [R.getArt('rizal_figure'), 215], [R.castMember('carnicero', { mood: 'neutral' }), 380]];
    people.forEach(([p, x]) => { R.place(p, x, 30, 130, 290); panel.appendChild(p); });
    const arrow = R.h('div', 'panel-arrow', '→'); R.place(arrow, 340, 120); panel.appendChild(arrow);
    panel.appendChild(Object.assign(R.h('div', 'panel-cap', 'Capt. Delgas hands Rizal to Capt. Carnicero')));
    f.appendChild(panel);
    voyage = { panel, shown: false };
    if (R.fwd(ctx)) R.anim(ship, [{ transform: 'translateX(-1000px)' }, { transform: 'translateX(0)' }], { duration: 1500, easing: 'cubic-bezier(.25,.7,.3,1)' });
    else showPanel(false);
    R.app.ui.setLabels([
      { text: 'steamer Cebu', x: 980, y: 260, toX: 1100, toY: 420, anchor: 'end' },
      { text: 'Dapitan', x: 1580, y: 660, toX: 1660, toY: 600 }
    ]);
  }
  function showPanel(animate) { if (!voyage || voyage.shown) return false; voyage.shown = true; voyage.panel.style.opacity = 1; if (animate) R.popIn(voyage.panel); return true; }

  /* ---------- offer: two doors ---------- */
  function offer(ctx) {
    const f = R.frame(ctx, 'two_doors');
    const art = f.querySelector('svg');
    const obach = R.sprite(f, R.castMember('obach', { extra: ['wave'] }), 250, 560, 110, 253);
    const rizal = R.sprite(f, R.getArt('rizal_figure'), 1300, 600, 92, 182);
    const no = R.h('div', 'no-mark', '✗'); R.place(no, 600, 600); f.appendChild(no);
    if (R.fwd(ctx)) {
      R.anim(rizal, [{ transform: 'translate(-420px,300px) scale(1.5)' }, { transform: 'translate(-300px,150px) scale(1.25)', offset: .4 }, { transform: 'translate(0,0) scale(1)' }], { duration: 1500, easing: 'ease-in-out' });
      R.popIn(no, 1000);
    }
    R.app.ui.setLabels([
      { text: 'Mission house', x: 700, y: 210, toX: 560, toY: 300 },
      { text: "Carnicero's house", x: 1500, y: 210, toX: 1460, toY: 300, anchor: 'middle' }
    ]);
  }

  /* ---------- why Zamboanga (bonus): zoomed journey map ---------- */
  function why(ctx) {
    const f = R.frame(ctx, null);
    const map = R.getArt('journey_map'); map.setAttribute('viewBox', '760 690 520 292'); map.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    map.classList.add('full'); R.place(map, 0, 0, 1920, 1080); f.appendChild(map);
    map.querySelectorAll('path, circle').forEach(p => p.setAttribute('vector-effect', 'non-scaling-stroke'));
    map.querySelectorAll('rect[fill="url(#journey_map-dots)"]').forEach(r => r.remove());
    ['stops', 'pin-manila', 'route', 'route-shadow'].forEach(id => { const e = R.part(map, id); if (e) e.remove(); });
    const pin = R.part(map, 'pin-dapitan'); pin.setAttribute('transform', pin.getAttribute('transform') + ' scale(.38)');
    const fortG = document.createElementNS(NS, 'g');
    fortG.setAttribute('transform', 'translate(946 893) scale(.34)');
    fortG.innerHTML = `<path d="M-60 0 V-60 H-40 V-74 H-20 V-60 H20 V-74 H40 V-60 H60 V0 Z" fill="#A39D8F" stroke="#2E2117" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-14 0 V-28 Q0 -42 14 -28 V0 Z" fill="#2A2622"/><path d="M0 -74 V-110 L30 -100 L0 -90" fill="#B23A2E" stroke="#2E2117" stroke-width="5"/>`;
    map.appendChild(fortG);
    if (R.fwd(ctx)) { R.popIn(fortG, 200); R.popIn(pin, 500); }
    R.app.ui.setLabels([
      { text: 'Fort Pillar', x: 900, y: 640, toX: 720, toY: 720 },
      { text: 'Dapitan', x: 1320, y: 300, toX: 1060, toY: 300 }
    ]);
  }

  /* ---------- letters: chat, one message per beat ---------- */
  let chat = null;
  function lettersEnter(ctx) {
    const f = R.frame(ctx, null);
    const box = R.h('div', 'chat'); R.place(box, 420, 196, 1080, 620); f.appendChild(box);
    const top = R.h('div', 'chat-top');
    const pa = head(R.castMember('pastells'), '72 28 96 96'), ri = head(R.getArt('rizal_bust'), '270 175 270 270');
    const left = R.h('div', 'chat-who'); left.append(Object.assign(R.h('span', 'chat-ava'), {}), R.h('b', '', 'Fr. Pastells, S.J.'));
    left.firstChild.appendChild(pa);
    const right = R.h('div', 'chat-who right'); right.append(R.h('b', '', 'Dr. Jose Rizal'), R.h('span', 'chat-ava'));
    right.lastChild.appendChild(ri);
    top.append(left, R.h('span', 'chat-vs', 'vs'), right);
    const list = R.h('div', 'chat-list');
    box.append(top, list);
    chat = { list, msgs: step('letters').extra.chat, n: 0 };
    showMsgs(R.fwd(ctx) ? 0 : chat.msgs.length, false);
    R.app.ui.setLabels([]);
  }
  function showMsgs(n, animate) {
    const { list, msgs } = chat;
    while (list.children.length > n) list.lastChild.remove();
    while (list.children.length < n) {
      const [who, text] = msgs[list.children.length];
      const m = R.h('div', 'chat-msg ' + who, text); list.appendChild(m);
      if (animate) R.anim(m, [{ opacity: 0, transform: `translateY(20px) scale(.96)` }, { opacity: 1, transform: 'none' }], { duration: 380 });
    }
    chat.n = n;
  }

  /* ---------- friendship: stern → smile ---------- */
  let friend = null;
  function friendshipEnter(ctx) {
    const f = R.frame(ctx, 'dapitan_village');
    const rizal = R.sprite(f, R.getArt('rizal_figure'), 770, 500, 200, 400);
    const wrap = R.h('div', 'carnicero'); R.place(wrap, 1000, 480, 190, 437); f.appendChild(wrap);
    friend = { wrap, smiling: false };
    setMood(R.fwd(ctx) ? 'stern' : 'smile', false);
    R.app.ui.setLabels([{ text: 'Capt. Carnicero', x: 1240, y: 430, toX: 1120, toY: 520 }]);
  }
  function setMood(m, animate) {
    const { wrap } = friend; wrap.textContent = ''; wrap.dataset.mood = m;
    const p = R.castMember('carnicero', { mood: m }); p.style.width = '100%'; p.style.height = '100%'; wrap.appendChild(p);
    friend.smiling = m === 'smile';
    if (m === 'smile') {
      const hearts = R.h('div', 'friend-hearts', '♥  ♥'); R.place(hearts, 860, 420); wrap.parentNode.appendChild(hearts);
      if (animate) { R.popIn(hearts); R.anim(wrap, [{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0)' }], { duration: 500 }); }
    } else { const h = wrap.parentNode.querySelector('.friend-hearts'); if (h) h.remove(); }
  }

  /* ---------- lottery: scratch ticket, then split ---------- */
  let lot = null;
  function lotteryEnter(ctx) {
    const f = R.frame(ctx, null);
    const ticket = R.h('div', 'ticket'); R.place(ticket, 640, 200, 900, 420); f.appendChild(ticket);
    ticket.innerHTML = `<div class="t-head">LOTTERY · 1892</div><div class="t-no">news by boat from Butuan</div>
      <div class="t-prize"><span class="t-label">2nd PRIZE</span><span class="t-amount">P20,000</span></div>
      <div class="t-foot">Shared by Rizal, Capt. Carnicero &amp; Francisco Equilor</div>`;
    const cv = document.createElement('canvas'); cv.width = 700; cv.height = 170; cv.className = 'scratch';
    ticket.querySelector('.t-prize').appendChild(cv);
    paintCover(cv);
    const piles = R.h('div', 'piles'); R.place(piles, 700, 650, 1100, 200); f.appendChild(piles);
    lot = { f, ticket, cv, piles, revealed: false, split: false };
    enableScratch(cv);
    if (!R.fwd(ctx)) { reveal(false); split(false); }
    else R.anim(ticket, [{ opacity: 0, transform: 'rotate(-6deg) scale(.8)' }, { opacity: 1, transform: 'rotate(-1.5deg) scale(1)' }], { duration: 600 });
    R.app.ui.setLabels([]);
  }
  function paintCover(cv) {
    const c = cv.getContext('2d'); c.globalCompositeOperation = 'source-over';
    const g = c.createLinearGradient(0, 0, cv.width, cv.height); g.addColorStop(0, '#B9B4AA'); g.addColorStop(.5, '#E2DED5'); g.addColorStop(1, '#A8A398');
    c.fillStyle = g; c.fillRect(0, 0, cv.width, cv.height);
    c.fillStyle = 'rgba(46,33,23,.55)'; c.font = '700 44px Georgia'; c.textAlign = 'center'; c.fillText('SCRATCH HERE!', cv.width / 2, cv.height / 2 + 15);
    cv.style.opacity = 1; cv.style.pointerEvents = 'auto';
  }
  function enableScratch(cv) {
    let down = false;
    const scratch = e => {
      const r = cv.getBoundingClientRect(), c = cv.getContext('2d');
      const x = (e.clientX - r.left) / r.width * cv.width, y = (e.clientY - r.top) / r.height * cv.height;
      c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(x, y, 34, 0, Math.PI * 2); c.fill();
    };
    cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); scratch(e); });
    cv.addEventListener('pointermove', e => { if (down) scratch(e); });
    cv.addEventListener('pointerup', () => {
      down = false;
      const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let clear = 0;
      for (let i = 3; i < d.length; i += 64) if (d[i] < 40) clear++;
      if (clear / (d.length / 64) >= .4) reveal(true);
    });
  }
  function reveal(animate) {
    if (!lot || lot.revealed) return false;
    lot.revealed = true; lot.ticket.classList.add('revealed'); lot.cv.style.pointerEvents = 'none';
    if (animate) R.anim(lot.cv, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }); else lot.cv.style.opacity = 0;
    if (animate) R.anim(lot.ticket.querySelector('.t-amount'), [{ transform: 'scale(.6)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 600, delay: 300 });
    return true;
  }
  function unreveal() { lot.revealed = false; lot.ticket.classList.remove('revealed'); paintCover(lot.cv); }
  function split(animate) {
    if (!lot || lot.split) return false;
    lot.split = true;
    step('lottery').extra.split.forEach(([amt, who], i) => {
      const p = R.h('div', 'coin-pile');
      const coins = document.createElementNS(NS, 'svg'); coins.setAttribute('viewBox', '0 0 160 110');
      const n = [5, 2, 4][i]; let s = '';
      for (let k = 0; k < n; k++) s += `<ellipse cx="80" cy="${92 - k * 14}" rx="54" ry="16" fill="#E8C25A" stroke="#2E2117" stroke-width="5"/><path d="M40 ${88 - k * 14} Q80 ${98 - k * 14} 120 ${88 - k * 14}" fill="none" stroke="#B88B23" stroke-width="3"/>`;
      coins.innerHTML = s; p.appendChild(coins);
      p.append(R.h('b', '', amt), R.h('span', '', who));
      lot.piles.appendChild(p);
      if (animate) R.anim(p, [{ opacity: 0, transform: 'translateY(-160px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay: i * 180, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    });
    return true;
  }
  function unsplit() { lot.split = false; lot.piles.textContent = ''; }

  R.registerScene('m2', {
    steps: {
      fort: { enter: fort },
      voyage: { enter: voyageEnter, advance: () => showPanel(true), retreat() { if (voyage && voyage.shown) { voyage.shown = false; voyage.panel.style.opacity = 0; return true; } return false; }, exit() { voyage = null; } },
      offer: { enter: offer },
      why: { enter: why },
      letters: {
        enter: lettersEnter,
        advance() { if (chat && chat.n < chat.msgs.length) { showMsgs(chat.n + 1, true); return true; } return false; },
        retreat() { if (chat && chat.n > 0) { showMsgs(chat.n - 1, false); return true; } return false; },
        exit() { chat = null; }
      },
      friendship: {
        enter: friendshipEnter,
        advance() { if (friend && !friend.smiling) { setMood('smile', true); return true; } return false; },
        retreat() { if (friend && friend.smiling) { setMood('stern', false); return true; } return false; },
        exit() { friend = null; }
      },
      lottery: {
        enter: lotteryEnter,
        advance() { if (!lot) return false; if (!lot.revealed) return reveal(true); if (!lot.split) return split(true); return false; },
        retreat() { if (!lot) return false; if (lot.split) { unsplit(); return true; } if (lot.revealed) { unreveal(); return true; } return false; },
        exit() { lot = null; }
      }
    }
  });
})(globalThis.Report = globalThis.Report || {});
