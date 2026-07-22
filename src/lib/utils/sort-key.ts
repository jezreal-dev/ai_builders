const BASE62 =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function initialSortKey(): string {
  return "a0";
}

export function sortKeyBetween(before: string | null, after: string | null): string {
  if (!before && !after) return initialSortKey();
  if (!before) return decrementKey(after!);
  if (!after) return incrementKey(before);

  const mid = midpoint(before, after);
  if (mid === before || mid === after) {
    return before + "m";
  }
  return mid;
}

function midpoint(a: string, b: string): string {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const prefix = a.slice(0, i);
  const ca = i < a.length ? charIndex(a[i]) : 0;
  const cb = i < b.length ? charIndex(b[i]) : BASE62.length - 1;

  if (cb - ca > 1) {
    const mid = Math.floor((ca + cb) / 2);
    return prefix + BASE62[mid];
  }

  if (i < a.length) {
    return prefix + a[i] + "m";
  }

  return prefix + BASE62[Math.floor(BASE62.length / 2)];
}

function charIndex(c: string): number {
  const idx = BASE62.indexOf(c);
  return idx === -1 ? 0 : idx;
}

function incrementKey(key: string): string {
  return key + "m";
}

function decrementKey(key: string): string {
  if (key.length <= 1) return "a0";
  const last = charIndex(key[key.length - 1]);
  if (last > 0) {
    return key.slice(0, -1) + BASE62[last - 1];
  }
  return key.slice(0, -1) + "z";
}
