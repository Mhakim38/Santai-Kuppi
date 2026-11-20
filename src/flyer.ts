// The flyer: one figure on the shore in the footer, leaning back, both hands on the string.
// Drawn from the vendored line-art primitives. The arms solve toward wherever the kite is.
import { S } from './state.ts';
import { el, pen, shape, blot, limb, joint, shoe, place, inkDefs, run, f } from './vendor/line-art/ink.ts';
import { gait } from './vendor/line-art/gait.ts';

const VB_W = 220, X = 76, Y = 174, SC = 1.15;

export function makeFlyer() {
  const svg = document.getElementById('flyer') as unknown as SVGSVGElement;
  svg.style.color = 'var(--paper)';
  const defs = inkDefs(svg, 'fly');

  const shore = el('g', {}, svg);
  const rock = shape(shore, 1.6);
  rock.setAttribute('d', 'M-40 200 L-40 178 C 0 170 60 166 100 170 C 128 173 150 183 170 200 Z');
  const w1 = pen(shore, 1.4); w1.setAttribute('d', 'M168 189 L192 189');
  const w2 = pen(shore, 1.4); w2.setAttribute('d', 'M182 196 L214 196');

  const g = el('g', {}, svg);
  if (!S.coarse) g.setAttribute('filter', defs.filter); // the wobble is heavy on phones
  const legB = limb(g, 8), shoeB = blot(g);
  const armB = limb(g, 5.5);
  const body = limb(g, 15);
  const head = shape(g);
  const hair = blot(g);
  const legF = limb(g, 8), shoeF = blot(g);
  const armF = limb(g, 5.5);
  place(g, X, Y, 1, SC);

  svg.querySelectorAll('path').forEach((p) => {
    p.setAttribute('pathLength', '1');
    if (p.getAttribute('stroke')) p.classList.add('draw');
    else p.classList.add('fillin');
  });

  const walk = gait({ kind: 'shuffle' });
  let hand: [number, number] = [70, 40];
  let phase = 0;
  let waveT = 1; // 0..1 while the free arm waves hello

  function draw(t: number, dt: number) {
    // kite in figure space
    const r = rect;
    let kx = 160, ky = -200;
    if (r) {
      const s = r.width / VB_W;
      const vx = (S.kite.x - r.left) / s, vy = (S.kite.y - r.top) / s;
      kx = (vx - X) / SC + 40; ky = (vy - Y) / SC + 120;
    }
    phase += dt * 0.18;
    const p = walk.pose(phase, 0.14);
    const hip = p.hip;
    const lean = 7 + Math.sin(t * 0.9) * 1.2;
    const top: [number, number] = [hip[0] - lean, hip[1] - 33];
    const sh: [number, number] = [top[0] + 1.5, top[1] + 3];
    let dx = kx - sh[0], dy = ky - sh[1];
    const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const h1: [number, number] = [sh[0] + dx * 26, sh[1] + dy * 26];
    let h2: [number, number] = [sh[0] + dx * 19 - 2, sh[1] + dy * 19 + 3];
    if (waveT < 1) {
      // let go with the back hand and wave: up beside the head, swinging, then back to the string
      waveT = Math.min(1, waveT + dt / 1.8);
      const k = Math.sin(Math.PI * waveT) ** 0.6;
      const up: [number, number] = [sh[0] - 6 + Math.sin(t * 12) * 10, sh[1] - 27];
      h2 = [h2[0] + (up[0] - h2[0]) * k, h2[1] + (up[1] - h2[1]) * k];
    }
    hand = [h1[0] + dx * 2, h1[1] + dy * 2];

    const [fb, ff] = p.front === 0 ? [p.feet[1], p.feet[0]] : [p.feet[0], p.feet[1]];
    legB.draw([hip, fb.knee, fb.ankle]); shoe(shoeB, fb.ankle, fb.pitch);
    armB.draw([sh, joint(sh, h2, 13, 13, 1), h2]);
    body.draw([hip, [hip[0] - lean * 0.4, hip[1] - 17], top], [0, 0]);
    const hc: [number, number] = [top[0] - 1.5, top[1] - 9];
    head.setAttribute('d', `M${f(hc[0] + 7)} ${f(hc[1])} A7 7.4 0 1 0 ${f(hc[0] - 7)} ${f(hc[1])} A7 7.4 0 1 0 ${f(hc[0] + 7)} ${f(hc[1])}Z`);
    hair.setAttribute('d', `M${f(hc[0] - 7.2)} ${f(hc[1] - 0.5)} A7.2 7.6 0 0 1 ${f(hc[0] + 7.2)} ${f(hc[1] - 1.5)} Q${f(hc[0])} ${f(hc[1] - 4.5)} ${f(hc[0] - 7.2)} ${f(hc[1] - 0.5)}Z`);
    legF.draw([hip, ff.knee, ff.ankle]); shoe(shoeF, ff.ankle, ff.pitch);
    armF.draw([sh, joint(sh, h1, 14, 14, 1), h1]);
  }

  let rect: DOMRect | null = null, on = false, cancel: (() => void) | null = null, drawn = false;
  const io = new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    if (on && !cancel) {
      if (!drawn && !S.reduce) { svg.classList.add('drawing'); drawn = true; }
      cancel = run(draw);
    } else if (!on && cancel) { cancel(); cancel = null; }
  }, { rootMargin: '120px' });
  io.observe(svg);

  /** Called by the main loop before it writes anything: where is the hand on screen? */
  function sync() {
    if (!on) { S.hand.on = false; return; }
    rect = svg.getBoundingClientRect();
    const s = rect.width / VB_W;
    const vx = X + (hand[0] - 40) * SC, vy = Y + (hand[1] - 120) * SC;
    S.hand.x = rect.left + vx * s; S.hand.y = rect.top + vy * s;
    // hand over once the shore is well into the screen
    S.hand.on = rect.top < S.h * 0.92 && rect.bottom > 0;
  }
  const hit = document.querySelector('.flyer-hit') as HTMLButtonElement;
  hit.addEventListener('click', () => { if (waveT >= 1 && !S.reduce) waveT = 0; });
  return { sync };
}
