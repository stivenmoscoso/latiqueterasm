import { request } from "./http.js";

export const getUsers = () => request("/users");

export const findUserByEmail = (email) =>
  request(`/users?email=${encodeURIComponent(email)}`);

export const createUser = (payload) =>
  request("/users", { method: "POST", body: JSON.stringify(payload) });