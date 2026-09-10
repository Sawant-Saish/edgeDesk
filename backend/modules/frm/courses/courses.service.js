const coursesSeed = require('./courses.seed.json');

const TWO_YEARS_MS = 2 * 365.25 * 24 * 60 * 60 * 1000;

/**
 * Fixed rubric from API contracts — pure arithmetic, no LLM.
 * valueForMoney (0-30) = inverse-normalized priceUSD within result set
 * timeEfficiency (0-30) = inverse-normalized durationHours within result set
 * quality (0-40) = (rating / 5) * 40, −5 if lastUpdated > 2 years old
 */
function scoreCourses(courses) {
  if (!courses.length) return [];

  const prices = courses.map((c) => c.priceUSD);
  const durations = courses.map((c) => c.durationHours);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDur = Math.min(...durations);
  const maxDur = Math.max(...durations);

  const now = Date.now();

  return courses
    .map((course) => {
      const valueForMoney =
        maxPrice === minPrice
          ? 30
          : ((maxPrice - course.priceUSD) / (maxPrice - minPrice)) * 30;

      const timeEfficiency =
        maxDur === minDur
          ? 30
          : ((maxDur - course.durationHours) / (maxDur - minDur)) * 30;

      let quality = (course.rating / 5) * 40;
      const updated = new Date(course.lastUpdated).getTime();
      if (Number.isFinite(updated) && now - updated > TWO_YEARS_MS) {
        quality = Math.max(0, quality - 5);
      }

      const scoreBreakdown = {
        valueForMoney: round1(valueForMoney),
        timeEfficiency: round1(timeEfficiency),
        quality: round1(quality),
      };

      return {
        courseId: course.courseId,
        title: course.title,
        provider: course.provider,
        priceUSD: course.priceUSD,
        durationHours: course.durationHours,
        rating: course.rating,
        score: round1(valueForMoney + timeEfficiency + quality),
        scoreBreakdown,
        url: course.url,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function getCoursesForSkill(skillId) {
  const filtered = coursesSeed.filter((c) => c.skillIds.includes(skillId));
  const scored = scoreCourses(filtered);
  return scored.slice(0, 5);
}

module.exports = {
  scoreCourses,
  getCoursesForSkill,
  coursesSeed,
};
