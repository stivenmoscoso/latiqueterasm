import { setState } from "./store.js";

export function showToast({ type = "info", title = "Mensaje", message = "" }) {
  const id = crypto.randomUUID?.() || String(Date.now());
  setState({ ui: { toast: { id, type, title, message } } });

  // auto-hide
  setTimeout(() => {
    setState({ ui: { toast: null } });
  }, 2600);
}