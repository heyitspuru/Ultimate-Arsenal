import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  State,
  type Card,
  type Grade,
} from "ts-fsrs";
import { load, save, todayKey } from "../storage";
import { DECK, type ReviewCard } from "./cards";

/** Retention target mirrors the repo's Anki guidance: FSRS, 88%, 10 new/day. */
const F = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.88 }));
export const NEW_PER_DAY = 10;

// ---- persistence ----------------------------------------------------------

/** Card scheduling states, JSON-serialized (dates as ISO strings). */
type StoredCard = Omit<Card, "due" | "last_review"> & { due: string; last_review?: string };

function reviveCard(s: StoredCard): Card {
  return {
    ...s,
    due: new Date(s.due),
    last_review: s.last_review ? new Date(s.last_review) : undefined,
  } as Card;
}

function loadStates(): Record<string, StoredCard> {
  return load<Record<string, StoredCard>>("srs-cards", {});
}

function saveStates(states: Record<string, StoredCard>): void {
  save("srs-cards", states);
}

export interface ReviewLogEntry {
  cardId: string;
  patternSlug: string;
  rating: number; // Rating enum value
  ts: number;
}

const LOG_CAP = 5000;

export function loadLog(): ReviewLogEntry[] {
  return load<ReviewLogEntry[]>("srs-log", []);
}

function appendLog(entry: ReviewLogEntry): void {
  const log = loadLog();
  log.push(entry);
  save("srs-log", log.slice(-LOG_CAP));
}

// ---- queue ----------------------------------------------------------------

export interface QueueItem {
  card: ReviewCard;
  state: Card;
  isNew: boolean;
}

interface NewLog {
  date: string;
  count: number;
}

function newIntroducedToday(): number {
  const nl = load<NewLog>("srs-new-log", { date: "", count: 0 });
  return nl.date === todayKey() ? nl.count : 0;
}

function bumpNewToday(): void {
  save("srs-new-log", { date: todayKey(), count: newIntroducedToday() + 1 });
}

/** Deterministic day-seeded RNG so a day's new-card pick is stable across reloads. */
function dayRng(): () => number {
  let seed = 0;
  for (const ch of todayKey()) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Due cards (scheduled, due <= now) sorted oldest-due first, then new cards
 *  up to today's remaining allowance. New cards are drawn round-robin across
 *  patterns (shuffled per day) — never a block from one pattern, otherwise a
 *  whole day's answers share one pattern and recall degrades to guessing. */
export function buildQueue(now = new Date()): QueueItem[] {
  const states = loadStates();
  const due: QueueItem[] = [];
  const newAllowance = Math.max(0, NEW_PER_DAY - newIntroducedToday());

  const unseenByPattern = new Map<string, typeof DECK>();
  for (const card of DECK) {
    const stored = states[card.id];
    if (stored) {
      const state = reviveCard(stored);
      if (state.due <= now) due.push({ card, state, isNew: false });
    } else {
      const list = unseenByPattern.get(card.patternSlug) ?? [];
      list.push(card);
      unseenByPattern.set(card.patternSlug, list);
    }
  }
  due.sort((a, b) => a.state.due.getTime() - b.state.due.getTime());

  // day-shuffled pattern order, then take one card per pattern per lap
  const rng = dayRng();
  const slugs = [...unseenByPattern.keys()];
  for (let i = slugs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [slugs[i], slugs[j]] = [slugs[j], slugs[i]];
  }
  const fresh: QueueItem[] = [];
  let lap = 0;
  while (fresh.length < newAllowance) {
    let took = false;
    for (const slug of slugs) {
      if (fresh.length >= newAllowance) break;
      const card = unseenByPattern.get(slug)?.[lap];
      if (card) {
        fresh.push({ card, state: createEmptyCard(now), isNew: true });
        took = true;
      }
    }
    if (!took) break; // every pattern exhausted
    lap++;
  }
  return [...due, ...fresh];
}

export function countsToday(now = new Date()): { due: number; fresh: number } {
  const states = loadStates();
  let due = 0;
  let unseen = 0;
  for (const card of DECK) {
    const stored = states[card.id];
    if (stored) {
      if (new Date(stored.due) <= now) due++;
    } else {
      unseen++;
    }
  }
  const fresh = Math.min(unseen, Math.max(0, NEW_PER_DAY - newIntroducedToday()));
  return { due, fresh };
}

/** Rate a card, persist the new schedule, log the review. Returns the new state. */
export function rate(item: QueueItem, grade: Grade, now = new Date()): Card {
  const { card: next } = F.next(item.state, now, grade);
  const states = loadStates();
  states[item.card.id] = {
    ...next,
    due: next.due.toISOString(),
    last_review: next.last_review?.toISOString(),
  } as StoredCard;
  saveStates(states);
  if (item.isNew) bumpNewToday();
  appendLog({ cardId: item.card.id, patternSlug: item.card.patternSlug, rating: grade, ts: now.getTime() });
  return next;
}

export interface PatternSummary {
  slug: string;
  total: number; // cards in the deck for this pattern
  seen: number; // cards with a schedule
  dueNow: number;
  reviews: number; // total log entries
  strength: number | null; // share of reviews rated Good/Easy, null if unseen
}

/** Per-pattern rollup for the dashboard — deck composition + review history. */
export function patternSummaries(now = new Date()): Map<string, PatternSummary> {
  const states = loadStates();
  const log = loadLog();
  const map = new Map<string, PatternSummary>();
  for (const card of DECK) {
    let s = map.get(card.patternSlug);
    if (!s) {
      s = { slug: card.patternSlug, total: 0, seen: 0, dueNow: 0, reviews: 0, strength: null };
      map.set(card.patternSlug, s);
    }
    s.total++;
    const stored = states[card.id];
    if (stored) {
      s.seen++;
      if (new Date(stored.due) <= now) s.dueNow++;
    }
  }
  const good = new Map<string, number>();
  for (const e of log) {
    const s = map.get(e.patternSlug);
    if (!s) continue;
    s.reviews++;
    if (e.rating >= Rating.Good) good.set(e.patternSlug, (good.get(e.patternSlug) ?? 0) + 1);
  }
  for (const s of map.values()) {
    if (s.reviews > 0) s.strength = (good.get(s.slug) ?? 0) / s.reviews;
  }
  return map;
}

/** Preview the interval each grade would produce (for the rating buttons). */
export function previewIntervals(item: QueueItem, now = new Date()): Record<number, string> {
  const rec = F.repeat(item.state, now);
  const fmt = (d: Date) => {
    const mins = (d.getTime() - now.getTime()) / 60000;
    if (mins < 60) return `${Math.max(1, Math.round(mins))}m`;
    if (mins < 60 * 24) return `${Math.round(mins / 60)}h`;
    const days = Math.round(mins / (60 * 24));
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${(days / 365).toFixed(1)}y`;
  };
  return {
    [Rating.Again]: fmt(rec[Rating.Again].card.due),
    [Rating.Hard]: fmt(rec[Rating.Hard].card.due),
    [Rating.Good]: fmt(rec[Rating.Good].card.due),
    [Rating.Easy]: fmt(rec[Rating.Easy].card.due),
  };
}

export { Rating, State };
export type { Card, Grade };
