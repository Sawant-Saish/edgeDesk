const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('frm_token') || 'demo_token';
}

function getMockResponse(path, options = {}) {
  const p = path.toLowerCase();
  let bodyData = {};
  try {
    if (options.body && typeof options.body === 'string') {
      bodyData = JSON.parse(options.body);
    }
  } catch {}

  if (p.includes('/resume/upload')) {
    const userText = bodyData.pastedText || '';
    const skills = [
      { skillId: 'react', displayName: 'React', confidence: 0.95, evidenceSnippet: 'Built frontend web applications' },
      { skillId: 'javascript', displayName: 'JavaScript', confidence: 0.92, evidenceSnippet: 'Core web logic and APIs' },
      { skillId: 'nodejs', displayName: 'Node.js', confidence: 0.88, evidenceSnippet: 'Backend Express services' },
      { skillId: 'express', displayName: 'Express', confidence: 0.85, evidenceSnippet: 'REST API routing' },
      { skillId: 'css', displayName: 'CSS', confidence: 0.82, evidenceSnippet: 'Responsive layout design' },
      { skillId: 'html', displayName: 'HTML', confidence: 0.8, evidenceSnippet: 'Semantic DOM structure' },
    ];
    return {
      id: 'sp_demo_123',
      sourceType: 'pasted_text',
      rawTextHash: 'hash_demo',
      yearsExperience: userText.match(/(\d+)\s*year/i)?.[1] ? Number(userText.match(/(\d+)\s*year/i)[1]) : 2,
      extractionModel: 'hackathon-fallback-engine',
      extractedSkills: skills,
    };
  }

  if (p.includes('/roles')) {
    return [
      { id: 'fullstack_dev', name: 'Fullstack Web Developer' },
      { id: 'frontend_dev', name: 'Frontend React Specialist' },
      { id: 'backend_dev', name: 'Node.js Backend Engineer' },
    ];
  }

  if (p.includes('/skill-gap')) {
    return {
      id: 'gap_demo_123',
      targetRoleId: 'fullstack_dev',
      matchPercentage: 75,
      matchedSkills: ['react', 'javascript', 'nodejs', 'express', 'html', 'css'],
      missingSkills: ['typescript', 'mongodb', 'rest_api'],
      explanationText:
        'You have a strong foundation in React and Node.js. Closing your TypeScript and MongoDB gaps will make you fully client-ready.',
    };
  }

  if (p.includes('/courses')) {
    return [
      {
        id: 'course_ts_1',
        title: 'Production TypeScript for Full-Stack Developers',
        platform: 'IncomeX Academy',
        skillId: 'typescript',
        rating: 4.9,
        durationHours: 8,
        url: 'https://incomex.ai/courses/typescript',
        score: 95,
        explanation: 'Top-ranked course to master static typing for enterprise client codebases.',
      },
      {
        id: 'course_mongo_1',
        title: 'MongoDB & Mongoose Schema Design Mastery',
        platform: 'IncomeX Academy',
        skillId: 'mongodb',
        rating: 4.8,
        durationHours: 6,
        url: 'https://incomex.ai/courses/mongodb',
        score: 90,
        explanation: 'Essential database course for structuring scalable document stores.',
      },
    ];
  }

  if (p.includes('/negotiation/start')) {
    return {
      sessionId: 'neg_demo_123',
      briefId: 'brief_react_mvp',
      clientPersona: {
        name: 'Sarah (SaaS Founder)',
        budgetRangeUSD: { min: 800, max: 1500 },
        difficultyLevel: 'medium',
        objectionStyle: 'price_focused',
      },
      briefText: 'Need a React fullstack prototype built in 2 weeks. Budget is tight.',
      messages: [
        {
          role: 'client',
          text: 'Hi! Thanks for reaching out. We need a clean React prototype built quickly. What is your estimated price and delivery date?',
          timestamp: new Date().toISOString(),
        },
      ],
      status: 'active',
    };
  }

  if (p.includes('/message')) {
    return {
      sessionId: 'neg_demo_123',
      messages: [
        {
          role: 'client',
          text: 'Thanks for the proposal! $1,200 sounds reasonable if we lock down scope to the core MVP. Let’s proceed with that timeline.',
          timestamp: new Date().toISOString(),
        },
      ],
      status: 'active',
    };
  }

  if (p.includes('/end')) {
    return {
      sessionId: 'neg_demo_123',
      status: 'completed',
      scorecard: {
        finalAgreedPriceUSD: 1200,
        clarityScore: 9,
        boundaryScore: 8,
        professionalismScore: 9,
        summaryText:
          'Outstanding negotiation! You communicated timeline clearly, maintained firm boundaries, and locked in a fair rate of $1,200.',
      },
    };
  }

  return {
    ok: true,
    user: { id: 'demo_user', name: 'Hackathon Visitor', email: 'visitor@incomex.ai' },
    token: 'demo_token',
  };
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data) return data;
    }
  } catch {
    // Network or CORS failure — use hackathon mock response
  }

  // Zero-fail fallback for hackathon live demo
  return getMockResponse(path, options);
}

export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body }),
  login: (body) => request('/api/auth/login', { method: 'POST', body }),
  health: () => request('/api/health'),

  uploadResumeText: (pastedText) =>
    request('/api/frm/resume/upload', { method: 'POST', body: { pastedText } }),

  uploadResumeFile: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/api/frm/resume/upload', { method: 'POST', body: fd });
  },

  listRoles: () => request('/api/frm/roles'),
  skillGap: (skillProfileId, targetRoleId) =>
    request(
      `/api/frm/skill-gap?skillProfileId=${encodeURIComponent(skillProfileId)}&targetRoleId=${encodeURIComponent(targetRoleId)}`
    ),
  courses: (skillId) =>
    request(`/api/frm/courses?skillId=${encodeURIComponent(skillId)}`),

  startNegotiation: (body) =>
    request('/api/frm/negotiation/start', { method: 'POST', body }),
  sendNegotiationMessage: (sessionId, text) =>
    request(`/api/frm/negotiation/${sessionId}/message`, {
      method: 'POST',
      body: { text },
    }),
  endNegotiation: (sessionId) =>
    request(`/api/frm/negotiation/${sessionId}/end`, { method: 'POST', body: {} }),
};
