import { setState, getState } from "./store.js";

const KEY = "session";

export function loadSessionFromStorage() {
  const raw = localStorage.getItem(KEY);
  const session = raw ? JSON.parse(raw) : null;
  setState({ session });
}

export function loginSession(user) {
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  localStorage.setItem(KEY, JSON.stringify(session));
  setState({ session });
}

export function logoutSession() {
  localStorage.removeItem(KEY);
  setState({ session: null });
}

export function isLoggedIn() {
  return !!getState().session;
}

export function isAdmin() {
  return getState().session?.role === "admin";
}