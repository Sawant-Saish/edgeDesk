const API_BASE = '';

function getToken() {
  return localStorage.getItem('frm_token');
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.code = data.error || 'request_failed';
    err.status = res.status;
    throw err;
  }
  return data;
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
