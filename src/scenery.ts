// Footer scenery: cloud-drift turning into moonlit-sea, palettes remapped so the
// flat cobalt page runs into the scene with no seam.
import { S } from './state.ts';
import { play } from './vendor/ascii-magic-art/runtime/player.js';
import * as cloud from './vendor/ascii-magic-art/pieces/cloud-drift.js';
import * as sea from './vendor/ascii-magic-art/pieces/moonlit-sea.js';
import { gradient, KEYS } from './vendor/ascii-magic-art/lib/kit.js';

type Piece = { meta: Record<string, any>; default: () => (t: number) => unknown };

function cloudPiece(): Piece {
  const pal: Record<string, string> = { ...cloud.meta.palette };
  // keys: sky 0-11, cloud 12-21, hills 22-25, sun 26-27 (see the piece)
  const sk = gradient(['#2337C6', '#2a3fb0'], 12);
  for (let i = 0; i < 12; i++) pal[KEYS[i]] = sk[i];
  const cl = gradient(['#4a5fd6', '#8e9ee8', '#cfd3f2', '#f3e8d4', '#FFF1D6', '#FFF6E6'], 10);
  for (let i = 0; i < 10; i++) pal[KEYS[12 + i]] = cl[i];
  for (let i = 22; i < 26; i++) pal[KEYS[i]] = '#0E1838';
  pal[KEYS[26]] = '#FFB627'; pal[KEYS[27]] = '#FFF1D6';
  // 26 rows instead of 32: the canvas crops the hills off the bottom
  return { meta: { ...cloud.meta, rows: 26, palette: pal }, default: cloud.default };
}

function seaPiece(): Piece {
  const pal: Record<string, string> = { ...sea.meta.palette };
  // keys: sky 0-9, sea a-j, moon k-n, star o. Cool the sky toward the page's cobalt family.
  const sky = gradient(['#2a3fb0', '#1b2a7a', '#2f44b8', '#7e8fe0'], 10);
  for (let i = 0; i < 10; i++) pal[KEYS[i]] = sky[i];
  return { meta: { ...sea.meta, palette: pal }, default: sea.default };
}

export function makeScenery() {
  const slots: Array<[HTMLElement, Piece]> = [
    [document.getElementById('ascii-cloud')!, cloudPiece()],
    [document.getElementById('ascii-sea')!, seaPiece()],
  ];
  for (const [pre, piece] of slots) {
    let stop: (() => void) | null = null;
    const opts = { maxFps: S.coarse ? 12 : 20, still: S.reduce };
    // play only while on screen (reduced motion: play() draws one still frame)
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) stop = play(pre, piece, opts);
      else if (!e.isIntersecting && stop) { stop(); stop = null; }
    }, { rootMargin: '300px' }).observe(pre.parentElement!);
  }
}

/** Tap the water: one ring of glyphs spreads from your finger and fades, 600ms, then the canvas rests. */
export function makeRipple() {
  const sea = document.getElementById('sea') as HTMLElement;
  const cv = sea.querySelector('.ripple') as HTMLCanvasElement;
  const ctx = cv.getContext('2d')!;
  const rings: Array<{ x: number; y: number; t0: number }> = [];
  let raf = 0, W = 0, H = 0, dpr = 1;
  const GLYPHS = ['~', '.', '-', '~', 'o', '.'];

  const frame = (now: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.font = '600 14px Menlo, Consolas, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let k = rings.length - 1; k >= 0; k--) {
      const ring = rings[k];
      const e = (now - ring.t0) / 600;
      if (e >= 1) { rings.splice(k, 1); continue; }
      for (const lag of [0, 0.22]) {
        const q = e - lag;
        if (q <= 0) continue;
        const ease = 1 - (1 - q) ** 3;
        const r = 10 + ease * 130;
        const cnt = Math.min(32, Math.max(8, Math.round((Math.PI * 2 * r) / 22)));
        ctx.globalAlpha = (1 - q) * (lag ? 0.5 : 0.9);
        ctx.fillStyle = lag ? '#FFB627' : '#FFF1D6';
        for (let i = 0; i < cnt; i++) {
          const a = (i / cnt) * Math.PI * 2;
          // flattened ellipse: a ripple seen from the shore
          ctx.fillText(GLYPHS[(i + Math.round(q * 10)) % GLYPHS.length], ring.x + Math.cos(a) * r, ring.y + Math.sin(a) * r * 0.42);
        }
      }
    }
    ctx.globalAlpha = 1;
    raf = rings.length ? requestAnimationFrame(frame) : 0;
    if (!raf) ctx.clearRect(0, 0, W, H);
  };

  return (cx: number, cy: number) => {
    if (S.reduce) return;
    const r = sea.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    if (W !== r.width || H !== r.height) {
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    if (rings.length > 1) rings.shift(); // at most two rings at once
    rings.push({ x: cx - r.left, y: cy - r.top, t0: performance.now() });
    if (!raf) raf = requestAnimationFrame(frame);
  };
}
