// Hakim's photo. Scrolling it into view opens a kite-diamond window to the full frame while a cobalt
// wash fades off, so he arrives in true colour. The frame tilts toward your pointer on a spring
// (phones: the picture drifts with scroll). His face is never altered: only crop, mask, tilt and shift.
import { S, clamp01 } from './state.ts';
import { clamp } from './vendor/line-art/motion.ts';

export function makePhoto() {
  const fig = document.getElementById('photo') as HTMLElement;
  const frame = fig.querySelector('.photo-frame') as HTMLElement;
  const img = fig.querySelector('img') as HTMLImageElement;
  let near = false;

  const open = () => fig.classList.add('in');
  if (S.reduce) open();
  else {
    // open once it is properly on screen (at 390 it already is on load, so it opens as an intro)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(open, 250); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(fig);
  }
  new IntersectionObserver(([e]) => { near = e.isIntersecting; if (!near) S.photo = null; }, { rootMargin: '80px' }).observe(fig);

  // springs: tilt x/y and image shift
  let rx = 0, ry = 0, vx = 0, vy = 0;
  const K = 120, D = 16; // stiffness, damping

  /** Reads layout. Called before anything writes. */
  function sync() {
    if (!near) return;
    const r = fig.getBoundingClientRect();
    S.photo = { x: r.left, y: r.top, w: r.width, h: r.height };
  }

  function step(dt: number) {
    if (!near || S.reduce || !S.photo) return;
    const p = S.photo;
    let tx = 0, ty = 0;
    if (!S.coarse && S.ptr.on) {
      tx = clamp((S.ptr.x - (p.x + p.w / 2)) / (S.w * 0.5), -1, 1);
      ty = clamp((S.ptr.y - (p.y + p.h / 2)) / (S.h * 0.5), -1, 1);
    } else {
      // phones: the picture drifts with its place on screen, and leans a touch with scroll speed
      ty = clamp(((p.y + p.h / 2) - S.h / 2) / S.h, -1, 1);
      tx = clamp(S.vel * 0.0006, -0.6, 0.6);
    }
    vx += (tx - rx) * K * dt; vx *= Math.exp(-D * dt); rx += vx * dt;
    vy += (ty - ry) * K * dt; vy *= Math.exp(-D * dt); ry += vy * dt;
    const lift = clamp01(-p.y / Math.max(1, p.h)) * 40; // rises a little faster than the page as it leaves
    frame.style.transform = `translate3d(0, ${(-lift).toFixed(1)}px, 0) perspective(900px) rotateX(${(-ry * 3).toFixed(2)}deg) rotateY(${(rx * 3).toFixed(2)}deg)`;
    img.style.transform = `translate3d(${(-rx * 6).toFixed(2)}px, ${(-ry * (S.coarse ? 14 : 6)).toFixed(2)}px, 0) scale(1.08)`;
  }

  return { sync, step };
}
