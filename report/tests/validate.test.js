// Run: node --test report/tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../src/content.js');
require('../src/validate.js');

const clone = o => JSON.parse(JSON.stringify(o));
const scene = (c, id) => c.scenes.find(s => s.id === id);

test('real content is valid', () => {
  assert.deepEqual(R.validateContent(R.CONTENT), []);
});

test('7-word headline flagged once', () => {
  const c = clone(R.CONTENT);
  scene(c, 'm2').steps[1].headline = 'one two three four five six seven';
  const issues = R.validateContent(c);
  assert.equal(issues.filter(i => i.rule === 'headline-words').length, 1);
});

test('26-word caption and 3 sentences flagged', () => {
  const c = clone(R.CONTENT);
  scene(c, 'm1').steps[1].caption = Array(26).fill('word').join(' ');
  scene(c, 'm1').steps[2].caption = 'One. Two. Three.';
  const rules = R.validateContent(c).map(i => i.rule);
  assert.ok(rules.includes('caption-words'));
  assert.ok(rules.includes('caption-sentences'));
});

test('5 labels flagged', () => {
  const c = clone(R.CONTENT);
  scene(c, 'm3').steps[1].labels = ['a', 'b', 'c', 'd', 'e'];
  assert.ok(R.validateContent(c).some(i => i.rule === 'label-count'));
});

test('quiz answers in order and 2 per member', () => {
  const answers = [];
  for (const id of ['m1', 'm2', 'm3', 'm4']) {
    assert.equal(scene(R.CONTENT, id).quiz.length, 2, id);
    scene(R.CONTENT, id).quiz.forEach(q => { answers.push(q.answer); assert.equal(q.choices.length, 4); });
  }
  assert.deepEqual(answers, ['D', 'C', 'A', 'C', 'C', 'D', 'A', 'C']);
});

test('spot facts match the book', () => {
  const all = JSON.stringify(R.CONTENT);
  assert.ok(scene(R.CONTENT, 'm2').quiz.some(q => q.choices.includes('P6,200')));
  assert.ok(scene(R.CONTENT, 'm1').steps.some(s => /Ongjuco/.test(s.caption)));
  assert.ok(scene(R.CONTENT, 'm4').steps.some(s => /August 6, 1896/.test(s.date || '')));
  assert.ok(scene(R.CONTENT, 'm2').steps.some(s => s.date === 'July 14 → 17, 1892'));
  assert.ok(/Rhacophorus rizali/.test(all) && /Apogonia rizali/.test(all));
  assert.ok(/4 years, 13 days/i.test(all));
});

test('every step has notes and a page; member scenes open with a title card', () => {
  for (const s of R.CONTENT.scenes) {
    for (const st of s.steps) {
      assert.ok(st.notes.length >= 1, `${s.id}/${st.id} notes`);
      assert.ok(st.page, `${s.id}/${st.id} page`);
    }
    if (s.member) assert.equal(s.steps[0].id, 'title', s.id);
  }
});

test('step ids unique within each scene', () => {
  for (const s of R.CONTENT.scenes) {
    const ids = s.steps.map(x => x.id);
    assert.equal(new Set(ids).size, ids.length, s.id);
  }
});
