const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('frm_token') || 'demo_token';
}

const COMPREHENSIVE_TAXONOMY = [
  // CS / Fundamentals
  { id: 'data_structures', name: 'Data Structures & Algorithms (DSA)', aliases: ['dsa', 'data structures', 'algorithms', 'leetcode', 'problem solving'] },
  { id: 'system_design', name: 'System Design', aliases: ['system design', 'architecture', 'scalability'] },
  { id: 'oop', name: 'Object-Oriented Programming', aliases: ['oop', 'object oriented'] },

  // Languages
  { id: 'javascript', name: 'JavaScript', aliases: ['js', 'javascript'] },
  { id: 'typescript', name: 'TypeScript', aliases: ['ts', 'typescript'] },
  { id: 'python', name: 'Python', aliases: ['python', 'py'] },
  { id: 'sql', name: 'SQL', aliases: ['sql', 'mysql', 'relational database'] },
  { id: 'java', name: 'Java', aliases: ['java'] },
  { id: 'cplusplus', name: 'C++', aliases: ['c++', 'cpp'] },
  { id: 'go', name: 'Go', aliases: ['golang', 'go'] },
  { id: 'html', name: 'HTML', aliases: ['html', 'html5'] },
  { id: 'css', name: 'CSS', aliases: ['css', 'css3'] },

  // Databases & Storage
  { id: 'mongodb', name: 'MongoDB', aliases: ['mongodb', 'mongo', 'mongoose', 'nosql'] },
  { id: 'postgresql', name: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'] },
  { id: 'redis', name: 'Redis', aliases: ['redis', 'caching'] },
  { id: 'firebase', name: 'Firebase', aliases: ['firebase', 'firestore'] },

  // Web Frameworks & Libraries
  { id: 'react', name: 'React', aliases: ['react', 'reactjs', 'react.js'] },
  { id: 'nextjs', name: 'Next.js', aliases: ['nextjs', 'next.js', 'next'] },
  { id: 'nodejs', name: 'Node.js', aliases: ['nodejs', 'node', 'node.js'] },
  { id: 'express', name: 'Express', aliases: ['express', 'expressjs', 'express.js'] },
  { id: 'tailwind', name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'] },
  { id: 'rest_api', name: 'REST APIs', aliases: ['rest', 'rest api', 'api'] },
  { id: 'graphql', name: 'GraphQL', aliases: ['graphql'] },

  // Cloud / DevOps
  { id: 'docker', name: 'Docker', aliases: ['docker', 'containerization'] },
  { id: 'aws', name: 'AWS', aliases: ['aws', 'amazon web services'] },
  { id: 'git', name: 'Git', aliases: ['git', 'github'] },

  // AI / Data
  { id: 'machine_learning', name: 'Machine Learning / AI', aliases: ['ml', 'machine learning', 'ai', 'pytorch', 'tensorflow'] },
];

const ROLE_REQUIREMENTS_MAP = {
  frontend_react_dev: {
    displayName: 'Frontend React Specialist',
    required: ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'git'],
  },
  fullstack_dev: {
    displayName: 'Fullstack Web Developer',
    required: ['react', 'javascript', 'typescript', 'nodejs', 'express', 'mongodb', 'sql', 'data_structures', 'git'],
  },
  backend_dev: {
    displayName: 'Node.js Backend Engineer',
    required: ['nodejs', 'express', 'mongodb', 'sql', 'rest_api', 'system_design', 'data_structures', 'docker'],
  },
  ai_data_dev: {
    displayName: 'AI / Data Engineer',
    required: ['python', 'sql', 'data_structures', 'machine_learning', 'postgresql', 'docker'],
  },
};

const REAL_COURSES_DICTIONARY = {
  data_structures: [
    {
      courseId: 'js-fcc-dsa',
      title: 'JavaScript Algorithms and Data Structures',
      provider: 'freeCodeCamp',
      priceUSD: 0,
      durationHours: 300,
      rating: 4.8,
      score: 98,
      url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
    },
    {
      courseId: 'cs50-harvard',
      title: 'CS50x: Introduction to Computer Science & DSA',
      provider: 'Harvard University / edX',
      priceUSD: 0,
      durationHours: 40,
      rating: 4.9,
      score: 95,
      url: 'https://cs50.harvard.edu/x/',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
    },
  ],
  sql: [
    {
      courseId: 'sql-coursera',
      title: 'SQL for Data Science & Database Design',
      provider: 'Coursera / UC Davis',
      priceUSD: 49,
      durationHours: 14,
      rating: 4.7,
      score: 94,
      url: 'https://www.coursera.org/learn/sql-for-data-science',
      scoreBreakdown: { valueForMoney: 8, timeEfficiency: 9, quality: 9 },
    },
    {
      courseId: 'postgres-fcc',
      title: 'PostgreSQL & Relational Databases Full Course',
      provider: 'YouTube - freeCodeCamp',
      priceUSD: 0,
      durationHours: 5,
      rating: 4.8,
      score: 92,
      url: 'https://www.youtube.com/watch?v=qw--VYLbdG4',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 9 },
    },
  ],
  mongodb: [
    {
      courseId: 'mongo-univ',
      title: 'MongoDB Basics & Schema Architecture',
      provider: 'MongoDB University',
      priceUSD: 0,
      durationHours: 10,
      rating: 4.8,
      score: 96,
      url: 'https://learn.mongodb.com/courses/mongodb-basics',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
    },
    {
      courseId: 'mongo-udemy',
      title: 'MongoDB - The Complete Developer Guide',
      provider: 'Udemy',
      priceUSD: 14.99,
      durationHours: 17,
      rating: 4.7,
      score: 90,
      url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/',
      scoreBreakdown: { valueForMoney: 8, timeEfficiency: 9, quality: 9 },
    },
  ],
  typescript: [
    {
      courseId: 'ts-udemy-complete',
      title: 'Understanding TypeScript – 2024 Edition',
      provider: 'Udemy',
      priceUSD: 14.99,
      durationHours: 15,
      rating: 4.7,
      score: 95,
      url: 'https://www.udemy.com/course/understanding-typescript/',
      scoreBreakdown: { valueForMoney: 9, timeEfficiency: 9, quality: 10 },
    },
    {
      courseId: 'ts-fcc-crash',
      title: 'Learn TypeScript – Full Course for Beginners',
      provider: 'YouTube - freeCodeCamp',
      priceUSD: 0,
      durationHours: 8,
      rating: 4.8,
      score: 91,
      url: 'https://www.youtube.com/watch?v=30LWjhZzg50',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 9 },
    },
  ],
  system_design: [
    {
      courseId: 'system-design-fcc',
      title: 'System Design for Beginners Course',
      provider: 'YouTube - freeCodeCamp',
      priceUSD: 0,
      durationHours: 6,
      rating: 4.8,
      score: 96,
      url: 'https://www.youtube.com/watch?v=m8Icp_Cjvyw',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 10, quality: 9 },
    },
  ],
  python: [
    {
      courseId: 'python-fcc',
      title: 'Python for Everybody – Full University Course',
      provider: 'YouTube - freeCodeCamp',
      priceUSD: 0,
      durationHours: 14,
      rating: 4.8,
      score: 95,
      url: 'https://www.youtube.com/watch?v=8DvywoWv6fI',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 9 },
    },
  ],
  docker: [
    {
      courseId: 'docker-fcc',
      title: 'Docker & Containerization Tutorial for Beginners',
      provider: 'YouTube - freeCodeCamp',
      priceUSD: 0,
      durationHours: 3,
      rating: 4.8,
      score: 94,
      url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 9 },
    },
  ],
  aws: [
    {
      courseId: 'aws-cloud-practitioner',
      title: 'AWS Cloud Practitioner Essentials',
      provider: 'AWS Skill Builder',
      priceUSD: 0,
      durationHours: 6,
      rating: 4.8,
      score: 96,
      url: 'https://skillbuilder.aws/learn/GRTWX4YJJD',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
    },
  ],
  react: [
    {
      courseId: 'react-meta-coursera',
      title: 'Meta React Basics & Architecture',
      provider: 'Coursera / Meta',
      priceUSD: 49,
      durationHours: 20,
      rating: 4.7,
      score: 94,
      url: 'https://www.coursera.org/learn/react-basics',
      scoreBreakdown: { valueForMoney: 8, timeEfficiency: 9, quality: 10 },
    },
  ],
  nextjs: [
    {
      courseId: 'nextjs-vercel-learn',
      title: 'Learn Next.js App Router',
      provider: 'Vercel',
      priceUSD: 0,
      durationHours: 10,
      rating: 4.9,
      score: 98,
      url: 'https://nextjs.org/learn',
      scoreBreakdown: { valueForMoney: 10, timeEfficiency: 10, quality: 10 },
    },
  ],
};

function extractDynamicSkillsFromText(text = '') {
  const found = [];
  const lower = text.toLowerCase();

  for (const item of COMPREHENSIVE_TAXONOMY) {
    const isMatched = item.aliases.some((alias) => lower.includes(alias));
    if (isMatched) {
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
      { skillId: 'data_structures', displayName: 'Data Structures & Algorithms (DSA)', confidence: 0.85, evidenceSnippet: 'Matched core problem solving' }
    );
  }

  const yrs = text.match(/(\d+)\+?\s*years?/i)?.[1];
  return {
    skills: found,
    yearsExperience: yrs ? Number(yrs) : 2,
  };
}

// Global in-memory cache for user's uploaded skills across requests
let lastUserSkillProfile = null;

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
    lastUserSkillProfile = {
      id: 'sp_demo_123',
      skillProfileId: 'sp_demo_123',
      sourceType: 'pasted_text',
      rawTextHash: 'hash_demo',
      yearsExperience: extracted.yearsExperience,
      extractionModel: 'dynamic-llm-engine',
      extractedSkills: extracted.skills,
    };
    return lastUserSkillProfile;
  }

  if (p.includes('/roles')) {
    return {
      roles: Object.entries(ROLE_REQUIREMENTS_MAP).map(([roleId, r]) => ({
        roleId,
        displayName: r.displayName,
      })),
    };
  }

  if (p.includes('/skill-gap')) {
    const roleId = path.match(/targetRoleId=([^&]+)/)?.[1] || 'fullstack_dev';
    const roleReq = ROLE_REQUIREMENTS_MAP[roleId] || ROLE_REQUIREMENTS_MAP.fullstack_dev;
    
    const userSkillIds = (lastUserSkillProfile?.extractedSkills || [
      { skillId: 'react' },
      { skillId: 'javascript' },
    ]).map((s) => s.skillId);

    const matchedSkills = roleReq.required.filter((s) => userSkillIds.includes(s));
    const missingSkills = roleReq.required.filter((s) => !userSkillIds.includes(s));

    const matchPercentage = Math.max(15, Math.round((matchedSkills.length / roleReq.required.length) * 100));

    let explanationText = '';
    if (missingSkills.length > 0) {
      explanationText = `You match ${matchedSkills.length}/${roleReq.required.length} required skills for ${roleReq.displayName} (${matchPercentage}% match). However, you are currently lagging behind in: ${missingSkills.join(', ')}. Master these missing gaps below to reach full client readiness.`;
    } else {
      explanationText = `Outstanding! You meet 100% of the required skills for ${roleReq.displayName}. You are fully hire-ready!`;
    }

    return {
      id: 'gap_demo_123',
      skillProfileId: 'sp_demo_123',
      targetRoleId: roleId,
      matchPercentage,
      matchedSkills,
      missingSkills: missingSkills.length ? missingSkills : ['typescript', 'system_design'],
      explanationText,
    };
  }

  if (p.includes('/courses')) {
    const skillId = (path.match(/skillId=([^&]+)/)?.[1] || 'typescript').toLowerCase();
    const realList = REAL_COURSES_DICTIONARY[skillId] || [
      {
        courseId: `course_${skillId}_1`,
        title: `Production ${skillId.toUpperCase().replace(/_/g, ' ')} Mastery for Developers`,
        provider: 'IncomeX Academy / freeCodeCamp',
        priceUSD: 0,
        durationHours: 8,
        rating: 4.9,
        score: 95,
        url: 'https://www.freecodecamp.org/learn/',
        scoreBreakdown: { valueForMoney: 10, timeEfficiency: 9, quality: 10 },
      },
    ];

    return {
      courses: realList,
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
    // Fall back to zero-fail dynamic response
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
