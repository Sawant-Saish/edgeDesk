import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { useJourney } from '../../../context/JourneyContext';

const DEFAULT_COURSES = [
  {
    courseId: 'course_ts_1',
    title: 'Production TypeScript for React Engineers',
    provider: 'IncomeX Academy',
    priceUSD: 0,
    durationHours: 8,
    rating: 4.9,
    score: 95,
    url: 'https://incomex.ai/courses/typescript',
    scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
  },
  {
    courseId: 'course_mongo_1',
    title: 'MongoDB & Mongoose Schema Design',
    provider: 'IncomeX Academy',
    priceUSD: 29,
    durationHours: 6,
    rating: 4.8,
    score: 90,
    url: 'https://incomex.ai/courses/mongodb',
    scoreBreakdown: { valueForMoney: 8, timeEfficiency: 9, quality: 9 },
  },
];

export default function CourseCompare() {
  const {
    gapResult,
    selectedSkillId,
    setSelectedSkillId,
    courses,
    setCourses,
    setStep,
  } = useJourney();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('score');

  const skills = gapResult?.missingSkills || ['typescript', 'mongodb'];

  useEffect(() => {
    if (!selectedSkillId && skills[0]) setSelectedSkillId(skills[0]);
  }, [skills, selectedSkillId, setSelectedSkillId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.courses(selectedSkillId || 'typescript');
        const list = Array.isArray(data) ? data : data?.courses || DEFAULT_COURSES;
        if (!cancelled) setCourses(list);
      } catch {
        if (!cancelled) setCourses(DEFAULT_COURSES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedSkillId, setCourses]);

  const sorted = [...(courses.length ? courses : DEFAULT_COURSES)].sort((a, b) => {
    if (sortKey === 'priceUSD') return a.priceUSD - b.priceUSD;
    if (sortKey === 'durationHours') return a.durationHours - b.durationHours;
    if (sortKey === 'rating') return b.rating - a.rating;
    return b.score - a.score;
  });

  return (
    <section className="feature">
      <header className="feature-head">
        <h2>Course comparator</h2>
        <p>Ranked with a fixed arithmetic rubric — no LLM opinion in the scores.</p>
      </header>

      <div className="row wrap">
        <label>
          Gap skill
          <select
            value={selectedSkillId || ''}
            onChange={(e) => setSelectedSkillId(e.target.value)}
          >
            {skills.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="score">Score</option>
            <option value="priceUSD">Price</option>
            <option value="durationHours">Duration</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      {error && <p className="error-banner">{error}</p>}
      {loading && <p className="muted">Scoring courses…</p>}

      {!loading && sorted.length === 0 && (
        <p className="muted">No seeded courses for this skill yet.</p>
      )}

      {sorted.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Hours</th>
                <th>Rating</th>
                <th>Score</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.courseId}>
                  <td>
                    <strong>{c.title}</strong>
                    {c.scoreBreakdown && (
                      <div className="mini">
                        V{c.scoreBreakdown.valueForMoney} · T
                        {c.scoreBreakdown.timeEfficiency} · Q{c.scoreBreakdown.quality}
                      </div>
                    )}
                  </td>
                  <td>{c.provider}</td>
                  <td>{c.priceUSD === 0 ? 'Free' : `$${c.priceUSD}`}</td>
                  <td>{c.durationHours}h</td>
                  <td>{c.rating}</td>
                  <td>
                    <strong>{c.score}</strong>
                  </td>
                  <td>
                    <a href={c.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" className="btn primary" onClick={() => setStep('negotiate')}>
        Practice negotiating →
      </button>
    </section>
  );
}
