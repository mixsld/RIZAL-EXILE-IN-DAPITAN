/* Beats: a handler may add advance(ctx)/retreat(ctx) returning true to consume →/← inside one step.
   Step engine: a flat list of steps (bonus-filtered) plus 2 virtual quiz screens per member.
   Handler contract: handlers[sceneId][stepId] = { enter(ctx), exit(ctx) }
     enter must draw the COMPLETE state of its step (animate only when ctx.direction === 'forward'),
     exit clears transient things. handlers[sceneId].__mount(ctx) / __unmount(ctx) run on scene change.
   handlers['*'][stepId] is a fallback (used for the shared member title cards). */
(function (R) {
  function createEngine({ content, handlers = {}, quizHandler = null, bonus = false }) {
    let bonusOn = !!bonus, list = [], idx = 0, finishers = [];
    const listeners = [], beforeListeners = [];

    function build() {
      list = [];
      content.scenes.forEach((scene, sceneIdx) => {
        scene.steps.forEach((step, stepIdx) => {
          if (!step.bonus || bonusOn) list.push({ sceneIdx, stepIdx, scene, step, isQuiz: false, quizIdx: null, question: null });
        });
        (scene.quiz || []).forEach((question, quizIdx) =>
          list.push({ sceneIdx, stepIdx: null, scene, step: null, isQuiz: true, quizIdx, question }));
      });
    }
    build();

    const fn = (o, k) => (o && typeof o[k] === 'function') ? o[k] : null;
    function handlerFor(en) {
      if (en.isQuiz) return quizHandler;
      const own = handlers[en.scene.id] && handlers[en.scene.id][en.step.id];
      if (own && (fn(own, 'enter') || fn(own, 'exit'))) return own;
      return handlers['*'] && handlers['*'][en.step.id] || null;
    }
    const ctx = (en, direction) => ({ engine: api, entry: en, scene: en.scene, step: en.step,
      question: en.question, quizIdx: en.quizIdx, direction });

    function finishAnimations() {
      const f = finishers; finishers = [];
      f.forEach(x => { try { x(); } catch (e) { console.error(e); } });
    }
    function busy(onFinish) {
      const token = { onFinish: onFinish || (() => {}) };
      const wrapped = () => token.onFinish();
      finishers.push(wrapped);
      return function done() { finishers = finishers.filter(x => x !== wrapped); };
    }

    function leave(dir, nextEn) {
      const en = list[idx];
      finishAnimations();
      const h = handlerFor(en);
      if (fn(h, 'exit')) h.exit(ctx(en, dir));
      if (!nextEn || nextEn.scene !== en.scene) {
        const un = fn(handlers[en.scene.id], '__unmount');
        if (un) un(ctx(en, dir));
      }
    }
    function arrive(dir, prevEn) {
      const en = list[idx];
      if (!prevEn || prevEn.scene !== en.scene) {
        const m = fn(handlers[en.scene.id], '__mount');
        if (m) m(ctx(en, dir));
      }
      beforeListeners.forEach(l => l(api.current(), dir));
      const h = handlerFor(en);
      if (fn(h, 'enter')) h.enter(ctx(en, dir));
      listeners.forEach(l => l(api.current(), dir));
    }
    function move(newIdx, dir) {
      if (newIdx < 0 || newIdx >= list.length || newIdx === idx) return false;
      const prev = list[idx];
      leave(dir, list[newIdx]);
      idx = newIdx;
      arrive(dir, prev);
      return true;
    }

    const api = {
      start() { idx = 0; arrive('jump', null); },
      next() {
        if (finishers.length) { finishAnimations(); return false; }
        const en = list[idx], h = handlerFor(en);
        if (fn(h, 'advance') && h.advance(ctx(en, 'forward'))) return true;
        return move(idx + 1, 'forward');
      },
      prev() {
        if (finishers.length) finishAnimations();
        const en = list[idx], h = handlerFor(en);
        if (fn(h, 'retreat') && h.retreat(ctx(en, 'back'))) return true;
        return move(idx - 1, 'back');
      },
      goTo(sceneIdx, stepIdx = 0) {
        const inScene = list.map((e, i) => [e, i]).filter(([e]) => e.sceneIdx === sceneIdx);
        if (!inScene.length) return false;
        const target = inScene[Math.min(stepIdx, inScene.length - 1)][1];
        if (target === idx) return false;
        return move(target, 'jump');
      },
      goToId(sceneId, stepId = null) {
        const i = list.findIndex(e => e.scene.id === sceneId &&
          (stepId === null || (e.isQuiz ? 'quiz' + e.quizIdx === stepId : e.step.id === stepId)));
        return i >= 0 ? move(i, 'jump') : false;
      },
      current() { return Object.assign({}, list[idx]); },
      setBonus(on) {
        const cur = list[idx];
        bonusOn = !!on; build();
        let i = list.findIndex(e => e.scene === cur.scene && e.step === cur.step && e.quizIdx === cur.quizIdx);
        if (i < 0) i = list.findIndex(e => e.sceneIdx === cur.sceneIdx && (e.isQuiz || e.stepIdx > cur.stepIdx));
        idx = Math.max(0, i);
        if (i < 0 || list[idx].step !== cur.step) arrive('jump', cur);
        listeners.forEach(l => l(api.current(), 'jump'));
      },
      bonus() { return bonusOn; },
      onChange(f) { listeners.push(f); },
      onBefore(f) { beforeListeners.push(f); },
      busy, finishAnimations,
      isBusy() { return finishers.length > 0; },
      progress() { return list.length > 1 ? idx / (list.length - 1) : 1; },
      entries() { return list.slice(); }
    };
    return api;
  }

  const KEYMAP = {
    ArrowRight: 'next', ' ': 'next', PageDown: 'next', Enter: 'next', ArrowDown: 'next',
    ArrowLeft: 'prev', PageUp: 'prev', ArrowUp: 'prev', Backspace: 'prev',
    m: 'map', 1: 'jump1', 2: 'jump2', 3: 'jump3', 4: 'jump4',
    n: 'notes', t: 'captions', p: 'print', b: 'bonus', f: 'fullscreen', r: 'reset'
  };
  function routeKey(key, state = {}) {
    if (key == null) return null;
    const k = key.length === 1 ? key.toLowerCase() : key;
    if (state.isQuiz && ['a', 'b', 'c', 'd'].includes(k)) return 'answer' + k.toUpperCase();
    return KEYMAP[k] || null;
  }

  R.createEngine = createEngine;
  R.routeKey = routeKey;
})(globalThis.Report = globalThis.Report || {});
if (typeof module !== 'undefined') module.exports = globalThis.Report;
