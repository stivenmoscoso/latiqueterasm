import { isLoggedIn, isAdmin } from "../state/sessionSlice.js";

export function requireAuth() {
  if (!isLoggedIn()) {
    location.hash = "#/login";
    return false;
  }
  return true;
}

export function requireAdmin() {
  if (!isLoggedIn()) {
    location.hash = "#/login";
    return false;
  }
  if (!isAdmin()) {
    location.hash = "#/events";
    return false;
  }
  return true;
}