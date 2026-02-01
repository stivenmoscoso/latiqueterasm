import { el } from "../utils/dom.js";
import { subscribe, getState } from "../state/store.js";
import { logoutSession } from "../state/sessionSlice.js";
import { showToast } from "../state/uiSlice.js";

export default function Navbar() {
  const node = el(`<nav class="nav">
    <div class="left">
      <a class="brand" href="#/events">La Tiquetera SM</a>
      <span class="badge" id="role-badge"></span>
    </div>
    <div class="right" id="nav-actions"></div>
  </nav>`);

  const roleBadge = node.querySelector("#role-badge");
  const actions = node.querySelector("#nav-actions");

  function render() {
    const { session } = getState();

    if (!session) {
      roleBadge.textContent = "Invitado";
      actions.innerHTML = `
        <a class="btn" href="#/login">Login</a>
        <a class="btn primary" href="#/register">Registro</a>
      `;
      return;
    }

    roleBadge.textContent = session.role === "admin" ? "Admin" : "Visitor";

    const adminLink = session.role === "admin"
      ? `<a class="btn" href="#/admin/events">Admin</a>`
      : "";

    actions.innerHTML = `
      <a class="btn" href="#/events">Eventos</a>
      ${adminLink}
      <button class="btn danger" data-action="logout">Logout</button>
    `;
  }

  node.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    if (btn.dataset.action === "logout") {
      logoutSession();
      showToast({ type: "ok", title: "Sesión", message: "Has cerrado sesión." });
      location.hash = "#/login";
    }
  });

  render();
  subscribe(render);
  return node;
}