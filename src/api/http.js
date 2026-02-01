const BASE_URL = "http://localhost:3000";

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} - ${text || "Request failed"}`);
    }

    // json-server devuelve vacío en DELETE; tratamos ambos casos
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return await res.json();
    return null;
  } catch (err) {
    throw err;
  }
}