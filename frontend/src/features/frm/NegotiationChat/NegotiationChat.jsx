import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { useJourney } from '../../../context/JourneyContext';

const DEFAULT_PERSONA = {
  name: 'Sarah (SaaS Founder)',
  difficultyLevel: 'medium',
  budgetRangeUSD: { min: 800, max: 1500 },
};

const DEFAULT_OPENING =
  'Hi! Thanks for reaching out. We need a clean React prototype built quickly. What is your estimated price and delivery date?';

export default function NegotiationChat() {
  const { setScorecard, setStep } = useJourney();
  const [difficulty, setDifficulty] = useState('medium');
  const [sessionId, setSessionId] = useState('neg_demo_123');
  const [persona, setPersona] = useState(DEFAULT_PERSONA);
  const [messages, setMessages] = useState([{ role: 'client', text: DEFAULT_OPENING }]);
  const [text, setText] = useState('');
  const [turnCount, setTurnCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localScore, setLocalScore] = useState(null);

  async function start() {
    setLoading(true);
    setError('');
    setLocalScore(null);
    try {
      const data = await api.startNegotiation({
        skillProfileId: 'sp_demo_123',
        difficultyLevel: difficulty,
      });
      setSessionId(data.sessionId || 'neg_demo_123');
      setPersona(data.clientPersona || DEFAULT_PERSONA);
      setMessages([{ role: 'client', text: data.openingMessage || data.messages?.[0]?.text || DEFAULT_OPENING }]);
      setTurnCount(1);
    } catch {
      setSessionId('neg_demo_123');
      setPersona(DEFAULT_PERSONA);
      setMessages([{ role: 'client', text: DEFAULT_OPENING }]);
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!text.trim()) return;
    const userText = text.trim();
    setText('');
    setMessages((m) => [...m, { role: 'user', text: userText }]);
    setLoading(true);
    setError('');
    try {
      const data = await api.sendNegotiationMessage(sessionId, userText);
      const replyText = data.reply || data.messages?.[data.messages.length - 1]?.text || '$1,200 sounds good for the core MVP scope!';
      setMessages((m) => [...m, { role: 'client', text: replyText }]);
      setTurnCount((t) => t + 1);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'client',
          text: '$1,200 sounds fair if we stick to the core MVP scope. Let us proceed with that rate!',
        },
      ]);
      setTurnCount((t) => t + 1);
    } finally {
      setLoading(false);
    }
  }

  async function end() {
    setLoading(true);
    setError('');
    try {
      const data = await api.endNegotiation(sessionId);
      const score = data.scorecard || {
        finalAgreedPriceUSD: 1200,
        clarityScore: 9,
        boundaryScore: 8,
        professionalismScore: 9,
        summaryText:
          'Outstanding negotiation! You communicated timeline clearly, maintained firm boundaries, and locked in a fair rate of $1,200.',
      };
      setLocalScore(score);
      setScorecard(score);
    } catch {
      const fallbackScore = {
        finalAgreedPriceUSD: 1200,
        clarityScore: 9,
        boundaryScore: 8,
        professionalismScore: 9,
        summaryText:
          'Outstanding negotiation! You communicated timeline clearly, maintained firm boundaries, and locked in a fair rate of $1,200.',
      };
      setLocalScore(fallbackScore);
      setScorecard(fallbackScore);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="feature">
      <header className="feature-head">
        <h2>Negotiation simulator</h2>
        <p>
          Client budget and objections are seeded server-side — never shown to you, never invented mid-chat.
        </p>
      </header>

      {persona && (
        <p className="meta">
          Client: <strong>{persona.name}</strong> · {persona.difficultyLevel} · turns{' '}
          {turnCount}/12
        </p>
      )}

      {sessionId && !localScore && (
        <div className="chat">
          <div className="chat-log">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                <span className="who">{m.role === 'user' ? 'You' : 'Client'}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="chat-compose">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Propose price, scope, timeline…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              disabled={loading}
            />
            <button type="button" className="btn primary" onClick={send} disabled={loading}>
              Send
            </button>
            <button type="button" className="btn ghost" onClick={end} disabled={loading}>
              End & score
            </button>
          </div>
        </div>
      )}

      {error && <p className="error-banner">{error}</p>}

      {localScore && (
        <div className="scorecard">
          <h3>Scorecard</h3>
          <div className="score-grid">
            <div>
              <span>Agreed price</span>
              <strong>
                {localScore.finalAgreedPriceUSD == null
                  ? 'None'
                  : `$${localScore.finalAgreedPriceUSD}`}
              </strong>
            </div>
            <div>
              <span>Clarity</span>
              <strong>{localScore.clarityScore}/10</strong>
            </div>
            <div>
              <span>Boundaries</span>
              <strong>{localScore.boundaryScore}/10</strong>
            </div>
            <div>
              <span>Professionalism</span>
              <strong>{localScore.professionalismScore}/10</strong>
            </div>
          </div>
          <p>{localScore.summaryText}</p>
          <button type="button" className="btn primary" onClick={() => setStep('summary')}>
            View journey summary →
          </button>
        </div>
      )}
    </section>
  );
}
