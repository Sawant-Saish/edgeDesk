import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { useJourney } from '../../../context/JourneyContext';

const DEFAULT_ROLES = [
  { roleId: 'frontend_react_dev', displayName: 'Frontend React Specialist' },
  { roleId: 'fullstack_dev', displayName: 'Fullstack Web Developer' },
  { roleId: 'backend_dev', displayName: 'Node.js Backend Engineer' },
];

export default function SkillGapView() {
  const { skillProfile, setGapResult, setStep, setSelectedSkillId, gapResult } =
    useJourney();
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [targetRoleId, setTargetRoleId] = useState('frontend_react_dev');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [local, setLocal] = useState(gapResult);

  useEffect(() => {
    api.listRoles()
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.roles;
        if (list && list.length) setRoles(list);
      })
      .catch(() => {});
  }, []);

  async function runGap() {
    const profileId = skillProfile?.skillProfileId || skillProfile?.id || 'sp_demo_123';
    setLoading(true);
    setError('');
    try {
      const data = await api.skillGap(profileId, targetRoleId);
      setLocal(data);
      setGapResult(data);
      if (data.missingSkills?.[0]) setSelectedSkillId(data.missingSkills[0]);
    } catch (err) {
      setError(err.message || 'Failed to compute skill gap');
    } finally {
      setLoading(false);
    }
  }

  // Auto-run gap calculation on load for seamless UX
  useEffect(() => {
    if (!local && skillProfile) {
      runGap();
    }
  }, [skillProfile]);

  return (
    <section className="feature">
      <header className="feature-head">
        <h2>Skill gap</h2>
        <p>Deterministic set-difference against a fixed role taxonomy — the LLM only writes the explanation.</p>
      </header>

      <div className="row wrap">
        <label>
          Target role
          <select value={targetRoleId} onChange={(e) => setTargetRoleId(e.target.value)}>
            {roles.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                {r.displayName}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn primary" onClick={runGap} disabled={loading}>
          {loading ? 'Computing…' : 'Compute gap'}
        </button>
      </div>

      {error && <p className="error-banner">{error}</p>}

      {local && (
        <div className="gap-panel">
          <div className="progress-wrap">
            <div className="progress-label">
              Match <strong>{local.matchPercentage}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${local.matchPercentage}%` }}
              />
            </div>
          </div>
          <p className="explanation">{local.explanationText}</p>
          <div className="chip-grid">
            <div>
              <h3>Matched</h3>
              <div className="chips">
                {(local.matchedSkills || []).map((id) => (
                  <span key={id} className="chip ok">
                    {id}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3>Missing</h3>
              <div className="chips">
                {(local.missingSkills || []).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="chip miss"
                    onClick={() => {
                      setSelectedSkillId(id);
                      setStep('courses');
                    }}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn primary"
            disabled={!local.missingSkills?.length}
            onClick={() => setStep('courses')}
          >
            Compare courses for a gap skill →
          </button>
        </div>
      )}
    </section>
  );
}
