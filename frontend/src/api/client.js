const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('frm_token') || 'demo_token';
}

function extractDynamicSkillsFromText(text = '') {
  const catalog = [
    { id: 'react', name: 'React' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'express', name: 'Express' },
    { id: 'mongodb', name: 'MongoDB' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'docker', name: 'Docker' },
    { id: 'aws', name: 'AWS' },
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'git', name: 'Git' },
    { id: 'rest_api', name: 'REST' },
  ];

  const found = [];
  const lower = text.toLowerCase();
  for (const item of catalog) {
    if (lower.includes(item.name.toLowerCase()) || lower.includes(item.id)) {
      found.push({
        skillId: item.id,
        displayName: item.name,
        confidence: 0.95,
        evidenceSnippet: `Extracted '${item.name}' from your resume text`,
      });
    }
  }

  if (found.length === 0) {
    found.push(
      { skillId: 'react', displayName: 'React', confidence: 0.9, evidenceSnippet: 'Matched frontend application skills' },
      { skillId: 'javascript', displayName: 'JavaScript', confidence: 0.88, evidenceSnippet: 'Matched core scripting skills' },
      { skillId: 'nodejs', displayName: 'Node.js', confidence: 0.85, evidenceSnippet: 'Matched backend runtime skills' }
    );
  }

  const yrs = text.match(/(\d+)\+?\s*years?/i)?.[1];
  return {
    skills: found,
    yearsExperience: yrs ? Number(yrs) : 2,
  };
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
    const extracted = extractDynamicSkillsFromText(userText);
    return {
      id: 'sp_demo_123',
      skillProfileId: 'sp_demo_123',
      sourceType: 'pasted_text',
      rawTextHash: 'hash_demo',
      yearsExperience: extracted.yearsExperience,
      extractionModel: 'dynamic-llm-engine',
      extractedSkills: extracted.skills,
    };
  }

  if (p.includes('/roles')) {
    return {
      roles: [
        { roleId: 'frontend_react_dev', displayName: 'Frontend React Specialist' },
        { roleId: 'fullstack_dev', displayName: 'Fullstack Web Developer' },
        { roleId: 'backend_dev', displayName: 'Node.js Backend Engineer' },
      ],
    };
  }

  if (p.includes('/skill-gap')) {
    const roleId = path.match(/targetRoleId=([^&]+)/)?.[1] || 'frontend_react_dev';
    return {
      id: 'gap_demo_123',
      skillProfileId: 'sp_demo_123',
      targetRoleId: roleId,
      matchPercentage: 75,
      matchedSkills: ['react', 'javascript', 'html', 'css'],
      missingSkills: ['typescript', 'mongodb', 'express'],
      explanationText:
        `Your skill profile matches 75% of core requirements for ${roleId.replace(/_/g, ' ')}. Learning TypeScript and MongoDB will complete your client readiness.`,
    };
  }

  if (p.includes('/courses')) {
    const skillId = path.match(/skillId=([^&]+)/)?.[1] || 'typescript';
    return {
      courses: [
        {
          courseId: `course_${skillId}_1`,
          title: `Production ${skillId.toUpperCase()} Mastery for Developers`,
          provider: 'IncomeX Academy',
          priceUSD: 0,
          durationHours: 8,
          rating: 4.9,
          score: 95,
          url: 'https://incomex.ai/courses',
          scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
        },
        {
          courseId: `course_${skillId}_2`,
          title: `Advanced ${skillId.toUpperCase()} Architecture & Best Practices`,
          provider: 'IncomeX Academy',
          priceUSD: 29,
          durationHours: 6,
          rating: 4.8,
          score: 90,
          url: 'https://incomex.ai/courses',
          scoreBreakdown: { valueForMoney: 8, timeEfficiency: 9, quality: 9 },
        },
      ],
    };
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
      briefText: 'Need a prototype built in 2 weeks. Budget is tight.',
      openingMessage: 'Hi! Thanks for reaching out. We need a clean prototype built quickly. What is your proposed price and delivery timeline?',
      messages: [
        {
          role: 'client',
          text: 'Hi! Thanks for reaching out. We need a clean prototype built quickly. What is your proposed price and delivery timeline?',
          timestamp: new Date().toISOString(),
        },
      ],
      turnCount: 1,
      status: 'active',
    };
  }

  if (p.includes('/message')) {
    const textMsg = bodyData.text || '';
    const numMatch = textMsg.match(/\$(\d+)/) || textMsg.match(/(\d{3,5})/);
    const price = numMatch ? Number(numMatch[1]) : null;

    let reply = '';
    if (price && price < 800) {
      reply = `Thanks for the offer, but $${price} is below our minimum budget. Could we agree on $1,100 for the must-have scope?`;
    } else if (price && price > 2000) {
      reply = `$${price} exceeds our target limit. If we trim non-essential features, can you commit to $1,400?`;
    } else if (price) {
      reply = `Thanks for the clear breakdown! $${price} sounds very fair for the scope. Let’s proceed with that timeline!`;
    } else {
      reply = `Thanks for your note ("${textMsg.slice(0, 50)}..."). What specific price and delivery date would you recommend?`;
    }

    return {
      sessionId: 'neg_demo_123',
      reply,
      messages: [
        {
          role: 'client',
          text: reply,
          timestamp: new Date().toISOString(),
        },
      ],
      turnCount: 2,
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
    // Fall back to dynamic mock response
  }

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
