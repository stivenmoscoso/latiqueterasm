import "./style.css";

import { initRouter } from "./router/index.js";
import { loadSessionFromStorage } from "./state/sessionSlice.js";

import Navbar from "./components/Navbar.js";
import ToastHost from "./components/ToastHost.js";

loadSessionFromStorage();

const app = document.querySelector("#app");
app.innerHTML = `
  <header class="app-header" id="nav"></header>
  <main class="container" id="outlet"></main>
  <div id="toast-host"></div>
`;

document.querySelector("#nav").appendChild(Navbar());
document.querySelector("#toast-host").appendChild(ToastHost());

initRouter({ outlet: document.querySelector("#outlet") });