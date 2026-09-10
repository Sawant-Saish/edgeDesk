import { useJourney } from '../../../context/JourneyContext';

export default function Dashboard() {
  const {
    skillProfile,
    gapResult,
    courses,
    scorecard,
    incomeXContribution,
    resetJourney,
    setStep,
  } = useJourney();

  return (
    <section className="feature">
      <header className="feature-head">
        <h2>Journey summary</h2>
        <p>Closed loop complete — readiness signal from skills, gaps, and negotiation practice.</p>
      </header>

      {incomeXContribution && (
        <div className="score-hero">
          <p className="eyebrow">IncomeX readiness contribution</p>
          <p className="big-num">{incomeXContribution.combined}</p>
          <p className="muted">
            Gap match {incomeXContribution.gapScore}
            {incomeXContribution.negoAvg != null
              ? ` · Negotiation ${incomeXContribution.negoAvg}`
              : ''}
          </p>
        </div>
      )}

      <div className="summary-grid">
        <article>
          <h3>Skills extracted</h3>
          <p>{skillProfile?.extractedSkills?.length || 0} taxonomy-matched skills</p>
        </article>
        <article>
          <h3>Role match</h3>
          <p>
            {gapResult
              ? `${gapResult.matchPercentage}% · ${gapResult.missingSkills.length} gaps`
              : 'Not run'}
          </p>
        </article>
        <article>
          <h3>Courses ranked</h3>
          <p>{courses.length ? `${courses.length} for selected gap` : 'Not run'}</p>
        </article>
        <article>
          <h3>Negotiation</h3>
          <p>
            {scorecard
              ? `Clarity ${scorecard.clarityScore} · Boundary ${scorecard.boundaryScore}`
              : 'Not completed'}
          </p>
        </article>
      </div>

      <div className="row">
        <button type="button" className="btn ghost" onClick={() => setStep('resume')}>
          Back to resume
        </button>
        <button type="button" className="btn primary" onClick={resetJourney}>
          Run again
        </button>
      </div>
    </section>
  );
}
