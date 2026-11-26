const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../src/content.js');
require('../src/quiz.js');

const m1 = R.CONTENT.scenes.find(s => s.id === 'm1').quiz;

test('answer right and wrong', () => {
  const qz = R.createQuiz(m1);
  assert.deepEqual(qz.answer(0, 'D'), { correct: true, correctLetter: 'D' });
  const q2 = R.createQuiz(m1);
  assert.deepEqual(q2.answer(0, 'A'), { correct: false, correctLetter: 'D' });
  assert.equal(q2.state(0), 'wrong');
});

test('reveal and reset', () => {
  const qz = R.createQuiz(m1);
  assert.equal(qz.reveal(1), 'C');
  assert.equal(qz.state(1), 'revealed');
  qz.reset(1);
  assert.equal(qz.state(1), 'open');
});

test('second answer on the same question is ignored', () => {
  const qz = R.createQuiz(m1);
  qz.answer(0, 'A');
  assert.equal(qz.answer(0, 'D'), null);
  assert.equal(qz.state(0), 'wrong');
});

test('teams default off and score', () => {
  const qz = R.createQuiz(m1);
  assert.equal(qz.teams.on, false);
  qz.teams.toggle(); qz.teams.add('L'); qz.teams.add('L'); qz.teams.add('R');
  assert.deepEqual(qz.teams.score(), { L: 2, R: 1 });
});
