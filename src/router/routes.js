import Login from "../views/login.js";
import Register from "../views/registro.js";
import EventsList from "../views/eventlist.js";
import EventDetail from "../views/eventDetail.js";
import AdminEvents from "../views/AdminEvents.js";
import EventForm from "../views/form.js";
import NotFound from "../views/NotFound.js";

import { requireAuth, requireAdmin } from "./guards.js";

export const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  { path: "/events", component: EventsList, guard: requireAuth },
  { path: "/events/:id", component: EventDetail, guard: requireAuth },

  { path: "/admin/events", component: AdminEvents, guard: requireAdmin },
  { path: "/admin/events/new", component: EventForm, guard: requireAdmin },
  { path: "/admin/events/edit/:id", component: EventForm, guard: requireAdmin },

  { path: "/404", component: NotFound }
];