// The wau bulan (moon kite), drawn with the vendored line-art primitives.
// Local space: bridle at (0, 0), about 112 units tall. Placed every frame at the rope's end.
import { el, pen, paint, f } from './vendor/line-art/ink.ts';
import { pendulum } from './vendor/line-art/motion.ts';

const W = 2.6;

export interface Kite { place(x: number, y: number, angle: number, wind: number, dt: number): void }

export function makeKite(layer: SVGSVGElement, scale: number, reduce: boolean): Kite {
  const root = el('g', {}, layer);
  const body = el('g', {}, root);
  const draw = (n: SVGPathElement, fill = false) => {
    n.setAttribute('pathLength', '1');
    n.classList.add('draw');
    if (fill) n.classList.add('fillin');
    return n;
  };
  // tails first so the body covers their roots
  const tailL = draw(pen(body, W * 0.8));
  const tailR = draw(pen(body, W * 0.8));
  const wings = draw(paint(body, 'var(--vermilion)', W), true);
  wings.setAttribute('d', 'M0 -40 C 18 -45 44 -42 56 -27 C 40 -22 22 -15 6 -3 L0 2 L-6 -3 C -22 -15 -40 -22 -56 -27 C -44 -42 -18 -45 0 -40 Z');
  const waist = draw(paint(body, 'var(--vermilion)', W), true);
  waist.setAttribute('d', 'M-6 -2 L6 -2 L4 26 L-4 26 Z');
  const moon = draw(paint(body, 'var(--vermilion)', W), true);
  moon.setAttribute('d', 'M-50 24 C -36 60 36 60 50 24 C 30 40 -30 40 -50 24 Z');
  const head = draw(paint(body, 'var(--marigold)', W), true);
  head.setAttribute('d', 'M0 -60 C 9 -60 10 -45 0 -43 C -10 -45 -9 -60 0 -60 Z');
  const spine = draw(pen(body, W));
  spine.setAttribute('d', 'M0 -43 L0 50');
  const bow = draw(pen(body, W));
  bow.setAttribute('d', 'M-56 -27 Q 0 -52 56 -27');
  const bow2 = draw(pen(body, W * 0.8));
  bow2.setAttribute('d', 'M-44 34 Q 0 22 44 34');
  if (reduce) layer.querySelectorAll('.draw').forEach((n) => n.classList.remove('draw', 'fillin'));

  const pl = pendulum(7, 1.6), pr = pendulum(6.2, 1.4);
  let lastWind = 0;
  const tail = (n: SVGPathElement, x0: number, y0: number, a: number, len: number) => {
    const sx = Math.sin(a), cy = Math.cos(a);
    const mx = x0 + sx * len * 0.5 + Math.sin(a * 2.2) * 8, my = y0 + cy * len * 0.5;
    n.setAttribute('d', `M${f(x0)} ${f(y0)} Q${f(mx)} ${f(my)} ${f(x0 + sx * len)} ${f(y0 + cy * len)}`);
  };

  return {
    place(x, y, angle, wind, dt) {
      const gust = (wind - lastWind) * 6; lastWind = wind;
      const al = reduce ? -0.25 : pl.step(7 * (wind * 0.35 - angle) + gust, dt);
      const ar = reduce ? -0.3 : pr.step(6.2 * (wind * 0.42 - angle) + gust * 1.2, dt);
      tail(tailL, -48, 30, al, 74);
      tail(tailR, 48, 30, ar, 86);
      root.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f((angle * 180) / Math.PI)}) scale(${f(scale)}) translate(0 12)`);
    },
  };
}
