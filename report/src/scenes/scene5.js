/* Scene 5 — Closing: the stamped passport, then thank-you. */
(function (R) {
  function passport(ctx) {
    const f = R.frame(ctx, null);
    const book = R.h('div', 'passport-book'); R.place(book, 360, 190, 1200, 620); f.appendChild(book);
    const left = R.h('div', 'pb-page pb-left');
    left.innerHTML = '<span class="pb-title">PASSPORT</span><span class="pb-sub">Manila → Dapitan → Manila</span><span class="pb-years">1892 – 1896</span>';
    const bust = R.getArt('rizal_bust'); bust.classList.add('pb-photo'); left.appendChild(bust);
    R.setOpacity(R.part(bust, 'mouth-calm'), 0); R.setOpacity(R.part(bust, 'mouth-smile'), 1);
    const right = R.h('div', 'pb-page pb-right');
    for (let n = 1; n <= 4; n++) {
      const st = R.stamp('stamp-' + n);
      const earned = !!document.querySelector('.passport .s' + n + '.done');
      st.classList.toggle('earned', earned);
      st.style.opacity = earned ? 1 : .14;
      R.place(st, 40 + ((n - 1) % 2) * 270, 30 + Math.floor((n - 1) / 2) * 270, 250, 250);
      st.style.position = 'absolute'; right.appendChild(st);
      if (earned && R.fwd(ctx)) R.anim(st, [{ opacity: 0, transform: 'scale(2) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 360, delay: 300 + n * 260, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    }
    book.append(left, right);
    const qz = R.quizTeams && R.quizTeams();
    if (qz && qz.on) { const sc = R.h('div', 'team-score', `Left ${qz.L} · Right ${qz.R}`); R.place(sc, 760, 840, 400); f.appendChild(sc); }
    R.app.ui.setLabels([]);
  }

  function thanks(ctx) {
    const f = R.frame(ctx, null);
    const burst = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); burst.setAttribute('viewBox', '-960 -540 1920 1080'); burst.classList.add('full');
    let rays = ''; for (let i = 0; i < 24; i++) rays += `<path d="M0 0 L-60 -1200 L60 -1200 Z" fill="#C98A1B" opacity=".08" transform="rotate(${i * 15})"/>`;
    burst.innerHTML = rays; R.place(burst, 0, 40, 1920, 1080); f.appendChild(burst);
    const bust = R.sprite(f, R.getArt('rizal_bust'), 1160, 250, 460, 587);
    R.setOpacity(R.part(bust, 'mouth-calm'), 0); R.setOpacity(R.part(bust, 'mouth-smile'), 1);
    const card = R.h('div', 'thanks-card');
    const names = (R.CONTENT.members || []).map((m, i) => `<li><i style="background:${['#9E2A2B', '#1F4E79', '#3E6B3A', '#C98A1B'][i]}"></i>${m}</li>`).join('');
    card.innerHTML = `<b>Maraming salamat!</b><ul>${names}</ul><span class="cite">${R.CONTENT.citation}</span>`;
    R.place(card, 240, 230, 820); f.appendChild(card);
    if (R.fwd(ctx)) { R.slideIn(card, -60, 0, 0, 600); R.slideIn(bust, 80, 0, 150, 700); }
    R.app.ui.setLabels([]);
  }

  R.registerScene('closing', { steps: { passport: { enter: passport }, thanks: { enter: thanks } } });
})(globalThis.Report = globalThis.Report || {});
