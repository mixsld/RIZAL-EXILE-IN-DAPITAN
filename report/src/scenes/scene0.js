/* Scene 0 — Opening: sealed letter → letter opens → journey map (also the M hub). */
(function (R) {
  const NS = 'http://www.w3.org/2000/svg';

  function envelope(f, opened, animate) {
    const env = R.sprite(f, R.getArt('envelope_seal'), 520, 250, 880, 640);
    if (opened) {
      env.setAttribute('viewBox', '60 -300 880 1000'); R.place(env, 620, 60, 880, 1000);
      const flapEl = R.part(env, 'flap'); env.insertBefore(flapEl, R.part(env, 'letter'));   // open flap sits behind the letter
      R.setOpacity(R.part(env, 'seal'), 0);
      R.part(env, 'flap').setAttribute('transform', 'translate(0 352) scale(1 -1) translate(0 -352)');
      const letter = R.part(env, 'letter'); R.setOpacity(letter, 1); letter.setAttribute('transform', 'translate(0 -330)');
      if (animate) {
        const crack = R.part(env, 'seal-crack'); R.setOpacity(crack, 1);
        R.anim(R.part(env, 'seal'), [{ opacity: 1, transform: 'translate(500px,440px) scale(1)' }, { opacity: 1, transform: 'translate(500px,440px) scale(1.12)', offset: .3 },
          { opacity: 0, transform: 'translate(500px,700px) scale(.8) rotate(40deg)' }], { duration: 700 });
        R.anim(R.part(env, 'flap'), [{ transform: 'translate(0,0) scale(1,1)' }, { transform: 'translate(0,352px) scale(1,-1)' }], { duration: 600, delay: 350 });
        R.anim(letter, [{ transform: 'translate(0px,0px)', opacity: 0 }, { transform: 'translate(0px,-330px)', opacity: 1 }], { duration: 800, delay: 650 });
        const t = R.part(env, 'letter-text'), full = t.textContent; t.textContent = '';
        let i = 0; const timer = setInterval(() => { t.textContent = full.slice(0, ++i); if (i >= full.length) clearInterval(timer); }, 55);
        const done = R.app.engine.busy(() => { clearInterval(timer); t.textContent = full; });
        setTimeout(done, 1500);
      }
    } else if (animate) {
      R.anim(env, [{ transform: 'translateY(-60px) rotate(-3deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 800 });
    }
    R.loop(env, [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }], { duration: 2600 });
    return env;
  }

  function mapView(ctx) {
    const f = R.frame(ctx, null);
    const map = R.getArt('journey_map'); map.classList.add('full'); R.place(map, 0, 0, 1920, 1080); f.appendChild(map);
    // reveal mask for the dotted route
    const route = R.part(map, 'route');
    const defs = map.querySelector('defs');
    const mask = document.createElementNS(NS, 'mask'); mask.setAttribute('id', 'journey_map-reveal');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    const mp = document.createElementNS(NS, 'path');
    mp.setAttribute('id', 'route-reveal'); mp.setAttribute('d', route.getAttribute('d'));
    mp.setAttribute('fill', 'none'); mp.setAttribute('stroke', '#fff'); mp.setAttribute('stroke-width', '40'); mp.setAttribute('stroke-linecap', 'round');
    mask.appendChild(mp); defs.appendChild(mask);
    route.setAttribute('mask', 'url(#journey_map-reveal)');
    R.part(map, 'route-shadow').setAttribute('mask', 'url(#journey_map-reveal)');
    const L = route.getTotalLength ? route.getTotalLength() : 1200;
    mp.style.strokeDasharray = L; mp.style.strokeDashoffset = 0;
    // stops: clickable, with ✓ for finished members
    for (let n = 1; n <= 4; n++) {
      const s = R.part(map, 'stop-' + n);
      s.style.cursor = 'pointer';
      s.addEventListener('click', () => R.app.engine.goToId('m' + n, 'title'));
      if (R.app.ui.passportCount && document.querySelector('.passport .s' + n + '.done')) {
        const ck = document.createElementNS(NS, 'g');
        ck.innerHTML = '<circle cx="24" cy="-22" r="16" fill="#3E6B3A" stroke="#2E2117" stroke-width="4"/><path d="M16 -22 l6 6 l10 -12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
        s.appendChild(ck);
      }
    }
    if (R.fwd(ctx)) {
      R.anim(mp, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1400, easing: 'ease-in-out' });
      R.popIn(R.part(map, 'pin-manila'), 0); R.popIn(R.part(map, 'pin-dapitan'), 1200);
      [1, 2, 3, 4].forEach(n => R.popIn(R.part(map, 'stop-' + n), 300 + n * 200));
    }
    R.app.ui.setLabels([
      { text: 'Manila', x: 700, y: 300, toX: 860, toY: 345, anchor: 'end' },
      { text: 'Dapitan', x: 1240, y: 900, toX: 1050, toY: 745 }
    ]);
  }

  R.registerScene('opening', {
    steps: {
      cover: {
        enter(ctx) {
          const f = R.frame(ctx, null);
          const burst = document.createElementNS(NS, 'svg'); burst.setAttribute('viewBox', '-960 -540 1920 1080'); burst.classList.add('full');
          let rays = ''; for (let i = 0; i < 24; i++) rays += `<path d="M0 0 L-60 -1200 L60 -1200 Z" fill="#9E2A2B" opacity=".07" transform="rotate(${i * 15})"/>`;
          burst.innerHTML = rays; R.place(burst, 0, 60, 1920, 1080); f.appendChild(burst);
          envelope(f, false, R.fwd(ctx) || ctx.direction === 'jump');
        }
      },
      letter: {
        enter(ctx) {
          const f = R.frame(ctx, null);
          envelope(f, true, R.fwd(ctx));
        }
      },
      map: { enter: mapView }
    }
  });
})(globalThis.Report = globalThis.Report || {});
