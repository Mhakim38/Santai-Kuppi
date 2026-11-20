// Shared, mutable page state. One rAF loop in main.ts reads and writes it.
export type Box = { x: number; y: number; w: number; h: number };

export const S = {
  reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
  coarse: matchMedia('(pointer: coarse)').matches,
  w: innerWidth,
  h: innerHeight,
  scrollY: scrollY,
  vel: 0,          // smoothed scroll velocity, px per second
  pageP: 0,        // 0 at the top, 1 at the bottom
  spiral: 0,       // 0..1, how much the card stage owns the screen
  past: 0,         // 0..1, eased: 1 once the reader is in or below the cards
  avoid: [] as Box[],                 // boxes the string must not cross (active card, photo)
  photo: null as null | Box,          // the photo window on screen, while it is near the viewport
  hand: { x: 0, y: 0, on: false },    // footer flyer's hand, screen px
  kite: { x: 0, y: 0, a: 0 },         // kite bridle, screen px, angle rad
  ptr: { x: -1, y: -1, on: false },   // last fine pointer position
  t: 0,
};

/** a verified number: n counts up once (null = show pre as a fixed label), with its source for the title */
export interface Stat { n: number | null; dec: number; pre: string; suf: string; label: string; source: string }
/** one portfolio card, read from src/data/portfolio.json (VERIFIED and VERIFIED-FROM-NOTES facts only) */
export interface Project {
  id: string; group: 'work' | 'side'; kind: 'own' | 'ft' | 'concept';
  name: string; slogan: string | null; when: string; line: string;
  stack: string[]; role: string | null; stats: Stat[]; about: string[]; detail: string[];
}

/** the data writes ranges as "A - B"; the page reads "A to B". */
export const when = (s: string): string => s.replace(/\s+-\s+/g, ' to ');
export const tag = (p: Project): string => (p.kind === 'ft' ? '2Q Alliance project' : p.kind === 'concept' ? 'Concept, private preview' : 'Own work');
export const GROUP = { work: 'Work', side: 'Side projects' } as const;
export const fmtStat = (s: Stat, v = s.n ?? 0): string => (s.n === null ? s.pre : `${s.pre}${v.toFixed(s.dec)}${s.suf}`);
export const endYear = (p: Project): number => {
  const m = p.when.match(/\d{4}/g);
  return m ? Number(m[m.length - 1]) : 0;
};
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
