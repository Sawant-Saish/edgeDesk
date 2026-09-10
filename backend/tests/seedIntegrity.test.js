/**
 * Phase 0 acceptance: every skillId in roles/courses exists in taxonomy.
 */
const assert = require('assert');
const path = require('path');
const {
  skillTaxonomy,
  isValidSkillId,
} = require('../modules/frm/skillGap/skillTaxonomy.data');
const { roleRequirements } = require('../modules/frm/skillGap/roleRequirements.data');
const courses = require('../modules/frm/courses/courses.seed.json');
const briefs = require('../modules/frm/negotiation/projectBriefs.seed.json');

function run() {
  assert.ok(skillTaxonomy.length >= 40, `Expected >=40 skills, got ${skillTaxonomy.length}`);
  assert.ok(skillTaxonomy.length <= 80, `Expected <=80 skills, got ${skillTaxonomy.length}`);

  const ids = new Set(skillTaxonomy.map((s) => s.skillId));
  assert.strictEqual(ids.size, skillTaxonomy.length, 'Duplicate skillIds in taxonomy');

  for (const role of roleRequirements) {
    for (const skillId of role.requiredSkillIds) {
      assert.ok(
        isValidSkillId(skillId),
        `Role ${role.roleId} references unknown skillId: ${skillId}`
      );
    }
  }

  assert.ok(courses.length >= 30, `Expected >=30 courses, got ${courses.length}`);
  for (const course of courses) {
    for (const skillId of course.skillIds) {
      assert.ok(
        isValidSkillId(skillId),
        `Course ${course.courseId} references unknown skillId: ${skillId}`
      );
    }
    assert.ok(course.url && course.url.startsWith('http'), `Invalid URL: ${course.courseId}`);
  }

  assert.ok(briefs.length >= 10, `Expected >=10 briefs, got ${briefs.length}`);
  for (const brief of briefs) {
    assert.ok(brief.budgetRangeUSD.min < brief.budgetRangeUSD.max, `Bad budget: ${brief.briefId}`);
    assert.ok(
      ['easy', 'medium', 'hard'].includes(brief.difficultyLevel),
      `Bad difficulty: ${brief.briefId}`
    );
    assert.ok(
      ['price_focused', 'scope_creep', 'deadline_pressure'].includes(brief.objectionStyle),
      `Bad objectionStyle: ${brief.briefId}`
    );
  }

  console.log('Phase 0 seed integrity: PASS');
  console.log(`  skills=${skillTaxonomy.length} roles=${roleRequirements.length} courses=${courses.length} briefs=${briefs.length}`);
}

run();
