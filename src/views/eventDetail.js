import { el } from "../utils/dom.js";
import { getEventById, registerToEvent, cancelRegistration } from "../api/events.api.js";
import { getState } from "../state/store.js";
import { showToast } from "../state/uiSlice.js";

export default function EventDetail({ params }) {
  const node = el(`<section class="card">
    <div class="row" style="justify-content: space-between;">
      <div>
        <h1 id="title">Evento</h1>
        <p id="meta"></p>
      </div>
      <div class="row">
        <a class="btn" href="#/events">Volver</a>
      </div>
    </div>

    <hr />
    <p id="desc"></p>

    <hr />
    <div class="row" id="actions"></div>
    <p id="status"></p>
  </section>`);

  const title = node.querySelector("#title");
  const meta = node.querySelector("#meta");
  const desc = node.querySelector("#desc");
  const actions = node.querySelector("#actions");
  const status = node.querySelector("#status");

  const eventId = params.id;
  const session = getState().session;

  async function render() {
    status.textContent = "Cargando...";
    actions.innerHTML = "";

    try {
      const ev = await getEventById(eventId);

      title.textContent = ev.title;
      meta.innerHTML = `
        <span class="badge">${ev.date}</span>
        <span class="badge">${ev.location}</span>
      `;
      desc.textContent = ev.description || "Sin descripción.";

      const attendees = Array.isArray(ev.attendees) ? ev.attendees : [];
      const used = attendees.length;
      const cap = Number(ev.capacity);
      const isFull = used >= cap;

      const isVisitor = session?.role === "visitor";
      const isAdmin = session?.role === "admin";
      const isRegistered = attendees.includes(session?.id);

      status.innerHTML = `
        Cupos: <strong>${used}/${cap}</strong>
        ${isFull ? `<span class="badge" style="border-color: var(--danger); color: var(--danger)">Lleno</span>` : ""}
      `;

      if (isAdmin) {
        actions.innerHTML = `<span class="badge">Los administradores no se registran a eventos.</span>`;
        return;
      }

      if (!isVisitor) {
        actions.innerHTML = `<span class="badge">Rol inválido / sesión no encontrada.</span>`;
        return;
      }

      if (isRegistered) {
        actions.innerHTML = `
          <button class="btn danger" data-action="cancel">Cancelar registro</button>
        `;
      } else {
        actions.innerHTML = `
          <button class="btn primary" data-action="register" ${isFull ? "disabled" : ""}>
            Registrarme
          </button>
        `;
      }
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
      status.textContent = "No se pudo cargar el evento.";
    }
  }

  node.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    try {
      if (btn.dataset.action === "register") {
        await registerToEvent(eventId, session.id);
        showToast({ type: "ok", title: "Evento", message: "Registro exitoso." });
        await render();
      }
      if (btn.dataset.action === "cancel") {
        await cancelRegistration(eventId, session.id);
        showToast({ type: "ok", title: "Evento", message: "Registro cancelado." });
        await render();
      }
    } catch (err) {
      showToast({ type: "error", title: "Validación", message: err.message });
    }
  });

  render();
  return node;
}