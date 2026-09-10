import { useState } from 'react';
import { api } from '../../../api/client';
import { useJourney } from '../../../context/JourneyContext';

export default function NegotiationChat() {
  const { skillProfile, setScorecard, setStep } = useJourney();
  const [difficulty, setDifficulty] = useState('medium');
  const [sessionId, setSessionId] = useState(null);
  const [persona, setPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localScore, setLocalScore] = useState(null);

  async function start() {
    if (!skillProfile?.skillProfileId) {
      setError('Upload a resume first.');
      return;
    }
    setLoading(true);
    setError('');
    setLocalScore(null);
    try {
      const data = await api.startNegotiation({
        skillProfileId: skillProfile.skillProfileId,
        difficultyLevel: difficulty,
      });
      setSessionId(data.sessionId);
      setPersona(data.clientPersona);
      setMessages([{ role: 'client', text: data.openingMessage }]);
      setTurnCount(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!text.trim() || !sessionId) return;
    const userText = text.trim();
    setText('');
    setMessages((m) => [...m, { role: 'user', text: userText }]);
    setLoading(true);
    setError('');
    try {
      const data = await api.sendNegotiationMessage(sessionId, userText);
      setMessages((m) => [...m, { role: 'client', text: data.reply }]);
      setTurnCount(data.turnCount);
    } catch (err) {
      setError(err.message);
      if (err.code === 'turn_limit') {
        // force end path
      }
    } finally {
      setLoading(false);
    }
  }

  async function end() {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.endNegotiation(sessionId);
      setLocalScore(data.scorecard);
      setScorecard(data.scorecard);
    } catch (err) {
      setError(err.message);
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

      {!sessionId && (
        <div className="row wrap">
          <label>
            Difficulty
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <button type="button" className="btn primary" onClick={start} disabled={loading}>
            {loading ? 'Starting…' : 'Start session'}
          </button>
        </div>
      )}

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
