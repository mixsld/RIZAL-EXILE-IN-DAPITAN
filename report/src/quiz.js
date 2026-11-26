/* Quiz: pure scoring (createQuiz) + the checkpoint screen (quizHandler). */
(function (R) {
  function createQuiz(questions) {
    const st = questions.map(() => 'open');
    const teams = { on: false, L: 0, R: 0,
      toggle() { teams.on = !teams.on; return teams.on; },
      add(side) { teams[side] += 1; },
      score() { return { L: teams.L, R: teams.R }; },
      clear() { teams.L = 0; teams.R = 0; } };
    return {
      answer(i, letter) {
        if (st[i] !== 'open') return null;
        const correctLetter = questions[i].answer, correct = letter === correctLetter;
        st[i] = correct ? 'right' : 'wrong';
        return { correct, correctLetter };
      },
      reveal(i) { if (st[i] === 'open') st[i] = 'revealed'; return questions[i].answer; },
      state: i => st[i],
      reset(i) { st[i] = 'open'; },
      teams
    };
  }
  R.createQuiz = createQuiz;

  if (typeof document === 'undefined') return;   // Node: pure part only

  const LETTERS = ['A', 'B', 'C', 'D'];
  const quizzes = {};
  let teams = null, view = null;   // view = { scene, idx, el, tiles, why }
  const quizFor = sc => (quizzes[sc.id] = quizzes[sc.id] || createQuiz(sc.quiz));

  function resolve(letter) {
    if (!view) return;
    const qz = quizFor(view.scene), q = view.scene.quiz[view.idx];
    let res;
    if (letter) { res = qz.answer(view.idx, letter); if (!res) return; }
    else { if (qz.state(view.idx) !== 'open') return; qz.reveal(view.idx); res = { correct: null, correctLetter: q.answer }; }
    const { tiles, why } = view;
    tiles.forEach(t => t.classList.add('locked'));
    const right = tiles.find(t => t.dataset.letter === res.correctLetter);
    if (letter && !res.correct) {
      const wrong = tiles.find(t => t.dataset.letter === letter);
      wrong.classList.add('wrong');
      R.anim(wrong, [{ transform: 'translateX(0)' }, { transform: 'translateX(-14px)' }, { transform: 'translateX(14px)' },
        { transform: 'translateX(-8px)' }, { transform: 'translateX(0)' }], { duration: 420 });
    }
    right.classList.add('right');
    R.anim(right, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 480, delay: letter && !res.correct ? 300 : 0 });
    tiles.forEach(t => { if (t !== right && !t.classList.contains('wrong')) t.classList.add('dim'); });
    why.hidden = false; R.fadeIn(why, 250);
    if (view.idx === view.scene.quiz.length - 1 && view.scene.member) R.app.ui.stampPassport(view.scene.member);
  }

  R.quizAnswer = letter => resolve(letter);
  /* → on an open question reveals the answer instead of advancing. Returns true if it consumed the key. */
  R.quizGate = () => {
    if (!view) return false;
    if (quizFor(view.scene).state(view.idx) === 'open') { resolve(null); return true; }
    return false;
  };
  R.quizTeams = () => teams ? { on: teams.on, L: teams.L, R: teams.R } : null;
  R.quizReset = () => { Object.keys(quizzes).forEach(k => delete quizzes[k]); if (teams) { teams.clear(); renderTeams(); } };

  function renderTeams() {
    if (!view || !teams || !teams.on) return;
    const s = view.el.querySelector('.quiz-teams .score');
    if (s) s.textContent = `Left ${teams.L} · Right ${teams.R}`;
  }

  R.quizHandler = {
    enter(ctx) {
      const ui = R.app.ui, sc = ctx.scene, i = ctx.quizIdx, q = ctx.question;
      quizFor(sc).reset(i);
      if (!teams) { teams = quizFor(sc).teams; teams.on = R.app.params.has('teams'); }
      ui.sceneLayer.textContent = '';
      const L = ui.quizLayer; L.textContent = '';
      const el = R.h('div', 'quiz');
      const head = R.h('div', 'quiz-head');
      head.append(R.h('span', 'quiz-badge', `Checkpoint ${i + 1} of ${sc.quiz.length}`), R.h('span', 'quiz-member', `Member ${sc.member}`));
      const qq = R.h('h2', 'quiz-q', q.q);
      const grid = R.h('div', 'quiz-grid');
      const tiles = q.choices.map((c, k) => {
        const t = R.h('button', 'quiz-tile'); t.dataset.letter = LETTERS[k];
        t.append(R.h('span', 'quiz-letter', LETTERS[k]), R.h('span', 'quiz-text', c), R.h('span', 'quiz-mark'));
        t.addEventListener('click', () => resolve(LETTERS[k]));
        grid.appendChild(t); return t;
      });
      const why = R.h('p', 'quiz-why'); why.hidden = true;
      why.append(R.h('b', '', 'Why: '), document.createTextNode(q.why + ' '), R.h('span', 'quiz-page', q.page));
      el.append(head, qq, grid, why);
      if (teams.on) {
        const tb = R.h('div', 'quiz-teams');
        const bL = R.h('button', '', '+1 Left'), bR = R.h('button', '', '+1 Right');
        bL.onclick = () => { teams.add('L'); renderTeams(); }; bR.onclick = () => { teams.add('R'); renderTeams(); };
        tb.append(bL, R.h('span', 'score'), bR); el.appendChild(tb);
      }
      L.appendChild(el);
      view = { scene: sc, idx: i, el, tiles, why };
      renderTeams();
      if (R.fwd(ctx)) {
        R.slideIn(qq, 0, 24, 0, 500);
        tiles.forEach((t, k) => R.popIn(t, 120 + k * 90));
      }
    },
    exit() { R.app.ui.quizLayer.textContent = ''; view = null; }
  };
})(globalThis.Report = globalThis.Report || {});
if (typeof module !== 'undefined') module.exports = globalThis.Report;
