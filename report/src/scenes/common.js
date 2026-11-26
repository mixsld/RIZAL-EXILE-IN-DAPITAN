/* Scene registry + shared helpers used by every scene file. */
(function (R) {
  R.scenes = R.scenes || {};
  /* def = { mount(ctx), unmount(ctx), steps: { stepId: { enter(ctx), exit(ctx) } } } */
  R.registerScene = (id, def) => { R.scenes[id] = def; };

  R.reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  /* fresh = draw the step's starting state and animate (forward or jump); back = show the finished state. */
  R.fwd = ctx => ctx.direction !== 'back';

  /* Animate with the Web Animations API. A navigation key finishes it instantly (engine.busy).
     Durations are capped at 1.5 s (design rule). Returns the Animation. */
  R.anim = function (el, frames, opts = {}) {
    if (!el) return null;
    const dur = R.reduced() ? 1 : Math.min(opts.duration || 600, 1500);
    const a = el.animate(frames, { duration: dur, delay: R.reduced() ? 0 : (opts.delay || 0),
      easing: opts.easing || 'cubic-bezier(.22,.8,.26,1)', fill: 'both', iterations: 1 });
    if (R.app.params && R.app.params.has('still')) { try { a.finish(); } catch (e) { /* */ } return a; }
    const done = R.app.engine.busy(() => { try { a.finish(); } catch (e) { /* removed */ } });
    a.finished.then(done, done);
    return a;
  };
  /* Looping ambient motion (smoke, water). Never blocks navigation. */
  R.loop = function (el, frames, opts = {}) {
    if (!el || R.reduced() || (R.app.params && R.app.params.has('still'))) return null;
    return el.animate(frames, { duration: opts.duration || 3000, iterations: Infinity, easing: opts.easing || 'ease-in-out',
      direction: opts.direction || 'alternate', delay: opts.delay || 0 });
  };
  /* CSS transforms replace an SVG transform attribute, so carry the attribute into every keyframe. */
  R.baseTransform = el => {
    const a = el && el.getAttribute && el.getAttribute('transform');
    if (!a) return '';
    return a.replace(/translate\(\s*([-\d.]+)[\s,]+([-\d.]+)\s*\)/g, 'translate($1px,$2px)').replace(/translate\(\s*([-\d.]+)\s*\)/g, 'translate($1px,0px)')
      .replace(/rotate\(\s*([-\d.]+)\s*\)/g, 'rotate($1deg)').replace(/scale\(\s*([-\d.]+)[\s,]+([-\d.]+)\s*\)/g, 'scale($1,$2)') + ' ';
  };
  R.popIn = (el, delay = 0) => { const b = R.baseTransform(el);
    return R.anim(el, [{ opacity: 0, transform: b + 'scale(.6)' }, { opacity: 1, transform: b + 'scale(1.08)', offset: .7 }, { opacity: 1, transform: b + 'scale(1)' }],
      { duration: 520, delay }); };
  R.fadeIn = (el, delay = 0, duration = 500) => R.anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration, delay });
  R.slideIn = (el, dx = 0, dy = 40, delay = 0, duration = 600) => { const b = R.baseTransform(el);
    return R.anim(el, [{ opacity: 0, transform: b + `translate(${dx}px,${dy}px)` }, { opacity: 1, transform: b + 'translate(0px,0px)' }], { duration, delay }); };

  R.h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  R.q = (root, sel) => root.querySelector(sel);
  R.qa = (root, sel) => [...root.querySelectorAll(sel)];
  R.show = (el, on = true) => { if (el) el.style.opacity = on ? 1 : 0; if (el) el.style.visibility = on ? 'visible' : 'hidden'; };

  /* Shared member title card (handlers['*'].title) */
  const titleHandler = {
    enter(ctx) {
      const ui = R.app.ui, sc = ctx.scene;
      ui.sceneLayer.textContent = '';
      ui.titleLayer.textContent = '';
      const wrap = R.h('div', 'title-card');
      const ns = 'http://www.w3.org/2000/svg';
      const burst = document.createElementNS(ns, 'svg');
      burst.setAttribute('viewBox', '-750 -750 1500 1500'); burst.setAttribute('class', 'burst');
      let rays = '';
      for (let i = 0; i < 18; i++) rays += `<path d="M0 0 L-70 -760 L70 -760 Z" fill="${sc.color}" transform="rotate(${i * 20})"/>`;
      burst.innerHTML = rays;
      const card = R.h('div', 'card');
      card.append(R.h('div', 'num', String(sc.member)),
        R.h('div', 'who', (R.CONTENT.members || [])[sc.member - 1] || ''),
        R.h('h1', '', ctx.step.headline), R.h('p', '', ctx.step.caption), R.h('div', 'pages', 'Book ' + sc.pages));
      wrap.append(burst, card);
      ui.titleLayer.appendChild(wrap);
    },
    exit() { R.app.ui.titleLayer.textContent = ''; }
  };

  /* Fallback for steps whose scene code is not written yet: show the step's art. */
  const artOnly = {
    enter(ctx) { const L = R.app.ui.sceneLayer; L.textContent = ''; if (ctx.step.art) L.appendChild(R.art(ctx.step.art)); },
    exit() {}
  };

  R.buildHandlers = function (content) {
    const handlers = { '*': { title: titleHandler } };
    content.scenes.forEach(sc => {
      const def = R.scenes[sc.id] || {};
      const hs = {
        __mount: ctx => { R.app.ui.sceneLayer.textContent = ''; def.mount && def.mount(ctx); },
        __unmount: ctx => { def.unmount && def.unmount(ctx); R.app.ui.sceneLayer.textContent = ''; }
      };
      sc.steps.forEach(st => { if (st.id !== 'title') hs[st.id] = (def.steps && def.steps[st.id]) || artOnly; });
      handlers[sc.id] = hs;
    });
    return handlers;
  };
})(globalThis.Report = globalThis.Report || {});
/* Layout helpers for scene code (stage coordinates are 1920×1080). */
(function (R) {
  R.place = (el, x, y, w, h) => {
    el.style.position = 'absolute'; el.style.left = x + 'px'; el.style.top = y + 'px';
    if (w != null) el.style.width = w + 'px'; if (h != null) el.style.height = h + 'px';
    return el;
  };
  /* Start a fresh step picture: clears the scene layer, returns a full-size container. */
  R.frame = (ctx, bgArt, opts = {}) => {
    const L = R.app.ui.sceneLayer; L.textContent = '';
    R.app.ui.stage.classList.toggle('is-dark', !!opts.dark);
    const f = R.h('div', 'full frame'); R.place(f, 0, 0, 1920, 1080);
    if (bgArt) { const bg = R.art(bgArt); bg.classList.add('full'); R.place(bg, 0, 0, 1920, 1080); f.appendChild(bg); }
    L.appendChild(f);
    if (ctx && R.fwd(ctx)) R.anim(f, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 });
    return f;
  };
  R.sprite = (parent, el, x, y, w, h) => { R.place(el, x, y, w, h); parent.appendChild(el); return el; };
  R.flipX = el => { el.style.transform = (el.style.transform || '') + ' scaleX(-1)'; return el; };
  R.bubble = (parent, text, x, y, w, tail = 'left') => {
    const b = R.h('div', 'bubble tail-' + tail, text); R.place(b, x, y, w); parent.appendChild(b); return b;
  };
  R.part = (svg, id) => svg.querySelector('#' + id);
  R.setOpacity = (el, v) => { if (el) el.setAttribute('opacity', v); };
})(globalThis.Report = globalThis.Report || {});

/* A slider with a drawn sun knob that looks the same in every browser.
   The real <input type=range> sits invisibly on top, so dragging, clicking and keyboard all work. */
(function (R) {
  R.sunSlider = function (parent, x, y, w, max, onInput, cls = '') {
    const track = R.h('div', 'sun-track ' + cls); R.place(track, x, y + 14, w, 18); parent.appendChild(track);
    const fill = R.h('div', 'sun-fill'); track.appendChild(fill);
    const knob = R.h('div', 'sun-knob');
    knob.innerHTML = '<svg viewBox="-50 -50 100 100"><g stroke="#2E2117" stroke-width="5" stroke-linecap="round">' +
      [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 -44 V-32" transform="rotate(${a})"/>`).join('') +
      '</g><circle r="26" fill="#F4C452" stroke="#2E2117" stroke-width="6"/><path d="M-10 6 Q0 14 10 6" fill="none" stroke="#2E2117" stroke-width="4" stroke-linecap="round"/><circle cx="-9" cy="-4" r="3.5" fill="#2E2117"/><circle cx="9" cy="-4" r="3.5" fill="#2E2117"/></svg>';
    parent.appendChild(knob);
    const input = document.createElement('input'); input.type = 'range'; input.min = 0; input.max = max; input.step = 1; input.value = 0;
    input.className = 'day-slider ' + cls; R.place(input, x - 30, y - 18, w + 60, 82); parent.appendChild(input);
    const set = v => { input.value = v; const t = v / max; R.place(knob, x + t * w - 41, y - 18, 82, 82); fill.style.width = (t * 100) + '%'; };
    input.addEventListener('input', () => { set(+input.value); onInput(+input.value); });
    set(0);
    return { input, set };
  };
})(globalThis.Report = globalThis.Report || {});
