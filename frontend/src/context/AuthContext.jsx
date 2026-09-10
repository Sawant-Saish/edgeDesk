import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'demo_hackathon_user',
  name: 'Hackathon Visitor',
  email: 'visitor@incomex.ai',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('frm_user');
    return raw ? JSON.parse(raw) : DEFAULT_DEMO_USER;
  });
  const [token, setToken] = useState(() => localStorage.getItem('frm_token') || 'demo_token');

  async function login(email, password) {
    const data = await api.login({ email, password }).catch(() => ({
      token: 'demo_token',
      user: DEFAULT_DEMO_USER,
    }));
    localStorage.setItem('frm_token', data.token);
    localStorage.setItem('frm_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password }).catch(() => ({
      token: 'demo_token',
      user: { id: 'demo_user', name: name || 'Freelancer', email: email || 'visitor@incomex.ai' },
    }));
    localStorage.setItem('frm_token', data.token);
    localStorage.setItem('frm_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setUser(DEFAULT_DEMO_USER);
    setToken('demo_token');
  }

  const value = useMemo(
    () => ({ user, token, login, register, logout, isAuthed: true }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
