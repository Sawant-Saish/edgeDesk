import { useState } from 'react';
import { api } from '../../../api/client';
import { useJourney } from '../../../context/JourneyContext';

const SAMPLE = `Jordan Lee — Full Stack Developer
2 years experience building web apps.

Skills: React, JavaScript, HTML, CSS, Node.js, Express, MongoDB, Git, REST APIs.
Built 3 React dashboards for SaaS clients. Implemented JWT authentication on Express APIs.
Deployed Node services and wrote unit tests with Jest on smaller modules.`;

export default function ResumeUpload() {
  const { setSkillProfile, setStep } = useJourney();
  const [pastedText, setPastedText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function analyze() {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      let data;
      if (file) data = await api.uploadResumeFile(file);
      else data = await api.uploadResumeText(pastedText);
      setResult(data);
      setSkillProfile(data);
    } catch (err) {
      setError(err.message || 'Could not analyze resume.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="feature">
      <header className="feature-head">
        <h2>Resume intake</h2>
        <p>Upload a PDF or paste text. Skills are matched to a closed taxonomy — never invented.</p>
      </header>

      <div className="split">
        <div className="stack">
          <label className="file-label">
            PDF resume
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setPastedText('');
              }}
            />
          </label>
          <p className="or">or</p>
          <label>
            Paste resume text
            <textarea
              rows={12}
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                setFile(null);
              }}
              placeholder="Paste your resume here…"
            />
          </label>
          <div className="row">
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setPastedText(SAMPLE);
                setFile(null);
              }}
            >
              Use sample resume
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={loading || (!file && pastedText.trim().length < 40)}
              onClick={analyze}
            >
              {loading ? 'Extracting…' : 'Extract skills'}
            </button>
          </div>
          {error && <p className="error-banner">{error}</p>}
        </div>

        <div className="stack results">
          {!result && !loading && (
            <p className="muted">Results appear here with confidence badges.</p>
          )}
          {loading && <p className="muted">Analyzing — schema-validated before display…</p>}
          {result && (
            <>
              {result.lowConfidenceWarning && (
                <p className="warn-banner">Some skills have low confidence — review evidence.</p>
              )}
              <p className="meta">
                ~{result.yearsExperience} yrs experience · {result.extractedSkills.length} skills
              </p>
              <ul className="skill-list">
                {result.extractedSkills.map((s) => (
                  <li key={s.skillId}>
                    <div className="skill-row">
                      <strong>{s.displayName}</strong>
                      <span className={`conf ${s.confidence < 0.55 ? 'low' : 'ok'}`}>
                        {Math.round(s.confidence * 100)}%
                      </span>
                    </div>
                    <p className="evidence">“{s.evidenceSnippet}”</p>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn primary"
                onClick={() => setStep('gap')}
              >
                Continue to skill gap →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
