/**
 * Course scoring rubric unit tests (Phase 2 acceptance).
 */
const assert = require('assert');
const { scoreCourses } = require('../modules/frm/courses/courses.service');

function run() {
  // Case 1: free + short + high rating should beat expensive + long
  const set1 = scoreCourses([
    {
      courseId: 'a',
      title: 'A',
      provider: 'X',
      priceUSD: 0,
      durationHours: 5,
      rating: 5,
      lastUpdated: '2024-06-01',
      url: 'https://example.com/a',
    },
    {
      courseId: 'b',
      title: 'B',
      provider: 'Y',
      priceUSD: 100,
      durationHours: 40,
      rating: 3,
      lastUpdated: '2020-01-01',
      url: 'https://example.com/b',
    },
  ]);
  assert.strictEqual(set1[0].courseId, 'a');
  assert.ok(set1[0].score > set1[1].score);

  // Case 2: quality = (rating/5)*40; recency penalty −5 when >2 years
  const set2 = scoreCourses([
    {
      courseId: 'fresh',
      title: 'Fresh',
      provider: 'P',
      priceUSD: 10,
      durationHours: 10,
      rating: 5,
      lastUpdated: new Date().toISOString(),
      url: 'https://example.com/f',
    },
    {
      courseId: 'old',
      title: 'Old',
      provider: 'P',
      priceUSD: 10,
      durationHours: 10,
      rating: 5,
      lastUpdated: '2019-01-01',
      url: 'https://example.com/o',
    },
  ]);
  assert.strictEqual(set2.find((c) => c.courseId === 'fresh').scoreBreakdown.quality, 40);
  assert.strictEqual(set2.find((c) => c.courseId === 'old').scoreBreakdown.quality, 35);

  // Case 3: equal price/duration → full 30 for both value & time
  const set3 = scoreCourses([
    {
      courseId: 'c1',
      title: 'C1',
      provider: 'P',
      priceUSD: 20,
      durationHours: 8,
      rating: 4,
      lastUpdated: '2024-01-01',
      url: 'https://example.com/c1',
    },
    {
      courseId: 'c2',
      title: 'C2',
      provider: 'P',
      priceUSD: 20,
      durationHours: 8,
      rating: 4,
      lastUpdated: '2024-01-01',
      url: 'https://example.com/c2',
    },
  ]);
  assert.strictEqual(set3[0].scoreBreakdown.valueForMoney, 30);
  assert.strictEqual(set3[0].scoreBreakdown.timeEfficiency, 30);
  assert.strictEqual(set3[0].score, set3[1].score);

  console.log('Course scoring tests: PASS');
}

run();
