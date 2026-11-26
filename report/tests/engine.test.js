const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../src/content.js');
require('../src/engine.js');

function make(opts = {}) {
  const log = [];
  const handlers = new Proxy({}, { get: (_, sceneId) => new Proxy({}, { get: (_, stepId) => ({
    enter: ctx => log.push(['enter', sceneId, stepId, ctx.direction]),
    exit: ctx => log.push(['exit', sceneId, stepId, ctx.direction]) }) }) });
  const quizHandler = { enter: ctx => log.push(['qenter', ctx.scene.id, ctx.quizIdx]), exit: ctx => log.push(['qexit', ctx.scene.id, ctx.quizIdx]) };
  const e = R.createEngine({ content: R.CONTENT, handlers, quizHandler, ...opts });
  e.start();
  return { e, log };
}
const sceneIdx = id => R.CONTENT.scenes.findIndex(s => s.id === id);

test('bonus steps skipped when off, included when on', () => {
  const { e } = make();
  e.goTo(sceneIdx('m1'));
  const seen = [];
  while (e.current().scene.id === 'm1') { seen.push(e.current().isQuiz ? 'quiz' : e.current().step.id); e.next(); }
  assert.ok(!seen.includes('north'));
  e.setBonus(true);
  e.goTo(sceneIdx('m1'));
  const seen2 = [];
  while (e.current().scene.id === 'm1') { seen2.push(e.current().isQuiz ? 'quiz' : e.current().step.id); e.next(); }
  assert.ok(seen2.includes('north'));
});

test('prev exits current (back) before entering previous (back)', () => {
  const { e, log } = make();
  e.next(); log.length = 0;
  e.prev();
  assert.deepEqual(log[0], ['exit', 'opening', 'letter', 'back']);
  assert.deepEqual(log[1], ['enter', 'opening', 'cover', 'back']);
});

test('mashing next during an animation finishes it, then advances exactly one', () => {
  const { e } = make();
  let finished = 0;
  e.busy(() => finished++);
  assert.equal(e.next(), false);
  assert.equal(finished, 1);
  assert.equal(e.current().step.id, 'cover');
  e.next();
  assert.equal(e.current().step.id, 'letter');
});

test('member content ends in two quiz screens then next member title', () => {
  const { e } = make();
  e.goTo(sceneIdx('m1'));
  while (!e.current().isQuiz) e.next();
  assert.equal(e.current().quizIdx, 0);
  e.next(); assert.equal(e.current().quizIdx, 1);
  e.next(); assert.equal(e.current().scene.id, 'm2'); assert.equal(e.current().step.id, 'title');
});

test('goTo exits only the current step', () => {
  const { e, log } = make();
  e.next(); log.length = 0;
  e.goTo(0);
  assert.deepEqual(log.filter(l => l[0] === 'exit'), [['exit', 'opening', 'letter', 'jump']]);
});

test('goToId reaches a named step', () => {
  const { e } = make();
  e.goToId('m3', 'species');
  assert.equal(e.current().step.id, 'species');
});

test('toggling bonus keeps the current step', () => {
  const { e } = make();
  e.goToId('m2', 'letters');
  e.setBonus(true);
  assert.equal(e.current().step.id, 'letters');
});

test('routeKey maps keys by mode', () => {
  assert.equal(R.routeKey('ArrowRight', { isQuiz: false }), 'next');
  assert.equal(R.routeKey('PageDown', { isQuiz: false }), 'next');
  assert.equal(R.routeKey(' ', { isQuiz: false }), 'next');
  assert.equal(R.routeKey('PageUp', { isQuiz: true }), 'prev');
  assert.equal(R.routeKey('b', { isQuiz: true }), 'answerB');
  assert.equal(R.routeKey('B', { isQuiz: true }), 'answerB');
  assert.equal(R.routeKey('b', { isQuiz: false }), 'bonus');
  assert.equal(R.routeKey('2', { isQuiz: false }), 'jump2');
  assert.equal(R.routeKey('m', { isQuiz: false }), 'map');
  assert.equal(R.routeKey('x', { isQuiz: false }), null);
});

test('progress fraction runs 0..1', () => {
  const { e } = make();
  assert.equal(e.progress(), 0);
  e.goTo(R.CONTENT.scenes.length - 1, 1);
  assert.equal(e.progress(), 1);
});

test('beats: advance consumes next until exhausted; retreat consumes prev', () => {
  let beat = 0;
  const handlers = { m1: { meeting: { enter: c => { beat = c.direction === 'back' ? 3 : 0; },
    advance: () => (beat < 3 ? (beat++, true) : false), retreat: () => (beat > 0 ? (beat--, true) : false) } } };
  const e = R.createEngine({ content: R.CONTENT, handlers });
  e.start(); e.goToId('m1', 'meeting');
  e.next(); e.next(); e.next();
  assert.equal(e.current().step.id, 'meeting'); assert.equal(beat, 3);
  e.next(); assert.equal(e.current().step.id, 'officers');
  e.prev(); assert.equal(e.current().step.id, 'meeting'); assert.equal(beat, 3);
  e.prev(); assert.equal(beat, 2); assert.equal(e.current().step.id, 'meeting');
});
