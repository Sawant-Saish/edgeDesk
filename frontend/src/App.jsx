import { useAuth } from './context/AuthContext';
import { useJourney } from './context/JourneyContext';
import ResumeUpload from './features/frm/ResumeUpload/ResumeUpload';
import SkillGapView from './features/frm/SkillGapView/SkillGapView';
import CourseCompare from './features/frm/CourseCompare/CourseCompare';
import NegotiationChat from './features/frm/NegotiationChat/NegotiationChat';
import Dashboard from './features/frm/Dashboard/Dashboard';

const STEP_LABELS = {
  resume: 'Resume',
  gap: 'Skill Gap',
  courses: 'Courses',
  negotiate: 'Negotiate',
  summary: 'Summary',
};

function PrototypeNotice() {
  return (
    <aside className="prototype-notice" role="note">
      <strong>Attention:</strong> EdgeDesk Hackathon MVP — Open Access Mode.
    </aside>
  );
}

export default function App() {
  const { user } = useAuth();
  const { step, setStep, STEPS, resetJourney } = useJourney();

  return (
    <div className="app-shell">
      <PrototypeNotice />
      <header className="topbar">
        <div>
          <p className="eyebrow">IncomeX · FRM</p>
          <h1 className="brand-sm">EdgeDesk</h1>
        </div>
        <div className="topbar-actions">
          <span className="user-chip">{user?.name || 'Hackathon Visitor'}</span>
          <button className="btn ghost" type="button" onClick={resetJourney}>
            Restart Demo
          </button>
        </div>
      </header>

      <nav className="stepper" aria-label="Journey steps">
        {STEPS.map((s, i) => {
          const idx = STEPS.indexOf(step);
          const done = i < idx;
          const active = s === step;
          return (
            <button
              key={s}
              type="button"
              className={`step ${active ? 'active' : ''} ${done ? 'done' : ''}`}
              onClick={() => {
                if (done || active) setStep(s);
              }}
            >
              <span className="step-num">{i + 1}</span>
              {STEP_LABELS[s]}
            </button>
          );
        })}
      </nav>

      <main className="main-panel">
        {step === 'resume' && <ResumeUpload />}
        {step === 'gap' && <SkillGapView />}
        {step === 'courses' && <CourseCompare />}
        {step === 'negotiate' && <NegotiationChat />}
        {step === 'summary' && <Dashboard />}
      </main>
    </div>
  );
}
