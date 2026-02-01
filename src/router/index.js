import { routes } from "./routes.js";
import { matchRoute } from "./match.js";

function getPathFromHash() {
  const hash = location.hash || "#/login";
  return hash.replace(/^#/, ""); // "/login"
}

export function initRouter({ outlet }) {
  async function render() {
    const path = getPathFromHash();

    for (const r of routes) {
      const matched = matchRoute(r.path, path);
      if (!matched) continue;

      if (r.guard && !r.guard()) return;

      outlet.innerHTML = "";
      const node = await r.component({ params: matched.params });
      outlet.appendChild(node);
      return;
    }

    location.hash = "#/404";
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);
  render();
}