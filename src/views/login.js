import { el } from "../utils/dom.js";
import { isEmpty, isEmail } from "../utils/validaciones.js";
import { findUserByEmail } from "../api/users.api.js";
import { loginSession } from "../state/sessionSlice.js";
import { showToast } from "../state/uiSlice.js";

export default function Login() {
  const node = el(`<section class="card">
    <h1>Login</h1>
    <p>Ingresa con tu email y contraseña.</p>

    <form id="form">
      <label>Email</label>
      <input name="email" type="email" placeholder="correo@mail.com" />

      <label>Password</label>
      <input name="password" type="password" placeholder="******" />

      <hr />
      <div class="row">
        <button class="btn primary" type="submit">Entrar</button>
        <a class="btn" href="#/register">Crear cuenta</a>
      </div>
    </form>
  </section>`);

  const form = node.querySelector("#form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    if (isEmpty(email) || isEmpty(password)) {
      showToast({ type: "error", title: "Validación", message: "Completa todos los campos." });
      return;
    }
    if (!isEmail(email)) {
      showToast({ type: "error", title: "Validación", message: "Email inválido." });
      return;
    }

    try {
      const users = await findUserByEmail(email);
      const user = users?.[0];

      if (!user || user.password !== password) {
        showToast({ type: "error", title: "Login", message: "Credenciales incorrectas." });
        return;
      }

      loginSession(user);
      showToast({ type: "ok", title: "Login", message: `Bienvenido, ${user.name}.` });
      location.hash = "#/events";
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
    }
  });

  return node;
}