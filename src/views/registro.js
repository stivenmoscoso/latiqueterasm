import { el } from "../utils/dom.js";
import { isEmpty, isEmail, isValidRole } from "../utils/validaciones.js";
import { findUserByEmail, createUser } from "../api/users.api.js";
import { showToast } from "../state/uiSlice.js";

export default function Register() {
  const node = el(`<section class="card">
    <h1>Registro</h1>
    <p>Crea un usuario (por requisito, el rol se elige en el registro).</p>

    <form id="form">
      <label>Nombre</label>
      <input name="name" placeholder="Tu nombre" />

      <label>Email</label>
      <input name="email" type="email" placeholder="correo@mail.com" />

      <label>Password (mínimo 6)</label>
      <input name="password" type="password" placeholder="******" />

      <label>Rol</label>
      <select name="role">
        <option value="visitor">Invitado</option>
        <option value="admin">Administrador</option>
      </select>

      <hr />
      <div class="row">
        <button class="btn primary" type="submit">Crear cuenta</button>
        <a class="btn" href="#/login">Ir a Login</a>
      </div>
    </form>
  </section>`);

  const form = node.querySelector("#form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const role = String(fd.get("role") || "visitor");

    if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
      showToast({ type: "error", title: "Validación", message: "Completa todos los campos." });
      return;
    }
    if (!isEmail(email)) {
      showToast({ type: "error", title: "Validación", message: "Email inválido." });
      return;
    }
    if (password.length < 6) {
      showToast({ type: "error", title: "Validación", message: "Password muy corta (mínimo 6)." });
      return;
    }
    if (!isValidRole(role)) {
      showToast({ type: "error", title: "Validación", message: "Rol inválido." });
      return;
    }

    try {
      const existing = await findUserByEmail(email);
      if (existing.length) {
        showToast({ type: "error", title: "Registro", message: "Ese email ya está registrado." });
        return;
      }

      await createUser({
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString()
      });

      showToast({ type: "ok", title: "Registro", message: "Usuario creado. Ahora inicia sesión." });
      location.hash = "#/login";
    } catch (err) {
      showToast({ type: "error", title: "Error", message: err.message });
    }
  });

  return node;
}