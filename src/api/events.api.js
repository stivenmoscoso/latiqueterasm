
import { request } from "./http.js";

export const getEvents = () => request("/events");
export const getEventById = (id) => request(`/events/${id}`);

export const createEvent = (payload) =>
  request("/events", { method: "POST", body: JSON.stringify(payload) });

export const patchEvent = (id, payload) =>
  request(`/events/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteEvent = (id) =>
  request(`/events/${id}`, { method: "DELETE" });

export async function registerToEvent(eventId, userId) {
  const ev = await getEventById(eventId);
  const attendees = Array.isArray(ev.attendees) ? ev.attendees : [];

  if (attendees.includes(userId)) throw new Error("Ya estás registrado en este evento.");
  if (attendees.length >= Number(ev.capacity)) throw new Error("No hay cupos disponibles para este evento.");

  return patchEvent(eventId, { attendees: [...attendees, userId] });
}

export async function cancelRegistration(eventId, userId) {
  const ev = await getEventById(eventId);
  const attendees = Array.isArray(ev.attendees) ? ev.attendees : [];

  if (!attendees.includes(userId)) throw new Error("No estás registrado en este evento.");

  return patchEvent(eventId, { attendees: attendees.filter((id) => id !== userId) });
}