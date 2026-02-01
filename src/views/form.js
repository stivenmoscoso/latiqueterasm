import { el } from "../utils/dom.js";
import { createEvent, getEventById, patchEvent } from "../api/events.api.js";
import { getState } from "../state/store.js";
import { showToast } from "../state/uiSlice.js";
import { isEmpty, isPositiveInt, isValidDateYYYYMMDD } from "../utils/validaciones.js";

export default function EventForm({ params }) {
  const isEdit = !!params?.id;
  const node = el(`<section class="card">
    <div class="row" style="justify-content: space-between;">
      <div>
        <h1>${isEdit ? "Editar" : "Nuevo"} evento</h1>
        <p>${isEdit ? "Actualiza la información del evento." : "Crea un evento nuevo."}</p>
      </div>
      <div class="row">
        <a class="btn" href="#/admin/events">Volver</a>
      </div>
    </div>

    <form id="form">
      <div class="grid">
        <div class="col-6">
          <label>Título</label>
          <input name="title" placeholder="Nombre del evento" />
        </div>
        <div class="col-6">
          <label>Fecha</label>
          <input name="date" type="date" />
        </div>

        <div class="col-6">
          <label>Ubicación</label>
          <input name="location" placeholder="Ciudad / Lugar" />
        </div>
        <div class="col-6">
          <label>Capacidad</label>
          <input name="capacity" type="number" min="1" step="1" placeholder="Ej: 50" />
        </div>

        <div class="col-12">
          <label>Descripción</label>
          <textarea name="description" rows="4" placeholder="Detalles del evento"></textarea>
        </div>
      </div>

      <hr />
      <div class="row">
        <button class="btn primary" type="submit">${isEdit ? "Guardar cambios" : "Crear evento"}</button>
      </div>

      <p id="hint"></p>
    </form>
  </section>`);

  const form = node.querySelector("#form");
  const hint = node.querySelector("#hint");

  async function preload() {
    if (!isEdit) return;

    hint.textContent = "Cargando evento...";
    try {
      const ev = await getEventById(params.id);

      form.title.value = ev.title ?? "";
      form.date.value = ev.date ?? "";
      form.location.value = ev.location ?? "";
      form.capacity.value = ev.capacity ?? "";
      form.description.value = ev.description ?? "";

      hint.textContent = "";
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
      hint.textContent = "No se pudo cargar el evento.";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const date = String(fd.get("date") || "").trim();
    const place = String(fd.get("location") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const capacityRaw = String(fd.get("capacity") || "").trim();

    if (isEmpty(title) || isEmpty(date) || isEmpty(place) || isEmpty(capacityRaw)) {
      showToast({ type: "error", title: "Validación", message: "Completa los campos obligatorios." });
      return;
    }
    if (!isValidDateYYYYMMDD(date)) {
      showToast({ type: "error", title: "Validación", message: "Fecha inválida (usa el selector)." });
      return;
    }
    if (!isPositiveInt(capacityRaw)) {
      showToast({ type: "error", title: "Validación", message: "Capacidad debe ser un entero positivo." });
      return;
    }

    const capacity = Number(capacityRaw);
    const session = getState().session;

    try {
      if (isEdit) {
        // Importante: no tocar attendees aquí (persistencia)
        const current = await getEventById(params.id);
        const used = Array.isArray(current.attendees) ? current.attendees.length : 0;

        if (capacity < used) {
          showToast({
            type: "error",
            title: "Validación",
            message: `Capacidad no puede ser menor a asistentes actuales (${used}).`
          });
          return;
        }

        await patchEvent(params.id, { title, date, location: place, description, capacity });
        showToast({ type: "ok", title: "Admin", message: "Evento actualizado." });
        window.location.hash = "#/admin/events";
        return;
      }

      const created = await createEvent({
        title,
        date,
        location: place,
        description,
        capacity,
        attendees: [],
        createdBy: session.id,
        createdAt: new Date().toISOString()
      });
      console.log("Evento creado: =>", created);

      showToast({ type: "ok", title: "Admin", message: "Evento creado." });
      window.location.hash = "#/admin/events";
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
    }
  });

  preload();
  return node;
}