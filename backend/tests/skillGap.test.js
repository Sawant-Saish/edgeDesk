/**
 * Skill gap determinism tests (Phase 2 acceptance).
 */
const assert = require('assert');
const { computeGap } = require('../modules/frm/skillGap/skillGap.service');

function run() {
  const required = ['react', 'javascript', 'css', 'typescript', 'testing_jest', 'graphql'];
  const user = ['react', 'javascript', 'css', 'html'];

  const a = computeGap(user, required);
  const b = computeGap(user, required);

  assert.deepStrictEqual(a, b, 'gap computation must be deterministic');
  assert.deepStrictEqual(a.matchedSkills, ['react', 'javascript', 'css']);
  assert.deepStrictEqual(a.missingSkills, ['typescript', 'testing_jest', 'graphql']);
  assert.strictEqual(a.matchPercentage, 50);

  const empty = computeGap([], required);
  assert.strictEqual(empty.matchPercentage, 0);
  assert.strictEqual(empty.matchedSkills.length, 0);

  const full = computeGap(required, required);
  assert.strictEqual(full.matchPercentage, 100);
  assert.strictEqual(full.missingSkills.length, 0);

  console.log('Skill gap tests: PASS');
}

run();
