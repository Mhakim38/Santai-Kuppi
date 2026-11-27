import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from './data/portfolio.json';
import { S, type Project } from './state.ts';
import { makeRope } from './rope.ts';
import { makeCards, makeList } from './cards.ts';
import { makeFlyer } from './flyer.ts';
import { makePhoto } from './photo.ts';
import { makeMagnets } from './magnet.ts';
import { makeScenery, makeRipple } from './scenery.ts';
import { makeReveals } from './reveal.ts';
import { lerp } from './vendor/line-art/motion.ts';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
const root = document.documentElement;
root.classList.toggle('reduce', S.reduce);
root.classList.toggle('coarse', S.coarse);

const projects = data.projects as unknown as Project[];
makeList(projects);
makeReveals();
const photo = makePhoto();
photo.sync();
const rope = makeRope();
const cards = makeCards(projects);
const flyer = makeFlyer();
const magnets = makeMagnets();
makeScenery();
const ripple = makeRipple();

let docH = 0, lastW = innerWidth;
const measure = () => {
  S.w = innerWidth; S.h = innerHeight;
  docH = document.documentElement.scrollHeight;
  photo.sync();
  rope.onResize();
  cards.size();
  if (S.reduce) rope.still();
};
measure();
let rz = 0;
addEventListener('resize', () => {
  clearTimeout(rz);
  rz = window.setTimeout(() => {
    const widthChanged = innerWidth !== lastW;
    lastW = innerWidth;
    measure();
    // a phone toolbar showing or hiding changes only the height: never re-pin under the reader
    if (widthChanged) ScrollTrigger.refresh();
  }, 120);
});
ScrollTrigger.addEventListener('refresh', () => { docH = document.documentElement.scrollHeight; cards.size(); });
document.fonts?.ready.then(() => { measure(); ScrollTrigger.refresh(); });

addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  S.ptr.x = e.clientX; S.ptr.y = e.clientY; S.ptr.on = true;
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => { S.ptr.on = false; });

// Taps that are not on a link or button: the string first (pluck, or loop the kite), then the sea.
addEventListener('pointerdown', (e) => {
  if (S.reduce || e.button !== 0) return;
  const t = e.target as Element;
  if (t.closest('a, button, .helix, dialog')) return;
  if (rope.pluck(e.clientX, e.clientY)) return;
  if (t.closest('#sea')) ripple(e.clientX, e.clientY);
  else if (!S.coarse && e.pointerType === 'mouse') rope.tug();
}, { passive: true });

// One loop for the string, the kite, the photo and the cards. Paused while the tab is hidden.
if (!S.reduce) {
  let raf = 0, prev = performance.now(), lastY = scrollY;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(1 / 30, Math.max(1 / 240, (now - prev) / 1000));
    prev = now;
    if (S.paused) return; // a site is open over the page: leave it the frame budget
    S.t += dt;
    const y = scrollY;
    S.vel = lerp(S.vel, (y - lastY) / dt, 0.18);
    lastY = y; S.scrollY = y;
    S.pageP = Math.max(0, Math.min(1, y / Math.max(1, docH - S.h)));
    // reads first
    flyer.sync();
    photo.sync();
    // then writes
    cards.draw(dt);
    photo.step(dt);
    magnets.step(dt);
    rope.step(dt);
  };
  raf = requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { prev = performance.now(); raf = requestAnimationFrame(tick); }
  });
}
