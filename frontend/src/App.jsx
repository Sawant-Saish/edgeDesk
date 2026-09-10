import { useState } from 'react';
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
      <strong>Attention:</strong> This is just a working prototype for a hackathon.
      We will continue building and polishing it soon.
    </aside>
  );
}

function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        try {
          await login(email, password);
        } catch (loginErr) {
          // If login fails because account doesn't exist yet, auto-register for seamless experience
          if (loginErr.status === 401 || loginErr.message?.includes('Invalid')) {
            await register(email.split('@')[0] || 'Freelancer', email, password);
          } else {
            throw loginErr;
          }
        }
      } else {
        await register(name || 'Freelancer', email, password);
      }
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check credentials or try Quick Demo Sign-In.');
    } finally {
      setLoading(false);
    }
  }

  async function onQuickDemo() {
    setError('');
    setLoading(true);
    const demoEmail = `demo_${Math.floor(Math.random() * 8999 + 1000)}@incomex.ai`;
    try {
      await register('Demo Freelancer', demoEmail, 'demo123456');
    } catch {
      try {
        await login('demo@incomex.ai', 'demo123456');
      } catch (err) {
        setError(err.message || 'Demo sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <PrototypeNotice />
      <div className="auth-panel">
        <p className="eyebrow">IncomeX module</p>
        <h1 className="brand">EdgeDesk</h1>
        <p className="lede">
          Resume → skill gap → ranked courses → negotiation practice. One closed loop.
        </p>
        <form className="auth-form" onSubmit={onSubmit}>
          {mode === 'register' && (
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          {error && <p className="error-banner">{error}</p>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <button
            className="btn secondary"
            type="button"
            style={{ marginTop: '8px' }}
            onClick={onQuickDemo}
            disabled={loading}
          >
            ⚡ Quick Demo Sign-In
          </button>
        </form>
        <button
          className="linkish"
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthed, user, logout } = useAuth();
  const { step, setStep, STEPS, resetJourney } = useJourney();

  if (!isAuthed) return <AuthScreen />;

  return (
    <div className="app-shell">
      <PrototypeNotice />
      <header className="topbar">
        <div>
          <p className="eyebrow">IncomeX · FRM</p>
          <h1 className="brand-sm">EdgeDesk</h1>
        </div>
        <div className="topbar-actions">
          <span className="user-chip">{user?.name || user?.email}</span>
          <button className="btn ghost" type="button" onClick={resetJourney}>
            Restart
          </button>
          <button className="btn ghost" type="button" onClick={logout}>
            Sign out
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
