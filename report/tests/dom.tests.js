/* DOM tests — run with: bash tools/run_dom_tests.sh [prefix] */

/* ---------------- Task 4: stage, UI chrome, text system ---------------- */
test('ui: stage fills 1366x768 and caption stays legible', async () => {
  const w = await load(1366, 768);
  const r = $(w, '#stage').getBoundingClientRect();
  assert(Math.abs(r.width - 1366) <= 1.5, 'stage width ' + r.width);
  const s = w.Report.app.ui.scale();
  const fs = parseFloat(w.getComputedStyle($(w, '.caption')).fontSize) * s;
  assert(fs >= 18, 'caption px ' + fs);
});

test('ui: 1024x768 letterboxes and caption >= 15px', async () => {
  const w = await load(1024, 768);
  const r = $(w, '#stage').getBoundingClientRect();
  assert(r.height < 768 && Math.abs(r.width - 1024) <= 1.5, 'stage ' + r.width + 'x' + r.height);
  const fs = parseFloat(w.getComputedStyle($(w, '.caption')).fontSize) * w.Report.app.ui.scale();
  assert(fs >= 15, 'caption px ' + fs);
});

test('ui: T hides captions', async () => {
  const w = await load();
  await goStep(w, 'm2', 'voyage');
  key(w, 't'); await wait(30);
  assert($(w, '.caption').hidden, 'caption hidden');
  key(w, 't'); await wait(30);
  assert(!$(w, '.caption').hidden, 'caption back');
});

test('ui: drawer <= 35% width and closes on step change', async () => {
  const w = await load();
  await goStep(w, 'm3', 'blumentritt');
  w.Report.app.ui.openDrawer('x');
  const d = $(w, '.drawer').getBoundingClientRect(), s = $(w, '#stage').getBoundingClientRect();
  assert(d.width <= 0.35 * s.width + 1, 'drawer width ' + d.width);
  assert($(w, '.drawer').classList.contains('open'), 'open');
  await press(w, 'ArrowRight');
  assert(!$(w, '.drawer').classList.contains('open'), 'closed after next');
});

test('ui: rehearse mode flags an over-long headline with a lint dot', async () => {
  const w = await load(1920, 1080, 'rehearse');
  w.Report.CONTENT.scenes.find(s => s.id === 'm2').steps.find(s => s.id === 'voyage').headline = 'one two three four five six seven eight';
  w.Report.app.relint();
  await goStep(w, 'm2', 'fort'); await goStep(w, 'm2', 'voyage');
  assert($(w, '.lint-dot') && !$(w, '.lint-dot').hidden, 'lint dot visible');
});

test('ui: text zones cover <= 25% of the stage on the voyage step', async () => {
  const w = await load();
  await goStep(w, 'm2', 'voyage'); await wait(700);
  const st = $(w, '#stage').getBoundingClientRect();
  const sel = ['.headline', '.caption', '.datecard', ...$$(w, '.labels-layer text').map((_, i) => `.labels-layer text:nth-of-type(${i + 1})`)];
  let area = 0;
  for (const el of [$(w, '.headline'), $(w, '.caption'), $(w, '.datecard'), ...$$(w, '.labels-layer text')]) {
    if (!el || el.hidden) continue;
    const r = el.getBoundingClientRect(); area += r.width * r.height;
  }
  const frac = area / (st.width * st.height);
  assert(frac <= 0.25, 'text fraction ' + frac.toFixed(3));
});

test('ui: headline, caption, date and source come from content', async () => {
  const w = await load();
  await goStep(w, 'm2', 'voyage'); await wait(600);
  eq($(w, '.headline').textContent, 'Exiled to Dapitan');
  assert(/Carnicero/.test($(w, '.caption').textContent), 'caption');
  eq($(w, '.datecard').textContent.replace(/\s+/g, ' ').trim(), 'July 14 → 17, 1892');
  eq($(w, '.source').textContent, 'p. 102');
});

/* ---------------- Task 5: quiz ---------------- */
test('quiz: pressing C on M2 Q2 marks C right and shows the why line', async () => {
  const w = await load();
  await goStep(w, 'm2', 'quiz1');
  key(w, 'c'); await wait(700);
  assert($(w, '.quiz-tile[data-letter="C"]').classList.contains('right'), 'C right');
  assert(/P2,000/.test($(w, '.quiz-why').textContent), 'why text');
});

test('quiz: wrong answer marks wrong and reveals the right tile', async () => {
  const w = await load();
  await goStep(w, 'm1', 'quiz0');
  key(w, 'a'); await wait(800);
  assert($(w, '.quiz-tile[data-letter="A"]').classList.contains('wrong'), 'A wrong');
  assert($(w, '.quiz-tile[data-letter="D"]').classList.contains('right'), 'D right');
});

test('quiz: back then forward shows the question open again', async () => {
  const w = await load();
  await goStep(w, 'm1', 'quiz0');
  key(w, 'd'); await wait(600);
  await press(w, 'ArrowLeft'); await press(w, 'ArrowRight');
  assert(w.Report.app.engine.current().isQuiz, 'on quiz');
  assert(!$(w, '.quiz-tile.right') && !$(w, '.quiz-tile.wrong'), 'tiles reset');
});

test('quiz: next on an open question reveals before advancing; 2nd quiz stamps passport', async () => {
  const w = await load();
  await goStep(w, 'm3', 'quiz1');
  key(w, 'ArrowRight'); await wait(600);
  assert($(w, '.quiz-tile[data-letter="D"]').classList.contains('right'), 'revealed D');
  eq(w.Report.app.engine.current().quizIdx, 1, 'still on quiz');
  eq(w.Report.app.ui.passportCount(), 1, 'stamp 3 placed');
  assert($(w, '.passport .s3.done'), 's3 done');
});

test('quiz: clicking a tile answers it', async () => {
  const w = await load();
  await goStep(w, 'm4', 'quiz0');
  $(w, '.quiz-tile[data-letter="A"]').click(); await wait(600);
  assert($(w, '.quiz-tile[data-letter="A"]').classList.contains('right'), 'A right');
});

/* ---------------- Task 7: opening + member 1 ---------------- */
const clickEl = (w, el) => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));

test('s0: map step draws the route to the end', async () => {
  const w = await load();
  await goStep(w, 'opening', 'letter'); await press(w, 'ArrowRight'); await wait(100);
  w.Report.app.engine.finishAnimations(); await wait(50);   // headless Chrome does not tick animations
  const mp = $(w, '#route-reveal');
  assert(mp, 'route mask path');
  eq(parseFloat(w.getComputedStyle(mp).strokeDashoffset), 0, 'dashoffset');
});

test('s0: M opens the map hub; clicking stop 3 goes to member 3', async () => {
  const w = await load();
  await goStep(w, 'm2', 'voyage');
  key(w, 'm'); await wait(100);
  eq(w.Report.app.engine.current().step.id, 'map');
  clickEl(w, $(w, '.frame #stop-3')); await wait(100);
  const c = w.Report.app.engine.current();
  eq(c.scene.id + '.' + c.step.id, 'm3.title');
});

test('s1: meeting lights windows one per next, back unlights one', async () => {
  const w = await load();
  await goStep(w, 'm1', 'pardon'); await press(w, 'ArrowRight');
  eq(w.Report.app.engine.current().step.id, 'meeting');
  eq($$(w, '.frame [id^="win-"].lit').length, 0, 'start dark');
  await press(w, 'ArrowRight', 6);
  eq($$(w, '.frame [id^="win-"].lit').length, 6, 'all lit');
  assert(/Mabini/.test($(w, '.frame #win-1').textContent), 'name in window');
  await press(w, 'ArrowLeft');
  eq($$(w, '.frame [id^="win-"].lit').length, 5, 'one unlit');
});

test('s1: officers — right post places, wrong refused, next autofills, back+forward resets', async () => {
  const w = await load();
  await goStep(w, 'm1', 'officers');
  const S = w.Report.scenes.m1;
  eq(S.drop('Ambrosio Salvador', 'Fiscal'), false, 'wrong refused');
  eq(S.drop('Ambrosio Salvador', 'President'), true, 'right accepted');
  assert($(w, '.officer-card[data-name="Ambrosio Salvador"]').classList.contains('placed'), 'placed class');
  await press(w, 'ArrowRight');
  eq($$(w, '.officer-card.placed').length, 4, 'autofilled');
  eq(w.Report.app.engine.current().step.id, 'officers', 'still on step');
  await press(w, 'ArrowLeft'); await press(w, 'ArrowRight');
  eq($$(w, '.officer-card.placed').length, 0, 'clean board');
});

test('s1: clicking a pillow reveals handbills then the ARRESTED stamp', async () => {
  const w = await load();
  await goStep(w, 'm1', 'luggage');
  clickEl(w, $(w, '.frame #pillow-1'));
  await wait(1600);
  eq($(w, '.frame #handbills').getAttribute('opacity'), '1', 'handbills shown');
  assert($(w, '.frame .stamp-arrested'), 'stamp present');
});

test('s1: arrival shows the steamer named DON JUAN', async () => {
  const w = await load();
  await goStep(w, 'm1', 'arrival'); await wait(200);
  eq($(w, '.frame #name-plate').textContent, 'DON JUAN');
});

/* ---------------- Task 8: member 2 ---------------- */
test('s2: voyage shows the steamer CEBU and the date card', async () => {
  const w = await load();
  await goStep(w, 'm2', 'voyage'); await wait(200);
  eq($(w, '.frame #name-plate').textContent, 'CEBU');
  eq($(w, '.datecard').textContent.trim(), 'July 14 → 17, 1892');
});

test('s2: chat adds one bubble per next (5 total), back removes one', async () => {
  const w = await load();
  await goStep(w, 'm2', 'letters'); await wait(100);
  eq($$(w, '.chat-msg').length, 0, 'empty at start');
  await press(w, 'ArrowRight', 5);
  eq($$(w, '.chat-msg').length, 5, 'five bubbles');
  eq(w.Report.app.engine.current().step.id, 'letters', 'still on letters');
  await press(w, 'ArrowLeft');
  eq($$(w, '.chat-msg').length, 4, 'four after back');
});

test('s2: lottery — next reveals P20,000, next splits P6,200, back restores', async () => {
  const w = await load();
  await goStep(w, 'm2', 'lottery'); await wait(100);
  assert(!$(w, '.ticket.revealed'), 'starts covered');
  await press(w, 'ArrowRight');
  assert($(w, '.ticket.revealed'), 'revealed');
  assert(/P20,000/.test($(w, '.ticket').textContent), 'prize text');
  await press(w, 'ArrowRight');
  const piles = $$(w, '.coin-pile').map(p => p.textContent).join('|');
  assert(/P2,000/.test(piles) && /P200/.test(piles) && /land/.test(piles), 'piles ' + piles);
  await press(w, 'ArrowLeft'); await press(w, 'ArrowLeft');
  assert(!$(w, '.ticket.revealed'), 'covered again');
  eq($$(w, '.coin-pile').length, 0, 'piles gone');
});

test('s2: friendship swaps Carnicero from stern to smiling', async () => {
  const w = await load();
  await goStep(w, 'm2', 'friendship'); await wait(100);
  assert($(w, '.carnicero[data-mood="stern"]'), 'stern first');
  await press(w, 'ArrowRight');
  assert($(w, '.carnicero[data-mood="smile"]'), 'smiles');
});

/* ---------------- Task 9: member 3 ---------------- */
test('s3: clicking houses tells who lived there', async () => {
  const w = await load();
  await goStep(w, 'm3', 'houses'); await wait(100);
  clickEl(w, $(w, '.house[data-kind="octagon"]')); await wait(50);
  assert(/students/.test($(w, '.house-who[data-kind="octagon"]').textContent), 'octagon → students');
  clickEl(w, $(w, '.house[data-kind="hexagon"]')); await wait(50);
  assert(/chickens/.test($(w, '.house-who[data-kind="hexagon"]').textContent), 'hexagon → chickens');
});

test('s3: day slider shows dawn at 0 and night reading at max; → moves the sun', async () => {
  const w = await load();
  await goStep(w, 'm3', 'day'); await wait(100);
  const sl = $(w, '.day-slider');
  eq($(w, '.frame #vig-1').getAttribute('opacity'), '1', 'dawn first');
  sl.value = sl.max; sl.dispatchEvent(new w.Event('input', { bubbles: true })); await wait(50);
  eq($(w, '.frame #vig-7').getAttribute('opacity'), '1', 'night at max');
  eq($(w, '.frame #vig-1').getAttribute('opacity'), '0', 'dawn hidden');
  sl.value = 0; sl.dispatchEvent(new w.Event('input', { bubbles: true }));
  await press(w, 'ArrowRight');
  eq($(w, '.frame #vig-2').getAttribute('opacity'), '1', 'next advances the day');
});

test('s3: specimen cards flip to show both names', async () => {
  const w = await load();
  await goStep(w, 'm3', 'species'); await wait(100);
  await press(w, 'ArrowRight', 2);
  const txt = $$(w, '.spec-card.flipped').map(c => c.textContent).join('|');
  assert(/Rhacophorus rizali/.test(txt) && /Apogonia rizali/.test(txt), 'both flipped: ' + txt);
});

test('s3: school shows exactly 16 students', async () => {
  const w = await load();
  await goStep(w, 'm3', 'school'); await wait(100);
  eq($$(w, '.student').length, 16);
});

test('s3: with bonus off the Ponot step is never entered', async () => {
  const w = await load();
  await goStep(w, 'm3', 'title');
  const seen = [];
  for (let i = 0; i < 40 && w.Report.app.engine.current().scene.id === 'm3'; i++) {
    const c = w.Report.app.engine.current(); seen.push(c.isQuiz ? 'quiz' : c.step.id);
    w.Report.app.engine.finishAnimations(); w.Report.app.engine.next(); w.Report.quizGate && w.Report.quizGate();
  }
  assert(!seen.includes('ponot') && !seen.includes('plaza'), seen.join(','));
});

/* ---------------- Task 10: member 4 ---------------- */
test('s4: clicking the lamp lights every street lamp', async () => {
  const w = await load();
  await goStep(w, 'm4', 'lamps'); await wait(100);
  eq($$(w, '.frame [id^="lamp-"].lit').length, 0, 'dark first');
  clickEl(w, $(w, '.frame #lamp-main')); await wait(100);
  eq($$(w, '.frame [id^="lamp-"].lit').length, 4, 'all lit');
});

test('s4: gallery shows the four poem titles', async () => {
  const w = await load();
  await goStep(w, 'm4', 'gallery'); await wait(100);
  const t = $$(w, '.poem-frame').map(p => p.textContent).join('|');
  for (const p of ['A Ricardo Carnicero', 'Hymn to the Talisay Tree', 'My Retreat', 'El Canto del Viajero']) assert(t.includes(p), p);
});

test('s4: vote is a think-about-it choice (no numbers); reveal shows Oppose + 3 reasons; back clears', async () => {
  const w = await load();
  await goStep(w, 'm4', 'vote'); await wait(100);
  eq($$(w, '.vote-btn .tally').length, 0, 'no tallies');
  assert(!/raise/i.test($(w, '.vote-box').textContent), 'no hand-raising');
  clickEl(w, $(w, '.vote-btn[data-v="support"]'));
  assert($(w, '.vote-btn[data-v="support"]').classList.contains('selected'), 'choice highlighted');
  await press(w, 'ArrowRight');
  assert($(w, '.vote-answer') && /Oppose/i.test($(w, '.vote-answer').textContent), 'answer');
  eq($$(w, '.vote-reason').length, 3, 'reasons');
  await press(w, 'ArrowLeft');
  assert(!$(w, '.vote-answer'), 'answer hidden');
  eq($$(w, '.vote-btn.selected').length, 0, 'cleared');
});

/* ---------------- Real mouse hit-testing (what the presenter actually clicks) ---------------- */
async function hit(w, sel) {
  const el = $(w, sel); assert(el, 'missing ' + sel);
  const r = el.getBoundingClientRect();
  const top = w.document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return !!top && (top === el || el.contains(top));
}
test('hit: a real click reaches the pillow, lamp, houses, ticket, officer card and specimen card', async () => {
  const w = await load();
  const cases = [['m1', 'luggage', '.frame #pillow-1'], ['m4', 'lamps', '.frame #lamp-main'], ['m3', 'houses', '.house[data-kind="octagon"]'],
    ['m2', 'lottery', '.scratch'], ['m1', 'officers', '.officer-card'], ['m3', 'species', '.spec-card'], ['m4', 'vote', '.vote-btn'], ['m3', 'day', '.day-slider']];
  const bad = [];
  for (const [s, st, sel] of cases) { await goStep(w, s, st); w.Report.app.engine.finishAnimations(); await wait(80); if (!(await hit(w, sel))) bad.push(s + '.' + st + ' ' + sel); }
  eq(bad.join(', '), '', 'blocked');
});

test('hit: dragging an officer card with the mouse places it', async () => {
  const w = await load();
  await goStep(w, 'm1', 'officers'); w.Report.app.engine.finishAnimations(); await wait(80);
  const card = $(w, '.officer-card[data-name="Ambrosio Salvador"]'), slot = $(w, '.ledger-slot[data-post="President"]');
  const a = card.getBoundingClientRect(), b = slot.getBoundingClientRect();
  const ev = (type, x, y) => w.document.elementFromPoint(a.left + 20, a.top + 20).dispatchEvent(new w.PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true }));
  const target = w.document.elementFromPoint(a.left + 20, a.top + 20);
  target.dispatchEvent(new w.PointerEvent('pointerdown', { bubbles: true, clientX: a.left + 20, clientY: a.top + 20, pointerId: 1, isPrimary: true }));
  card.dispatchEvent(new w.PointerEvent('pointermove', { bubbles: true, clientX: b.left + 30, clientY: b.top + 20, pointerId: 1, isPrimary: true }));
  card.dispatchEvent(new w.PointerEvent('pointerup', { bubbles: true, clientX: b.left + 30, clientY: b.top + 20, pointerId: 1, isPrimary: true }));
  await wait(50);
  assert(card.classList.contains('placed'), 'placed by drag');
});

test('names: the four members appear on their title cards', async () => {
  const w = await load();
  const names = [];
  for (const m of ['m1', 'm2', 'm3', 'm4']) { await goStep(w, m, 'title'); names.push($(w, '.title-card .who').textContent); }
  eq(names.join(','), 'Pagulayan,Panghulan,Pagatpatan,Ocampo');
});

test('s4: farewell stops the counter at 4 years, 13 days', async () => {
  const w = await load();
  await goStep(w, 'm4', 'farewell'); await wait(100);
  w.Report.app.engine.finishAnimations(); await wait(50);
  eq($(w, '.day-counter b').textContent, '4 years, 13 days');
  assert(/August 6, 1896/.test($(w, '.datecard').textContent), 'date card');
});

test('s4: Josephine panels appear one per next and have no comic sound effects', async () => {
  const w = await load();
  await goStep(w, 'm4', 'josephine'); await wait(100);
  eq($$(w, '.jo-panel.shown').length, 1, 'first panel');
  await press(w, 'ArrowRight', 3);
  eq($$(w, '.jo-panel.shown').length, 4, 'all four');
  eq($$(w, '.sfx').length, 0, 'no sfx');
});

test('s4: Cuba letter is stamped ACCEPTED', async () => {
  const w = await load();
  await goStep(w, 'm4', 'cuba'); await wait(100);
  assert($(w, '.frame .stamp-accepted'), 'stamp');
});

/* ---------------- Task 11: closing + full run ---------------- */
test('run: full walk with bonus off visits every core step and all 8 quizzes once, no errors', async () => {
  const w = await load();
  const errors = [];
  w.addEventListener('error', e => errors.push(e.message));
  const E = w.Report.app.engine, C = w.Report.CONTENT;
  const expected = [];
  C.scenes.forEach(s => { s.steps.forEach(st => { if (!st.bonus) expected.push(s.id + '.' + st.id); }); (s.quiz || []).forEach((_, i) => expected.push(s.id + '.quiz' + i)); });
  const seen = [];
  for (let guard = 0; guard < 400; guard++) {
    const c = E.current(); const id = c.scene.id + '.' + (c.isQuiz ? 'quiz' + c.quizIdx : c.step.id);
    if (seen[seen.length - 1] !== id) seen.push(id);
    E.finishAnimations();
    key(w, 'ArrowRight'); await wait(15);
    const after = E.current();
    if (after.scene.id === 'closing' && after.step && after.step.id === 'thanks') { seen.push('closing.thanks'); break; }
  }
  eq(JSON.stringify(seen), JSON.stringify(expected), 'visit order');
  eq(errors.length, 0, 'errors: ' + errors.join(' | '));
});

test('run: closing shows 4 earned stamps after all quizzes; R resets the passport', async () => {
  const w = await load();
  const E = w.Report.app.engine;
  for (const m of ['m1', 'm2', 'm3', 'm4']) { await goStep(w, m, 'quiz1'); key(w, 'ArrowRight'); await wait(30); }
  eq(w.Report.app.ui.passportCount(), 4, 'passport full');
  await goStep(w, 'closing', 'passport'); E.finishAnimations(); await wait(50);
  eq($$(w, '.frame .stamp.earned').length, 4, 'four earned stamps');
  key(w, 'r'); await wait(30);
  eq(w.Report.app.ui.passportCount(), 0, 'reset');
});

test('run: thanks slide names the next chapter and the book', async () => {
  const w = await load();
  await goStep(w, 'closing', 'thanks'); await wait(50);
  assert(/Chapter 16/.test($(w, '.caption').textContent), 'next chapter');
  assert(/Social Reformer and Patriot/.test($(w, '.frame').textContent), 'citation');
});

/* ---------------- Phone / touch ---------------- */
test('touch: on-screen next and back buttons move through the report', async () => {
  const w = await load(844, 390, 'touch');
  const nav = $(w, '.touch-nav');
  assert(nav && w.getComputedStyle(nav).display !== 'none', 'nav visible on touch');
  const next = $(w, '.touch-nav [data-act="next"]'), prev = $(w, '.touch-nav [data-act="prev"]');
  assert(await hit(w, '.touch-nav [data-act="next"]'), 'next button is tappable');
  next.click(); await wait(60); w.Report.app.engine.finishAnimations(); next.click(); await wait(60);
  eq(w.Report.app.engine.current().step.id, 'letter', 'advanced');
  prev.click(); await wait(60);
  eq(w.Report.app.engine.current().step.id, 'cover', 'went back');
});

test('touch: map button opens the journey map', async () => {
  const w = await load(844, 390, 'touch');
  await goStep(w, 'm2', 'fort');
  $(w, '.touch-nav [data-act="map"]').click(); await wait(60);
  eq(w.Report.app.engine.current().step.id, 'map');
});

test('touch: swiping left goes forward, swiping right goes back', async () => {
  const w = await load(844, 390, 'touch');
  const st = $(w, '#stage').getBoundingClientRect();
  const swipe = async (x0, x1) => {
    const t = w.document.elementFromPoint(x0, st.top + st.height * .4);
    const o = { bubbles: true, pointerId: 7, isPrimary: true, pointerType: 'touch', clientY: st.top + st.height * .4 };
    t.dispatchEvent(new w.PointerEvent('pointerdown', Object.assign({ clientX: x0 }, o)));
    t.dispatchEvent(new w.PointerEvent('pointerup', Object.assign({ clientX: x1 }, o)));
    await wait(60); w.Report.app.engine.finishAnimations();
  };
  await swipe(st.left + st.width * .8, st.left + st.width * .3);
  eq(w.Report.app.engine.current().step.id, 'letter', 'swipe left = next');
  await swipe(st.left + st.width * .3, st.left + st.width * .8);
  eq(w.Report.app.engine.current().step.id, 'cover', 'swipe right = back');
});

test('touch: dragging an officer card is not mistaken for a swipe', async () => {
  const w = await load(844, 390, 'touch');
  await goStep(w, 'm1', 'officers'); w.Report.app.engine.finishAnimations(); await wait(60);
  const card = $(w, '.officer-card'), r = card.getBoundingClientRect();
  const o = { bubbles: true, pointerId: 8, isPrimary: true, pointerType: 'touch', clientY: r.top + 10 };
  card.dispatchEvent(new w.PointerEvent('pointerdown', Object.assign({ clientX: r.left + 10 }, o)));
  card.dispatchEvent(new w.PointerEvent('pointerup', Object.assign({ clientX: r.left - 200 }, o)));
  await wait(60);
  eq(w.Report.app.engine.current().step.id, 'officers', 'still on officers');
});

test('touch: portrait phone shows a turn-sideways hint', async () => {
  const w = await load(390, 844, 'touch');
  const hint = $(w, '.rotate-hint');
  assert(hint && w.getComputedStyle(hint).display !== 'none', 'hint shown in portrait');
});

test('desktop: touch buttons stay hidden on the projector', async () => {
  const w = await load(1920, 1080);
  const nav = $(w, '.touch-nav');
  assert(!nav || w.getComputedStyle(nav).opacity === '0' || w.getComputedStyle(nav).display === 'none', 'hidden');
});
