/* createUI(root, engine, content) — stage scaling + all fixed text zones (design §5A). */
(function (R) {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  function createUI(root, engine, content, opts = {}) {
    const viewport = h('div', 'viewport');
    const stage = h('div'); stage.id = 'stage';
    const sceneLayer = h('div', 'scene-layer');
    const titleLayer = h('div', 'title-layer');
    const labels = document.createElementNS(SVGNS, 'svg');
    labels.setAttribute('class', 'labels-layer'); labels.setAttribute('viewBox', '0 0 1920 1080');
    const quizLayer = h('div', 'quiz-layer');

    const top = h('div', 'topbar');
    const brand = h('div', 'brand', content.title);
    const tag = h('div', 'member-tag');
    const passport = h('div', 'passport');
    for (let i = 1; i <= 4; i++) { const s = h('span', 'slot s' + i, String(i)); passport.appendChild(s); }
    top.append(brand, tag, passport);

    const headline = h('h2', 'headline');
    const datecard = h('div', 'datecard');
    const caption = h('p', 'caption');
    const source = h('div', 'source');
    const info = h('button', 'info-btn', 'i'); info.title = 'More'; info.hidden = true;
    const drawer = h('aside', 'drawer'); const drawerClose = h('span', 'close', '×'); const drawerBody = h('div');
    drawer.append(drawerClose, drawerBody);
    const progress = h('div', 'progress'); const bar = h('i'); progress.appendChild(bar);
    const lintDot = h('div', 'lint-dot'); lintDot.hidden = true; lintDot.title = 'Text over limit';

    stage.append(sceneLayer, titleLayer, labels, quizLayer, top, headline, datecard, caption, source, info, drawer, progress, lintDot);
    viewport.appendChild(stage);
    const notes = h('aside', 'notes-panel');
    const cue = h('div', 'cue-sheet');
    root.append(viewport, notes, cue);

    let scale = 1, captionsOn = true, captionTimer = null, lintIssues = [];

    function fit() {
      const W = window.innerWidth, H = window.innerHeight;
      scale = Math.min(W / 1920, H / 1080);
      stage.style.transform = `translate(${(W - 1920 * scale) / 2}px, ${(H - 1080 * scale) / 2}px) scale(${scale})`;
    }
    window.addEventListener('resize', fit); fit();

    info.addEventListener('click', () => api.openDrawer(info.dataset.more || ''));
    drawerClose.addEventListener('click', () => api.closeDrawer());

    function setText(el, txt) { el.textContent = txt || ''; el.hidden = !txt; }
    function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

    const api = {
      root, stage, sceneLayer, titleLayer, quizLayer, labelsLayer: labels,
      scale: () => scale,
      fit,
      showStep(cur) {
        const sc = cur.scene, st = cur.step;
        stage.style.setProperty('--mc', sc.color); stage.style.setProperty('--mt', sc.textColor || sc.color);
        tag.textContent = sc.member ? `${(content.members || [])[sc.member - 1] || 'Member ' + sc.member} · ${sc.title.split(/[&,]/)[0].trim()}` : '';
        stage.classList.toggle('is-quiz', !!cur.isQuiz);
        stage.classList.remove('is-dark');
        stage.classList.toggle('is-title', !cur.isQuiz && st && st.id === 'title');
        api.closeDrawer(); api.setLabels([]);
        clearTimeout(captionTimer);
        caption.classList.remove('show');
        if (cur.isQuiz) {
          setText(headline, ''); setText(caption, ''); setText(datecard, '');
          source.textContent = cur.question.page; info.hidden = true;
        } else {
          setText(headline, st.headline); restart(headline, 'enter');
          setText(datecard, st.date); if (st.date) restart(datecard, 'enter');
          caption.textContent = st.caption || '';
          caption.hidden = !captionsOn || !st.caption;
          captionTimer = setTimeout(() => caption.classList.add('show'), 400);
          source.textContent = st.page || '';
          info.hidden = !st.more; info.dataset.more = st.more || '';
        }
        bar.style.width = (engine.progress() * 100).toFixed(2) + '%';
        const id = cur.isQuiz ? 'quiz' + cur.quizIdx : st.id;
        lintDot.hidden = !lintIssues.some(i => i.sceneId === sc.id && i.stepId === id);
        api.renderNotes(cur);
      },
      setLabels(list) {
        labels.textContent = '';
        (list || []).forEach((l, i) => {
          const g = document.createElementNS(SVGNS, 'g'); g.setAttribute('class', 'lbl');
          if (l.toX != null) {
            const p = document.createElementNS(SVGNS, 'path');
            const mx = (l.x + l.toX) / 2, my = Math.min(l.y, l.toY) - 30;
            const sx = l.x + (l.anchor === 'end' ? -6 : (l.anchor === 'middle' ? 0 : -6)), sy = l.y - 10;
            p.setAttribute('d', `M${sx} ${sy} Q${mx} ${my} ${l.toX} ${l.toY}`);
            g.appendChild(p);
            const dot = document.createElementNS(SVGNS, 'circle');
            dot.setAttribute('cx', l.toX); dot.setAttribute('cy', l.toY); dot.setAttribute('r', 5); dot.setAttribute('fill', '#2E2117');
            g.appendChild(dot);
          }
          const t = document.createElementNS(SVGNS, 'text');
          t.setAttribute('x', l.x); t.setAttribute('y', l.y); t.setAttribute('text-anchor', l.anchor || 'start');
          t.textContent = l.text; g.appendChild(t);
          labels.appendChild(g);
          if (R.app && R.app.params && R.app.params.has('still')) g.classList.add('show'); else setTimeout(() => g.classList.add('show'), 150 + i * 120);
        });
      },
      toggleCaptions() { captionsOn = !captionsOn; caption.hidden = !captionsOn || !caption.textContent; return captionsOn; },
      captionsOn: () => captionsOn,
      openDrawer(text) { drawerBody.textContent = text; drawer.classList.add('open'); },
      closeDrawer() { drawer.classList.remove('open'); },
      renderNotes(cur) {
        notes.textContent = '';
        const st = cur.step;
        notes.append(h('h3', '', cur.isQuiz ? `Checkpoint ${cur.quizIdx + 1}` : st.headline),
          h('div', 'meta', `${cur.scene.title} · ${cur.isQuiz ? cur.question.page : st.page}`));
        const ul = h('ul');
        (cur.isQuiz ? ['Read the question aloud.', 'Ask for hands: "Who says A? B? C? D?"', 'Click the class answer, then explain the why line.'] : st.notes)
          .forEach(n => ul.appendChild(h('li', '', n)));
        notes.appendChild(ul);
      },
      toggleNotes() { notes.classList.toggle('open'); return notes.classList.contains('open'); },
      buildCueSheet() {
        cue.textContent = '';
        content.scenes.forEach(sc => {
          const sec = h('section');
          sec.appendChild(h('h2', '', `${sc.member ? 'Member ' + sc.member + ' — ' : ''}${sc.title} (${sc.pages})`));
          sc.steps.forEach(st => {
            sec.appendChild(h('h3', '', `${st.headline}${st.bonus ? ' [bonus]' : ''}`));
            const ul = h('ul'); st.notes.forEach(n => ul.appendChild(h('li', '', n))); sec.appendChild(ul);
          });
          (sc.quiz || []).forEach((q, i) => sec.appendChild(h('p', '', `Q${i + 1}: ${q.q} → ${q.answer}. ${q.why}`)));
          cue.appendChild(sec);
        });
        return cue;
      },
      printCues() { api.buildCueSheet(); window.print(); },
      stampPassport(n) {
        const s = passport.querySelector('.s' + n); if (!s || s.classList.contains('done')) return;
        s.classList.add('done', 'pop'); setTimeout(() => s.classList.remove('pop'), 700);
      },
      resetPassport() { passport.querySelectorAll('.slot').forEach(s => s.classList.remove('done')); },
      passportCount() { return passport.querySelectorAll('.slot.done').length; },
      setLint(issues) { lintIssues = issues || []; },
      toast(msg, ms = 2000) {
        const t = h('div', 'toast', msg); document.body.appendChild(t);
        setTimeout(() => t.classList.add('gone'), ms); setTimeout(() => t.remove(), ms + 800);
      }
    };
    return api;
  }
  R.createUI = createUI;
})(globalThis.Report = globalThis.Report || {});
