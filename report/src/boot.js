/* Boot: wire content + engine + UI + keys. Exposes Report.app. */
(function (R) {
  function boot() {
    const params = new URLSearchParams(location.search);
    const root = document.getElementById('app');
    const handlers = R.buildHandlers(R.CONTENT);
    const engine = R.createEngine({ content: R.CONTENT, handlers, quizHandler: R.quizHandler || null, bonus: params.has('bonus') });
    R.app = { engine, content: R.CONTENT, params };
    const ui = R.createUI(root, engine, R.CONTENT);
    if (params.has('still')) document.body.classList.add('still');
    R.app.ui = ui;
    R.app.relint = () => { const issues = R.validateContent(R.CONTENT); ui.setLint(params.has('rehearse') ? issues : []); return issues; };
    const issues = R.app.relint();
    if (params.has('rehearse')) issues.forEach(i => console.warn('[text limit]', i.sceneId, i.stepId, i.rule, i.detail));

    engine.onBefore(cur => ui.showStep(cur));

    function act(a) {
      const cur = engine.current();
      switch (a) {
        case 'next': if (cur.isQuiz && R.quizGate && R.quizGate()) break; engine.next(); break;
        case 'prev': engine.prev(); break;
        case 'map': engine.goToId('opening', 'map'); break;
        case 'jump1': case 'jump2': case 'jump3': case 'jump4': engine.goToId('m' + a.slice(-1), 'title'); break;
        case 'notes': ui.toggleNotes(); break;
        case 'captions': ui.toggleCaptions(); break;
        case 'print': ui.printCues(); break;
        case 'bonus': engine.setBonus(!engine.bonus()); ui.toast('Bonus steps ' + (engine.bonus() ? 'ON' : 'OFF'), 1200); break;
        case 'fullscreen':
          if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
          break;
        case 'reset': ui.resetPassport(); R.quizReset && R.quizReset(); ui.toast('Passport and scores reset', 1200); break;
        default:
          if (a.startsWith('answer') && cur.isQuiz && R.quizAnswer) R.quizAnswer(a.slice(-1));
      }
    }
    R.app.act = act;

    /* ---- touch: buttons + swipe ---- */
    const isTouch = params.has('touch') || (window.matchMedia && matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
    if (isTouch) document.body.classList.add('touch');
    ui.nav.addEventListener('click', e => { const b = e.target.closest('button[data-act]'); if (b) act(b.dataset.act); });
    const NO_SWIPE = '.officer-card, .scratch, .day-slider, input, button, .touch-nav, .rotate-hint, .notes-panel';
    let sw = null;
    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' || e.target.closest(NO_SWIPE)) { sw = null; return; }
      sw = { x: e.clientX, y: e.clientY, t: Date.now() };
    }, true);
    document.addEventListener('pointerup', e => {
      if (!sw) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (engine.isBusy()) engine.finishAnimations();
        act(dx < 0 ? 'next' : 'prev');
      }
    }, true);
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const a = R.routeKey(e.key, { isQuiz: engine.current().isQuiz });
      if (!a) return;
      e.preventDefault();
      act(a);
    });
    engine.start();
    if (params.get('at')) {
      const [a, b, beats] = params.get('at').split('.'); engine.goToId(a, b || null);
      for (let i = 0; i < (+beats || 0); i++) { engine.finishAnimations(); engine.next(); }
      engine.finishAnimations();
    }
    if (!params.has('still')) ui.toast('Ready ✓ (offline) — → next · ← back · N notes · T captions · M map');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(globalThis.Report = globalThis.Report || {});
