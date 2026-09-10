import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('frm_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('frm_token'));

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem('frm_token', data.token);
    localStorage.setItem('frm_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password });
    localStorage.setItem('frm_token', data.token);
    localStorage.setItem('frm_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('frm_token');
    localStorage.removeItem('frm_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, login, register, logout, isAuthed: Boolean(token) }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
