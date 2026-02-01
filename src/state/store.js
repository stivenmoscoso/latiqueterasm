const listeners = new Set();

let state = {
  session: null, // {id,name,email,role} | null
  ui: { toast: null } // { type, title, message, id } | null
};

export function getState() {
  return state;
}

export function setState(partial) {
  state = {
    ...state,
    ...partial,
    ui: partial.ui ? { ...state.ui, ...partial.ui } : state.ui
  };
  listeners.forEach((l) => l(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}