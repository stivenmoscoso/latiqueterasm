export function matchRoute(pattern, path) {
  const p1 = pattern.split("/").filter(Boolean);
  const p2 = path.split("/").filter(Boolean);

  if (p1.length !== p2.length) return null;

  const params = {};
  for (let i = 0; i < p1.length; i++) {
    const a = p1[i];
    const b = p2[i];

    if (a.startsWith(":")) params[a.slice(1)] = b;
    else if (a !== b) return null;
  }
  return { params };
}