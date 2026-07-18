/** Namespaced localStorage JSON helpers. Single-device MVP by design. */

const NS = "dsa-vault:v1:";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    // quota / private mode — recall still works, scheduling just won't persist
  }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/** All vault keys (un-prefixed) → values, as a JSON string for file backup. */
export function exportAll(): string {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(NS)) out[key.slice(NS.length)] = JSON.parse(localStorage.getItem(key)!);
  }
  return JSON.stringify(out, null, 2);
}

/** Restore an exportAll() backup. Throws on anything that isn't one. */
export function importAll(json: string): void {
  const data: unknown = JSON.parse(json);
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("not a vault backup");
  }
  for (const [key, value] of Object.entries(data)) save(key, value);
}
