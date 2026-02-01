import { el } from "../utils/dom.js";
import { getEvents, deleteEvent } from "../api/events.api.js";
import { showToast } from "../state/uiSlice.js";

export default function AdminEvents() {
  const node = el(`<section class="card">
    <div class="row" style="justify-content: space-between;">
      <div>
        <h1>Admin - Eventos</h1>
        <p>Crear, editar y eliminar eventos.</p>
      </div>
      <div class="row">
        <a class="btn primary" href="#/admin/events/new">Nuevo evento</a>
        <a class="btn" href="#/events">Ver como usuario</a>
      </div>
    </div>

    <div id="content"></div>
  </section>`);

  const content = node.querySelector("#content");

  async function load() {
    content.innerHTML = `<p>Cargando...</p>`;
    try {
      const events = await getEvents();
      if (!events.length) {
        content.innerHTML = `<p>No hay eventos. Crea el primero.</p>`;
        return;
      }

      content.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Ubicación</th>
              <th>Cupos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(ev => {
              const used = Array.isArray(ev.attendees) ? ev.attendees.length : 0;
              return `
                <tr>
                  <td><strong>${ev.title}</strong></td>
                  <td>${ev.date}</td>
                  <td>${ev.location}</td>
                  <td>${used}/${ev.capacity}</td>
                  <td class="row">
                    <a class="btn" href="#/admin/events/edit/${ev.id}">Editar</a>
                    <button class="btn danger" data-action="delete" data-id="${ev.id}">Eliminar</button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
      content.innerHTML = `<p>Error cargando eventos.</p>`;
    }
  }

  node.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    if (btn.dataset.action === "delete") {
      const id = btn.dataset.id;
      const ok = confirm("¿Seguro que deseas eliminar este evento?");
      if (!ok) return;

      try {
        await deleteEvent(id);
        showToast({ type: "ok", title: "Admin", message: "Evento eliminado." });
        await load();
      } catch (err) {
        showToast({ type: "error", title: "Error", message: err.message });
      }
    }
  });

  load();
  return node;
}