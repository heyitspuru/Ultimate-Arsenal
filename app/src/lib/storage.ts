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
