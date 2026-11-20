// The live string: a 28-point verlet chain. Point 0 is the hand: at load it is Hakim's (the photo's
// lower edge), then yours (pointer on desktop, a draggable handle on phones), then the footer flyer's.
// The last point carries the kite. The kite always flies toward open sky, so it never sits on text.
import { S } from './state.ts';
import { makeKite } from './kite.ts';
import { wobble, lerp, clamp } from './vendor/line-art/motion.ts';

const N = 28;

export function makeRope() {
  const cv = document.getElementById('rope') as HTMLCanvasElement;
  const layer = document.getElementById('kite-layer') as unknown as SVGSVGElement;
  const thumb = document.getElementById('thumb') as HTMLButtonElement;
  const readout = document.getElementById('readout') as HTMLElement;
  const readNum = readout.querySelector('span') as HTMLElement;
  const ctx = cv.getContext('2d')!;
  const kiteScale = S.coarse ? 0.6 : 0.82;
  const kite = makeKite(layer, kiteScale, S.reduce);

  const x = new Float32Array(N), y = new Float32Array(N), ox = new Float32Array(N), oy = new Float32Array(N);
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(S.w * dpr); cv.height = Math.round(S.h * dpr);
  };

  // where your hand rests when nobody holds it
  const home = () => (S.coarse ? { x: S.w - 48, y: S.h - 72 } : { x: S.w * 0.74, y: S.h * 0.7 });
  // Hakim's hand: the photo's lower edge, a little in from the left
  const photoHand = () => S.photo && { x: S.photo.x + S.photo.w * 0.14, y: S.photo.y + S.photo.h };
  const aim = home();
  const anchor = { ...aim };
  let thumbPos = home();
  let moved = false;

  if (!S.coarse) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      aim.x = e.clientX; aim.y = e.clientY; moved = true;
    }, { passive: true });
  }
  // phone handle: drag it anywhere, it stays where you leave it
  let drag = -1;
  const placeThumb = () => { thumb.style.transform = `translate(${(thumbPos.x - 28).toFixed(1)}px, ${(thumbPos.y - 28).toFixed(1)}px)`; };
  thumb.addEventListener('pointerdown', (e) => { drag = e.pointerId; thumb.setPointerCapture(e.pointerId); });
  thumb.addEventListener('pointermove', (e) => {
    if (e.pointerId !== drag) return;
    thumbPos = { x: clamp(e.clientX, 30, S.w - 30), y: clamp(e.clientY, 30, S.h - 30) };
    moved = true; placeThumb();
  });
  const up = (e: PointerEvent) => { if (e.pointerId === drag) drag = -1; };
  thumb.addEventListener('pointerup', up);
  thumb.addEventListener('pointercancel', up);

  const reset = () => {
    for (let i = 0; i < N; i++) { x[i] = ox[i] = anchor.x - i * 3; y[i] = oy[i] = anchor.y - i * 6; }
  };

  let L = S.h * 0.4, windX = -0.4, handK = 0, loop = 1, lastRead = 0;

  const onResize = () => {
    resize();
    if (!moved) { const h = home(); aim.x = h.x; aim.y = h.y; }
    thumbPos = { x: clamp(thumbPos.x, 30, S.w - 30), y: clamp(thumbPos.y, 30, S.h - 30) };
    placeThumb();
  };
  onResize();
  {
    const p = photoHand();
    Object.assign(anchor, p ?? (S.coarse ? thumbPos : aim));
    thumbPos = { ...anchor };
  }
  reset();

  function step(dt: number) {
    // 1. whose hand: Hakim's (photo) until you take it, yours, then the flyer's in the footer
    const ph = photoHand();
    const held = !moved && !!ph && ph.y > S.h * 0.3 && ph.y < S.h + 40;
    let own: { x: number; y: number };
    if (S.coarse) {
      if (!moved && drag < 0) {
        const t = held && ph ? ph : home();
        thumbPos = { x: lerp(thumbPos.x, t.x, 0.25), y: lerp(thumbPos.y, t.y, 0.25) };
        placeThumb();
      }
      own = thumbPos;
    } else own = held && ph ? ph : aim;
    handK = lerp(handK, S.hand.on ? 1 : 0, S.hand.on ? 0.08 : 0.12);
    const tx = lerp(own.x, S.hand.x, handK), ty = lerp(own.y, S.hand.y, handK);
    const follow = held ? 1 : S.coarse ? 0.5 : 0.3;
    anchor.x = lerp(anchor.x, tx, follow);
    anchor.y = lerp(anchor.y, ty, follow);
    thumb.style.opacity = String(1 - handK);

    // 2. the open sky the kite heads for: phones, the empty top left (he looks up and left);
    //    desktop, the band above the headline, left of the photo. Footer: up and right of the flyer.
    const skyX = lerp(S.coarse || S.w < 700 ? S.w * 0.3 : S.w * 0.4, S.w * (S.w < 700 ? 0.56 : 0.72), handK);
    const skyY = S.h * (S.coarse || S.w < 700 ? 0.1 : 0.16);
    const reach = Math.hypot(skyX - anchor.x, skyY - anchor.y);

    // 3. how much string is out. Hero: just enough to reach that sky. From the cards on: let right
    //    out so the kite stays off the top and never sits on a card. Footer: wound back in for the flyer.
    const base = clamp(reach * 1.02, S.h * 0.22, S.h * 0.9);
    const out = Math.max(S.spiral, S.past);
    const target = lerp(lerp(base, S.h * 1.6, out), S.h * 0.46, handK);
    L = lerp(L, target, 0.04);

    // 4. wind: aimed at the open sky, gusted by scroll speed, with slow layered noise
    const want = clamp((skyX - anchor.x) / Math.max(90, anchor.y - skyY), -1.1, 1.1);
    const gust = clamp(S.vel * 0.0011, -1.3, 1.3);
    const sign = want < 0 ? -1 : 1;
    windX = lerp(windX, want + gust * sign * (S.coarse ? 0.4 : 0.8) + wobble(S.t * 0.35) * (S.coarse ? 0.1 : 0.22), 0.06);
    const lift = 3000 * (1 + S.spiral * 0.6) * (1 + Math.abs(gust) * 0.35);

    // 5. verlet
    const seg = L / (N - 1), g = 120, damp = 0.982, h2 = dt * dt;
    for (let i = 1; i < N; i++) {
      const vx = (x[i] - ox[i]) * damp, vy = (y[i] - oy[i]) * damp;
      ox[i] = x[i]; oy[i] = y[i];
      let ax = windX * lift * 0.04, ay = g; // the string is light: a little sag, carried a little by the wind
      if (i === N - 1) { ax = windX * lift; ay = -lift + g; }
      x[i] += vx + ax * h2; y[i] += vy + ay * h2;
    }
    for (let k = 0; k < 14; k++) {
      x[0] = anchor.x; y[0] = anchor.y;
      for (let i = 0; i < N - 1; i++) {
        const dx = x[i + 1] - x[i], dy = y[i + 1] - y[i];
        const d = Math.hypot(dx, dy) || 0.0001;
        if (d <= seg) continue; // a string only pulls, it never pushes
        const diff = (d - seg) / d;
        // the hand never moves; the kite barely gives (its lift wins); string points split the difference
        const a = i === 0 ? 0 : i + 1 === N - 1 ? 0.95 : 0.5, b = 1 - a;
        x[i] += dx * diff * a; y[i] += dy * diff * a; x[i + 1] -= dx * diff * b; y[i + 1] -= dy * diff * b;
      }
    }
    x[0] = ox[0] = anchor.x; y[0] = oy[0] = anchor.y;

    // 6. draw the string
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, S.w, S.h);
    ctx.globalAlpha = 1 - out * 0.85 * (1 - handK);
    ctx.strokeStyle = '#FFF1D6';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x[0], y[0]);
    for (let i = 1; i < N - 1; i++) ctx.quadraticCurveTo(x[i], y[i], (x[i] + x[i + 1]) / 2, (y[i] + y[i + 1]) / 2);
    ctx.lineTo(x[N - 1], y[N - 1]);
    ctx.stroke();
    // the text, photo and cards sit above this canvas, so the string passes behind them
    if (!S.coarse && handK < 0.5 && !held) { // your hand, a marigold dot
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFB627';
      ctx.beginPath(); ctx.arc(x[0], y[0], 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 7. the kite rides the last segment (and loops once if you tap it)
    const dx = x[N - 1] - x[N - 3], dy = y[N - 1] - y[N - 3];
    let a = clamp(Math.atan2(dx, -dy) * 0.7, -0.7, 0.7);
    if (loop < 1) {
      loop = Math.min(1, loop + dt / 0.9);
      const e = loop < 0.5 ? 4 * loop ** 3 : 1 - (-2 * loop + 2) ** 3 / 2;
      a += e * Math.PI * 2 * (windX < 0 ? -1 : 1);
    }
    S.kite.x = x[N - 1]; S.kite.y = y[N - 1]; S.kite.a = a;
    kite.place(x[N - 1], y[N - 1], a, windX, dt);

    // 8. the readout: how much string is out, written ten times a second at most
    if (S.t - lastRead > 0.1) {
      lastRead = S.t;
      readNum.textContent = String(Math.round(L / 10));
      readout.style.opacity = String((1 - handK) * (held ? 0 : 1) * Math.max(0, 1 - out * 1.4));
    }
    const rx = clamp(anchor.x + (S.coarse ? -64 : 14), 8, S.w - 140);
    const ry = clamp(anchor.y + (S.coarse ? -64 : 12), 8, S.h - 28);
    readout.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
  }

  /** Tap or click near the string: it rings. Near the kite: the kite loops. Returns true if it hit. */
  function pluck(px: number, py: number): boolean {
    if (Math.hypot(px - x[N - 1], py - y[N - 1]) < 60 * kiteScale) { if (loop >= 1) loop = 0; return true; }
    let best = -1, bd = 24;
    for (let i = 3; i < N - 2; i++) {
      const d = Math.hypot(px - x[i], py - y[i]);
      if (d < bd) { bd = d; best = i; }
    }
    if (best < 0 || Math.hypot(px - anchor.x, py - anchor.y) < 36) return false;
    // a sideways kick, strongest at the tap, fading along the string both ways
    const tx = x[best + 1] - x[best - 1], ty = y[best + 1] - y[best - 1];
    const tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
    for (let i = 1; i < N - 1; i++) {
      const f = Math.exp(-((i - best) ** 2) / 18) * 14 * (i % 2 ? 1 : 0.8);
      ox[i] -= nx * f; oy[i] -= ny * f;
    }
    return true;
  }

  /** Desktop click anywhere else: a tug from the hand runs up the string. */
  function tug() {
    const i = 6, tx = x[i + 1] - x[i - 1], ty = y[i + 1] - y[i - 1];
    const tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
    for (let k = 1; k < N - 1; k++) {
      const f = Math.exp(-((k - i) ** 2) / 30) * 16;
      ox[k] -= nx * f; oy[k] -= ny * f;
    }
    // and the kite dips toward the hand
    const kx = anchor.x - x[N - 1], ky = anchor.y - y[N - 1], kl = Math.hypot(kx, ky) || 1;
    ox[N - 1] -= (kx / kl) * 9; oy[N - 1] -= (ky / kl) * 9;
  }

  /** Reduced motion: one still string from the photo to a parked kite, drawn once. */
  function still() {
    const h = photoHand() ?? home();
    const k = { x: S.w * (S.w < 700 ? 0.3 : 0.4), y: S.h * 0.14 };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, S.w, S.h);
    ctx.strokeStyle = '#FFF1D6'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(h.x, h.y);
    ctx.quadraticCurveTo((h.x + k.x) / 2 + 40, (h.y + k.y) / 2 + 60, k.x, k.y);
    ctx.stroke();
    kite.place(k.x, k.y, -0.12, 0, 0);
  }

  return { step, still, onResize, pluck, tug };
}
