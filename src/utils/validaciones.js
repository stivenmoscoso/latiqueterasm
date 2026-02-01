export function isEmpty(v) {
  return v == null || String(v).trim() === "";
}

export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

export function isPositiveInt(v) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
}

export function isValidRole(v) {
  return v === "admin" || v === "visitor";
}

export function isValidDateYYYYMMDD(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(v).trim());
}