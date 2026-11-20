// Magnetic pills: contact links and chips lean toward a fine pointer and spring back when it leaves.
// Transform only. Each pill is stepped only while it is moving.
import { S } from './state.ts';

interface Mag { el: HTMLElement; inner: HTMLElement; cx: number; cy: number; tx: number; ty: number; x: number; y: number; vx: number; vy: number }

export function makeMagnets() {
  const live = new Set<Mag>();
  if (S.coarse || S.reduce) return { step: (_dt: number) => {} };
  document.querySelectorAll<HTMLElement>('.mag').forEach((el) => {
    const m: Mag = { el, inner: (el.firstElementChild as HTMLElement) ?? el, cx: 0, cy: 0, tx: 0, ty: 0, x: 0, y: 0, vx: 0, vy: 0 };
    el.addEventListener('pointerenter', () => {
      const r = el.getBoundingClientRect();
      m.cx = r.left + r.width / 2; m.cy = r.top + r.height / 2;
      live.add(m);
    });
    el.addEventListener('pointermove', (e) => {
      m.tx = Math.max(-10, Math.min(10, (e.clientX - m.cx) * 0.28));
      m.ty = Math.max(-7, Math.min(7, (e.clientY - m.cy) * 0.4));
    });
    el.addEventListener('pointerleave', () => { m.tx = 0; m.ty = 0; });
  });

  function step(dt: number) {
    for (const m of live) {
      m.vx += (m.tx - m.x) * 260 * dt; m.vx *= Math.exp(-14 * dt); m.x += m.vx * dt;
      m.vy += (m.ty - m.y) * 260 * dt; m.vy *= Math.exp(-14 * dt); m.y += m.vy * dt;
      m.el.style.transform = `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`;
      m.inner.style.transform = `translate3d(${(m.x * 0.5).toFixed(2)}px, ${(m.y * 0.5).toFixed(2)}px, 0)`;
      if (m.tx === 0 && m.ty === 0 && Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.vx) + Math.abs(m.vy) < 0.05) {
        m.el.style.transform = ''; m.inner.style.transform = '';
        live.delete(m);
      }
    }
  }
  return { step };
}
