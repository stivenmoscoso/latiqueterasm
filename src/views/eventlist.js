import { el } from "../utils/dom.js";
import { getEvents } from "../api/events.api.js";
import { getState } from "../state/store.js";
import { showToast } from "../state/uiSlice.js";

export default function EventsList() {
  const node = el(`<section class="card">
    <div class="row" style="justify-content: space-between;">
      <div>
        <h1>Eventos</h1>
        <p>Lista de eventos disponibles.</p>
      </div>
      <div id="hint"></div>
    </div>

    <div id="content"></div>
  </section>`);

  const content = node.querySelector("#content");
  const hint = node.querySelector("#hint");

  const session = getState().session;
  hint.innerHTML = session?.role === "admin"
    ? `<span class="badge">Eres admin: gestiona eventos en Admin</span>`
    : `<span class="badge">Eres visitor: puedes registrarte a eventos</span>`;

  async function load() {
    content.innerHTML = `<p>Cargando...</p>`;
    try {
      const events = await getEvents();
      if (!events.length) {
        content.innerHTML = `<p>No hay eventos aún.</p>`;
        return;
      }

      const list = events.map((ev) => {
        const attendees = Array.isArray(ev.attendees) ? ev.attendees.length : 0;
        const isFull = attendees >= Number(ev.capacity);
        return `
          <tr>
            <td><strong>${ev.title}</strong><br/><span class="badge">${ev.date}</span></td>
            <td>${ev.location}</td>
            <td>${attendees}/${ev.capacity} ${isFull ? '<span class="badge" style="border-color: var(--danger); color: var(--danger)">Lleno</span>' : ""}</td>
            <td><a class="btn" href="#/events/${ev.id}">Ver</a></td>
          </tr>
        `;
      }).join("");

      content.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Ubicación</th>
              <th>Cupos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${list}</tbody>
        </table>
      `;
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
      content.innerHTML = `<p>Error cargando eventos.</p>`;
    }
  }

  load();
  return node;
}