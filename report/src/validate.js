/* validateContent(content) -> [{ sceneId, stepId, rule, detail }]  (empty = OK) */
(function (R) {
  const LIMITS = { headline: 6, caption: 25, sentences: 2, label: 4, labels: 4, total: 30,
    question: 15, choice: 8, why: 20 };
  const ABBR = /\b(Capt|Gov|Gen|Fr|Dr|Mr|Mrs|St|Prof|S\.J|p|pp|Sept|Dec|Apr|No|vs)\./g;

  const words = s => (s || '').trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
  const sentences = s => {
    const t = (s || '').replace(ABBR, '$1').replace(/\b[A-Z]\./g, 'X').trim();
    if (!t) return 0;
    const m = t.match(/[.!?]+(?=\s|$)/g);
    return Math.max(1, m ? m.length : 1);
  };

  function validateContent(content) {
    const out = [];
    const add = (sceneId, stepId, rule, detail) => out.push({ sceneId, stepId, rule, detail });
    for (const sc of content.scenes) {
      for (const st of sc.steps) {
        const h = words(st.headline), c = words(st.caption);
        if (h > LIMITS.headline) add(sc.id, st.id, 'headline-words', `${h} > ${LIMITS.headline}`);
        if (c > LIMITS.caption) add(sc.id, st.id, 'caption-words', `${c} > ${LIMITS.caption}`);
        const n = sentences(st.caption);
        if (n > LIMITS.sentences) add(sc.id, st.id, 'caption-sentences', `${n} > ${LIMITS.sentences}`);
        if (st.labels.length > LIMITS.labels) add(sc.id, st.id, 'label-count', `${st.labels.length} > ${LIMITS.labels}`);
        let lw = 0;
        st.labels.forEach(l => { const w = words(l); lw += w; if (w > LIMITS.label) add(sc.id, st.id, 'label-words', `"${l}" ${w} > ${LIMITS.label}`); });
        if (h + c + lw > LIMITS.total) add(sc.id, st.id, 'total-words', `${h + c + lw} > ${LIMITS.total}`);
      }
      (sc.quiz || []).forEach((q, i) => {
        const id = 'quiz' + i;
        if (words(q.q) > LIMITS.question) add(sc.id, id, 'quiz-question-words', `${words(q.q)} > ${LIMITS.question}`);
        if (q.choices.length !== 4) add(sc.id, id, 'quiz-choice-count', `${q.choices.length} != 4`);
        q.choices.forEach(ch => { if (words(ch) > LIMITS.choice) add(sc.id, id, 'quiz-choice-words', `"${ch}"`); });
        if (words(q.why) > LIMITS.why) add(sc.id, id, 'quiz-why-words', `${words(q.why)} > ${LIMITS.why}`);
      });
    }
    return out;
  }
  R.validateContent = validateContent;
  R.LIMITS = LIMITS;
  R._words = words; R._sentences = sentences;
})(globalThis.Report = globalThis.Report || {});
if (typeof module !== 'undefined') module.exports = globalThis.Report;
