/* Scene 1 — Member 1: Return to Manila & La Liga Filipina (p. 101). */
(function (R) {
  const NS = 'http://www.w3.org/2000/svg';
  const step = id => R.CONTENT.scenes.find(s => s.id === 'm1').steps.find(s => s.id === id);

  /* ---------- arrival ---------- */
  function arrival(ctx) {
    const f = R.frame(ctx, 'manila_harbor');
    const ship = R.sprite(f, R.getArt('steamer'), 1080, 250, 900, 646);
    R.part(ship, 'name-plate').textContent = 'DON JUAN';
    R.loop(R.part(ship, 'ship'), [{ transform: 'translateY(0)' }, { transform: 'translateY(5px)' }], { duration: 1800 });
    R.loop(R.part(ship, 'smoke'), [{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(-14px,-10px)', opacity: .85 }], { duration: 2200 });
    const rizal = R.sprite(f, R.getArt('rizal_figure'), 960, 458, 92, 182);
    const lucia = R.sprite(f, R.castMember('lucia'), 868, 455, 82, 188);
    R.flipX(rizal);
    const crowd = [['townsman', 570], ['townswoman', 650], ['townsman', 730]].map(([c, x], i) =>
      R.sprite(f, R.castMember(c, i === 1 ? {} : { extra: ['wave'] }), x, 486, 70, 162));
    const marks = [620, 700, 780].map(x => { const m = R.h('div', 'pop-mark', '!'); R.place(m, x, 410); f.appendChild(m); return m; });
    if (R.fwd(ctx)) {
      R.anim(ship, [{ transform: 'translateX(700px)' }, { transform: 'translateX(0)' }], { duration: 1400, easing: 'cubic-bezier(.2,.7,.3,1)' });
      R.fadeIn(rizal, 1100); R.fadeIn(lucia, 1100);
      marks.forEach((m, i) => R.popIn(m, 1200 + i * 120));
    }
    R.app.ui.setLabels([
      { text: 'Don Juan', x: 1700, y: 610, toX: 1600, toY: 700 },
      { text: 'Hotel Oriente', x: 110, y: 262, toX: 200, toY: 345 }
    ]);
  }

  /* ---------- pardon ---------- */
  function pardon(ctx) {
    const f = R.frame(ctx, 'malacanang_door');
    const art = f.querySelector('svg');
    const L = R.part(art, 'door-left'), Rt = R.part(art, 'door-right');
    [L, Rt].forEach(d => { d.style.transformBox = 'view-box'; });
    L.style.transformOrigin = '700px 600px'; Rt.style.transformOrigin = '1220px 600px';
    const open = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.55)' }];
    const rizal = R.sprite(f, R.getArt('rizal_figure'), 760, 610, 130, 254);
    const bubble = R.bubble(f, 'Your Excellency, please pardon my family.', 880, 470, 420);
    if (R.fwd(ctx)) {
      R.anim(rizal, [{ transform: 'translateX(-420px)' }, { transform: 'translateX(0)' }], { duration: 1200 });
      R.anim(L, open, { duration: 900, delay: 500 }); R.anim(Rt, open, { duration: 900, delay: 500 });
      R.popIn(bubble, 1100);
    } else { L.style.transform = Rt.style.transform = 'scaleX(.55)'; }
    R.app.ui.setLabels([{ text: 'Malacañang', x: 1480, y: 170, toX: 1300, toY: 230 }]);
  }

  /* ---------- north trip (bonus): schematic rail line ---------- */
  function north(ctx) {
    const f = R.frame(ctx, null);
    const towns = ['Tutuban', 'Malolos', 'San Fernando', 'Tarlac', 'Bacolor'];
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.classList.add('full');
    const xs = towns.map((_, i) => 260 + i * 350);
    let s = `<rect width="1920" height="1080" fill="#EFE3C8"/>
      <path d="M0 760 C300 700 600 720 960 700 C1300 680 1600 700 1920 660 L1920 1080 L0 1080 Z" fill="#9CBF7A" stroke="#2E2117" stroke-width="6"/>
      <path d="M120 640 H1800" stroke="#6E4520" stroke-width="26"/><path d="M120 640 H1800" stroke="#2E2117" stroke-width="6" stroke-dasharray="6 34"/>
      <path d="M120 626 H1800 M120 654 H1800" stroke="#2E2117" stroke-width="5"/>`;
    xs.forEach((x, i) => {
      s += `<g class="station" transform="translate(${x} 640)"><path d="M-70 -40 V-150 H70 V-40 Z" fill="#E9D3A0" stroke="#2E2117" stroke-width="6" stroke-linejoin="round"/>
        <path d="M-90 -146 L0 -206 L90 -146 Z" fill="#B5523B" stroke="#2E2117" stroke-width="6" stroke-linejoin="round"/>
        <path d="M-20 -40 V-96 H20 V-40" fill="#7A5230" stroke="#2E2117" stroke-width="5"/>
        <text y="120" text-anchor="middle" font-family="'Segoe Print','Ink Free',cursive" font-size="34" fill="#2E2117" stroke="#FFF8EA" stroke-width="8" paint-order="stroke" stroke-linejoin="round">${towns[i]}</text>
        <g class="heart" opacity="0"><path d="M0 -236 C-30 -270 -64 -236 0 -196 C64 -236 30 -270 0 -236 Z" fill="#9E2A2B" stroke="#2E2117" stroke-width="5"/></g></g>`;
    });
    s += `<g id="train" transform="translate(${xs[0] - 80} 600)">
      <path d="M0 0 H200 V-90 H140 V-130 H90 V-90 H0 Z" fill="#2E3A4A" stroke="#2E2117" stroke-width="6" stroke-linejoin="round"/>
      <path d="M150 -130 V-170 H180 V-130" fill="#C0392B" stroke="#2E2117" stroke-width="5"/>
      <rect x="20" y="-70" width="50" height="40" fill="#F4B942" stroke="#2E2117" stroke-width="5"/>
      <circle cx="40" cy="20" r="22" fill="#9E2A2B" stroke="#2E2117" stroke-width="5"/><circle cx="150" cy="20" r="22" fill="#9E2A2B" stroke="#2E2117" stroke-width="5"/></g>`;
    svg.innerHTML = s; R.place(svg, 0, 0, 1920, 1080); f.appendChild(svg);
    const train = svg.querySelector('#train'), hearts = [...svg.querySelectorAll('.heart')];
    if (R.fwd(ctx)) {
      R.anim(train, [{ transform: `translate(${xs[0] - 80}px,600px)` }, { transform: `translate(${xs[4] + 50}px,600px)` }], { duration: 1500, easing: 'ease-in-out' });
      hearts.forEach((h, i) => setTimeout(() => { h.setAttribute('opacity', 1); R.popIn(h); }, 200 + i * 300));
      const done = R.app.engine.busy(() => hearts.forEach(h => h.setAttribute('opacity', 1))); setTimeout(done, 1600);
    } else { train.setAttribute('transform', `translate(${xs[4] + 50} 600)`); hearts.forEach(h => h.setAttribute('opacity', 1)); }
    R.app.ui.setLabels([]);
  }

  /* ---------- the secret meeting: windows light one per beat ---------- */
  let lit = 0, wins = [];
  function lightTo(n, animate) {
    wins.forEach((w, i) => {
      const on = i < n, g = w.querySelector('[data-glow]');
      w.classList.toggle('lit', on); g.setAttribute('opacity', on ? 1 : 0);
      w.querySelectorAll('.who').forEach(x => x.setAttribute('opacity', on ? 1 : 0));
      if (on && animate && i === n - 1) { R.anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 450 }); }
    });
    lit = n;
  }
  function meeting(ctx) {
    const f = R.frame(ctx, 'tondo_house_night', { dark: true });
    const art = f.querySelector('svg');
    const names = step('meeting').extra.windows;
    wins = names.map((nm, i) => {
      const w = R.part(art, 'win-' + (i + 1));
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'who'); g.setAttribute('opacity', 0);
      g.innerHTML = `<path d="M80 74 C56 74 46 86 42 100 H118 C114 86 104 74 80 74 Z" fill="#3A2414"/>
        <circle cx="80" cy="50" r="22" fill="#3A2414"/>
        <rect x="-6" y="96" width="172" height="46" rx="8" fill="#FFFDF6" stroke="#2E2117" stroke-width="3"/>
        <text x="80" y="128" stroke="none" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${nm.length > 10 ? 21 : 27}" fill="#2E2117">${nm}</text>`;
      w.appendChild(g);
      return w;
    });
    lightTo(R.fwd(ctx) ? 0 : names.length, false);
    R.app.ui.setLabels([]);
  }

  /* ---------- officers: drag the names to their posts ---------- */
  let board = null;
  function officers(ctx) {
    const f = R.frame(ctx, null);
    const posts = step('officers').extra.posts;
    const paper = R.h('div', 'ledger'); R.place(paper, 140, 200, 1000, 560); f.appendChild(paper);
    paper.appendChild(R.h('div', 'ledger-title', 'La Liga Filipina — Officers, July 3, 1892'));
    const slots = posts.map(([post]) => {
      const row = R.h('div', 'ledger-row'); row.appendChild(R.h('span', 'ledger-post', post));
      const slot = R.h('span', 'ledger-slot'); slot.dataset.post = post; row.appendChild(slot); paper.appendChild(row); return slot;
    });
    const order = [2, 0, 3, 1];  // shuffled card order
    const cards = order.map((k, i) => {
      const [post, name] = posts[k];
      const c = R.h('div', 'officer-card'); c.dataset.name = name; c.dataset.post = post;
      c.append(R.h('span', 'officer-ico', name.split(' ').map(w => w[0]).join('').slice(0, 2)), R.h('span', '', name));
      R.place(c, 1260, 260 + i * 120); c.dataset.home = `1260,${260 + i * 120}`;
      f.appendChild(c); enableDrag(c, slots); return c;
    });
    board = { f, slots, cards, posts };
    if (!R.fwd(ctx)) fillAll(false); else cards.forEach((c, i) => R.popIn(c, 200 + i * 120));
    R.app.ui.setLabels([]);
  }
  function snap(card, slot, animate) {
    const r = slot.getBoundingClientRect(), fr = board.f.getBoundingClientRect(), s = R.app.ui.scale();
    R.place(card, (r.left - fr.left) / s + 6, (r.top - fr.top) / s + 4);
    card.classList.add('placed'); slot.classList.add('filled');
    if (animate) R.popIn(card);
  }
  function drop(name, post) {
    if (!board) return false;
    const card = board.cards.find(c => c.dataset.name === name), slot = board.slots.find(s => s.dataset.post === post);
    if (!card || !slot) return false;
    if (card.dataset.post !== post) {
      const [x, y] = card.dataset.home.split(',').map(Number); R.place(card, x, y);
      R.anim(card, [{ transform: 'translateX(0)' }, { transform: 'translateX(-16px)' }, { transform: 'translateX(16px)' }, { transform: 'translateX(0)' }], { duration: 360 });
      return false;
    }
    snap(card, slot, true); return true;
  }
  function fillAll(animate) { board.cards.forEach(c => { if (!c.classList.contains('placed')) snap(c, board.slots.find(s => s.dataset.post === c.dataset.post), animate); }); }
  function enableDrag(card, slots) {
    card.addEventListener('pointerdown', e => {
      if (card.classList.contains('placed')) return;
      e.preventDefault(); card.setPointerCapture(e.pointerId); card.classList.add('dragging');
      const s = R.app.ui.scale(), sx = e.clientX, sy = e.clientY, x0 = parseFloat(card.style.left), y0 = parseFloat(card.style.top);
      const move = ev => R.place(card, x0 + (ev.clientX - sx) / s, y0 + (ev.clientY - sy) / s);
      const up = ev => {
        card.removeEventListener('pointermove', move); card.removeEventListener('pointerup', up); card.classList.remove('dragging');
        const hit = slots.find(sl => { const r = sl.getBoundingClientRect(); return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom; });
        if (hit) drop(card.dataset.name, hit.dataset.post);
        else { const [x, y] = card.dataset.home.split(',').map(Number); R.place(card, x, y); }
      };
      card.addEventListener('pointermove', move); card.addEventListener('pointerup', up);
    });
  }

  /* ---------- luggage: click a pillow ---------- */
  let revealed = false, luggageF = null;
  function revealHandbills(animate) {
    if (revealed || !luggageF) return false;
    revealed = true;
    const art = luggageF.querySelector('svg'), hb = R.part(art, 'handbills');
    hb.setAttribute('opacity', 1);
    const ring = luggageF.querySelector('.hint-ring'); if (ring) ring.remove();
    const st = R.stamp('stamp-arrested'); R.place(st, 1180, 160, 600, 280); luggageF.appendChild(st);
    if (animate) {
      R.anim(hb, [{ transform: 'translateY(120px)', opacity: 0 }, { transform: 'translateY(-60px)', opacity: 1 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 800 });
      R.anim(st, [{ opacity: 0, transform: 'scale(2.2) rotate(-10deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 380, delay: 850, easing: 'cubic-bezier(.3,1.6,.5,1)' });
      R.anim(luggageF, [{ transform: 'translate(0,0)' }, { transform: 'translate(-6px,4px)' }, { transform: 'translate(5px,-3px)' }, { transform: 'translate(0,0)' }], { duration: 200, delay: 1230 });
    }
    R.app.ui.setLabels([{ text: 'Pobres Frailes', x: 560, y: 260, toX: 840, toY: 400, anchor: 'middle' }]);
    return true;
  }
  function luggage(ctx) {
    revealed = false;
    luggageF = R.frame(ctx, 'pillows_handbills');
    const art = luggageF.querySelector('svg');
    const p1 = R.part(art, 'pillow-1'); p1.style.cursor = 'pointer';
    p1.addEventListener('click', () => revealHandbills(true));
    R.part(art, 'pillow-2').style.cursor = 'pointer';
    R.part(art, 'pillow-2').addEventListener('click', () => revealHandbills(true));
    const lucia = R.sprite(luggageF, R.castMember('lucia', { mood: 'sad', extra: [] }), 1700, 520, 140, 322);
    const ring = R.h('div', 'hint-ring'); R.place(ring, 690, 420, 430, 220); luggageF.appendChild(ring);
    if (!R.fwd(ctx)) revealHandbills(false); else R.app.ui.setLabels([]);
  }

  R.registerScene('m1', {
    steps: {
      arrival: { enter: arrival },
      pardon: { enter: pardon },
      north: { enter: north },
      meeting: {
        enter: meeting,
        advance() { if (lit < wins.length) { lightTo(lit + 1, true); return true; } return false; },
        retreat() { if (lit > 0) { lightTo(lit - 1, false); return true; } return false; }
      },
      officers: {
        enter: officers,
        advance() { if (board && board.cards.some(c => !c.classList.contains('placed'))) { fillAll(true); return true; } return false; },
        exit() { board = null; }
      },
      luggage: {
        enter: luggage,
        advance() { return revealHandbills(true); },
        exit() { luggageF = null; }
      }
    }
  });
  R.scenes.m1.drop = drop;
})(globalThis.Report = globalThis.Report || {});
