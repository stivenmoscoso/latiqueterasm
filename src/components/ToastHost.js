import { el } from "../utils/dom.js";
import { subscribe, getState } from "../state/store.js";

export default function ToastHost() {
  const node = el(`<div class="toast-host" aria-live="polite"></div>`);

  function render() {
    const toast = getState().ui.toast;
    node.innerHTML = "";

    if (!toast) return;

    const t = el(`<div class="toast ${toast.type === "error" ? "error" : toast.type === "ok" ? "ok" : ""}">
      <div class="title">${toast.title}</div>
      <div class="msg">${toast.message}</div>
    </div>`);

    node.appendChild(t);
  }

  render();
  subscribe(render);
  return node;
}