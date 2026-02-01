import { el } from "../utils/dom.js";

export default function NotFound() {
  return el(`<section class="card">
    <h1>404</h1>
    <p>Ruta no encontrada.</p>
    <div class="row">
      <a class="btn primary" href="#/events">Ir a Eventos</a>
      <a class="btn" href="#/login">Login</a>
    </div>
  </section>`);
}