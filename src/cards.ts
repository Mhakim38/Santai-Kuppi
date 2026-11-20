// The cards are the spiral: every project tied along the kite string like bows on a tail, wound on a
// helix, Work first and then Side projects, newest first inside each. Scroll, drag sideways, tap a side card or use the arrow keys:
// the active card turns to the front, flat and full size. Only two cards either side are drawn.
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { S, type Project, type Stat, when, tag, fmtStat, GROUP } from './state.ts';
import { lerp, clamp } from './vendor/line-art/motion.ts';

const STEP = (100 * Math.PI) / 180;
const SHOWN = 2.6; // cards further than this from the front are hidden

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e;
};
const shapeOf = (p: Project) => (p.kind === 'ft' ? 'shape-ft' : p.kind === 'concept' ? 'shape-cn' : 'shape-pt');
/** stat chips: the number, its label, and its source in the title and the accessible name */
function statChips(p: Project) {
  const ul = el('ul', 'stats');
  p.stats.forEach((s) => {
    const li = el('li', 'stat');
    li.title = `${s.label}: ${fmtStat(s)}. Source: ${s.source}.`;
    li.setAttribute('aria-label', `${fmtStat(s)} ${s.label}, ${s.source}`);
    const b = el('b', 'stat-n', S.reduce || s.n === null ? fmtStat(s) : fmtStat(s, 0)); b.setAttribute('aria-hidden', 'true');
    const l = el('span', 'stat-l', s.label); l.setAttribute('aria-hidden', 'true');
    li.append(b, l); ul.appendChild(li);
  });
  return ul;
}
/** the body shared by a spiral card and a list row: what, stack, role, stats, then More */
export function cardBody(p: Project, uid: string) {
  const frag = document.createDocumentFragment();
  frag.appendChild(el('p', 'card-line', p.line));
  if (p.stack.length) {
    const ul = el('ul', 'stack'); ul.setAttribute('aria-label', 'Stack');
    p.stack.forEach((t) => ul.appendChild(el('li', 'tech mono', t)));
    frag.appendChild(ul);
  }
  if (p.role) { const r = el('p', 'role'); r.append(el('span', 'mono', 'Role'), ` ${p.role}`); frag.appendChild(r); }
  if (p.stats.length) frag.appendChild(statChips(p));
  const more = el('button', 'more mono', 'More');
  more.type = 'button'; more.setAttribute('aria-expanded', 'false'); more.setAttribute('aria-controls', uid);
  const box = el('div', 'more-box'); box.id = uid; box.hidden = true;
  p.about.forEach((t) => box.appendChild(el('p', '', t)));
  if (p.detail.length) { const ul = el('ul', 'detail'); p.detail.forEach((t) => ul.appendChild(el('li', '', t))); box.appendChild(ul); }
  frag.append(more, box);
  return frag;
}
/** count a card's numbers up once, 600ms, ease out */
export function countUp(root: Element) {
  root.querySelectorAll<HTMLElement>('.stat').forEach((li) => {
    const b = li.querySelector('.stat-n') as HTMLElement;
    const s = (li as HTMLElement & { _s?: Stat })._s;
    if (!s || s.n === null || S.reduce) return;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 600), e = 1 - (1 - k) ** 3;
      b.textContent = fmtStat(s, s.n! * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
const bindStats = (root: Element, p: Project) => root.querySelectorAll('.stat').forEach((li, i) => { (li as HTMLElement & { _s?: Stat })._s = p.stats[i]; });

export function makeCards(projects: Project[]) {
  const section = document.getElementById('spiral') as HTMLElement;
  const stage = section.querySelector('.stage') as HTMLElement;
  const helix = section.querySelector('.helix') as HTMLElement;
  const holder = section.querySelector('.cards') as HTMLElement;
  const cv = section.querySelector('.helix-cv') as HTMLCanvasElement;
  const announce = document.getElementById('announce') as HTMLElement;
  const ctx = cv.getContext('2d')!;
  const n = projects.length;
  const last = n - 1;

  // ---- the cards
  const cards = projects.map((p, i) => {
    const c = document.createElement('article');
    c.className = `card ${p.kind === 'ft' ? 'ft' : 'pt'}${p.kind === 'concept' ? ' concept' : ''}`;
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML = `<div class="card-in"><p class="card-top mono"><span class="card-tag"><i class="shape"></i><span></span></span><span class="card-n"></span></p><h3 class="card-name"></h3><p class="card-when mono"></p></div><span class="shade"></span>`;
    (c.querySelector('.shape') as HTMLElement).classList.add(shapeOf(p));
    (c.querySelector('.card-tag span') as HTMLElement).textContent = tag(p);
    (c.querySelector('.card-n') as HTMLElement).textContent = `${GROUP[p.group]} ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    (c.querySelector('.card-name') as HTMLElement).textContent = p.name;
    (c.querySelector('.card-when') as HTMLElement).textContent = p.slogan ? `"${p.slogan}". ${when(p.when)}` : when(p.when);
    const inner = c.querySelector('.card-in') as HTMLElement;
    inner.appendChild(cardBody(p, `more-${p.id}`));
    bindStats(inner, p);
    holder.appendChild(c);
    return c;
  });
  const focusables = cards.map((c) => [...c.querySelectorAll<HTMLElement>('button')]);
  focusables.forEach((f) => f.forEach((b) => { b.tabIndex = -1; }));
  // More: opens the two about lines and the detail; the card is measured again so the string avoids it
  cards.forEach((c, ci) => c.querySelector('.more')!.addEventListener('click', (e) => {
    const b = e.currentTarget as HTMLButtonElement, box = document.getElementById(b.getAttribute('aria-controls')!) as HTMLElement;
    if (innerWidth < 700) {                     // a phone stage is one screen tall: read the detail in the list instead
      const row = document.getElementById(`row-${projects[ci].id}`) as HTMLElement;
      const lb = row.querySelector('.more') as HTMLButtonElement;
      if (lb.getAttribute('aria-expanded') !== 'true') lb.click();
      row.scrollIntoView({ behavior: S.reduce ? 'auto' : 'smooth', block: 'start' });
      lb.focus({ preventScroll: true });
      return;
    }
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Less' : 'More'; box.hidden = !open;
    c.classList.toggle('open', open);
    size();
  }));
  const shades = cards.map((c) => c.querySelector('.shade') as HTMLElement);
  (section.querySelector('.count-all') as HTMLElement).textContent = String(n).padStart(2, '0');

  // ---- scroll position <-> card index. The track is sized once per width, so a phone's toolbar
  //      showing or hiding cannot change the scroll length under the reader.
  let lockW = -1;
  const sizeTrack = () => {
    if (S.w === lockW) return;
    lockW = S.w;
    // the section itself carries the scroll length, so the sticky stage can never run past it
    section.style.height = `${Math.round(n * Math.max(320, S.h * 0.5))}px`;
  };
  sizeTrack();

  let target = 0, cur = 0, active = -1, inView = false, visible = false, dragging = false;
  const st = ScrollTrigger.create({
    trigger: section, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => { target = self.progress * last; },
    onToggle: (self) => { inView = self.isActive; },
  });
  ScrollTrigger.create({
    trigger: section, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => { visible = self.isActive; },
  });

  const yOf = (i: number) => Math.round(st.start + (i / last) * (st.end - st.start)) + 1;
  function jump(i: number, say: boolean) {
    i = Math.max(0, Math.min(last, i));
    window.scrollTo({ top: yOf(i), behavior: S.reduce ? 'auto' : 'smooth' });
    if (say) announce.textContent = `${GROUP[projects[i].group]}. ${projects[i].name}. ${i + 1} of ${n}. ${tag(projects[i])}. ${when(projects[i].when)}. ${projects[i].line}`;
  }
  // settle on the nearest card once scrolling stops, so a card always reads cleanly
  ScrollTrigger.addEventListener('scrollEnd', () => {
    if (S.reduce || dragging || !st.isActive) return;
    const i = Math.round(target);
    if (Math.abs(scrollY - yOf(i)) > 3) jump(i, false);
  });

  // Work and Side projects: each jump goes to the first (newest) card of its group
  const firstOf = (g: string) => projects.findIndex((p) => p.group === g);
  document.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach((b) => b.addEventListener('click', () => jump(firstOf(b.dataset.jump!), true)));
  const groups = [...section.querySelectorAll<HTMLButtonElement>('.year')];
  groups.forEach((b) => b.addEventListener('click', () => jump(firstOf(b.dataset.group!), true)));
  section.querySelectorAll<HTMLElement>('[data-group-n]').forEach((e) => { e.textContent = String(projects.filter((p) => p.group === e.dataset.groupN).length); });

  // keyboard: one tab stop, arrows move between cards
  helix.addEventListener('keydown', (e) => {
    const k = e.key;
    let i = -1;
    if (k === 'ArrowDown' || k === 'ArrowRight') i = active + 1;
    else if (k === 'ArrowUp' || k === 'ArrowLeft') i = active - 1;
    else if (k === 'Home') i = 0;
    else if (k === 'End') i = last;
    if (i < 0 || i > last) return;
    e.preventDefault();
    jump(i, true);
  });

  // drag sideways to spin (touch keeps vertical scrolling native); a tap on a side card brings it round
  let px0 = 0, py0 = 0, y0 = 0, pid = -1, travel = 0;
  const perCard = () => (st.end - st.start) / last;
  helix.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || S.reduce) return;
    pid = e.pointerId; px0 = e.clientX; py0 = e.clientY; y0 = scrollY; travel = 0;
  });
  helix.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - px0, dy = e.clientY - py0;
    travel = Math.max(travel, Math.hypot(dx, dy));
    if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      dragging = true; helix.setPointerCapture(pid); helix.classList.add('grabbing');
    }
    if (dragging) window.scrollTo({ top: y0 - (dx / 150) * perCard(), behavior: 'auto' });
  });
  const release = (e: PointerEvent) => {
    if (e.pointerId !== pid) return;
    pid = -1;
    if (dragging) { dragging = false; helix.classList.remove('grabbing'); jump(Math.round(target), true); return; }
    if (travel < 8 && e.type === 'pointerup') {
      const c = (e.target as HTMLElement).closest('.card');
      const i = c ? cards.indexOf(c as HTMLElement) : -1;
      if (i >= 0 && i !== active) jump(i, true);
    }
  };
  helix.addEventListener('pointerup', release);
  helix.addEventListener('pointercancel', release);

  // ---- active card, counter, year rail
  const nowEl = section.querySelector('.count-now') as HTMLElement;
  const roll = section.querySelector('.count-roll') as HTMLElement;
  const railFill = section.querySelector('.rail-line i') as HTMLElement;
  const counted = new Set<number>();
  const setActive = (i: number) => {
    if (i === active) return;
    if (active >= 0) { cards[active].classList.remove('on'); cards[active].setAttribute('aria-hidden', 'true'); focusables[active].forEach((b) => { b.tabIndex = -1; }); }
    cards[i].classList.add('on'); cards[i].setAttribute('aria-hidden', 'false'); focusables[i].forEach((b) => { b.tabIndex = 0; });
    groups.forEach((b) => b.classList.toggle('on', b.dataset.group === projects[i].group));
    nowEl.textContent = String(i + 1).padStart(2, '0');
    if (!S.reduce) { roll.classList.remove('roll'); void roll.offsetWidth; roll.classList.add('roll'); }
    active = i;
  };
  setActive(0);

  // ---- geometry
  let W = 0, H = 0, dpr = 1, offX = 0, offY = 0;
  let hs: number[] = [], cw = 0;
  const size = () => {
    sizeTrack();
    const r = helix.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    W = r.width; H = r.height; offX = r.left - sr.left; offY = r.top - sr.top;
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cw = cards[0].offsetWidth;
    hs = cards.map((c) => c.offsetHeight);
  };

  const geo = () => {
    const desk = S.w >= 700;
    return {
      cx: W / 2, cy: H * 0.5,
      r: desk ? Math.min(W * 0.24, 190) : Math.min(W * 0.31, 120),
      pitch: desk ? 128 : 92,
    };
  };

  // the active card leans toward a fine pointer, on a spring
  let tx = 0, ty = 0, tvx = 0, tvy = 0;

  function draw(dt: number) {
    S.spiral = lerp(S.spiral, inView ? 1 : 0, 0.08);
    S.past = lerp(S.past, S.scrollY > st.start - S.h * 0.25 ? 1 : 0, 0.06);
    S.avoid.length = 0;
    if (inView && active >= 0) {
      const h = hs[active] || 0;
      S.avoid.push({ x: offX + W / 2 - cw / 2, y: offY + H * 0.5 - h / 2, w: cw, h });
    }
    if (!visible) return;
    cur = lerp(cur, target, Math.min(1, dt * 9));
    if (Math.abs(cur - target) < 0.0005) cur = target;
    setActive(Math.max(0, Math.min(last, Math.round(cur))));
    // a card counts its numbers once, when it has actually settled at the centre (never mid-flight)
    if (!counted.has(active) && Math.abs(cur - active) < 0.04) { counted.add(active); countUp(cards[active]); }

    const { cx, cy, r, pitch } = geo();
    const at = (s: number) => {
      const a = (s - cur) * STEP;
      return { x: cx + r * Math.sin(a), y: cy + (s - cur) * pitch, z: Math.cos(a) };
    };

    // the tail string through every card: solid by own work, dashed by full-time work, faded behind
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.strokeStyle = '#FFF1D6';
    const span = H / pitch / 2 + 1.5;
    const s0 = Math.max(cur - span, -6), s1 = Math.min(cur + span, last + 0.6);
    let prev = at(s0), runKey = '', run: Path2D | null = null, dash = false, alpha = 1;
    const flush = () => { if (!run) return; ctx.globalAlpha = alpha; ctx.setLineDash(dash ? [5, 5] : []); ctx.stroke(run); run = null; };
    for (let s = s0 + 0.05; s <= s1 + 0.001; s += 0.05) {
      const p = at(s);
      const idx = Math.max(0, Math.min(last, Math.round(s)));
      const d = s > -0.5 && projects[idx].kind === 'ft';
      const zq = Math.round(((p.z + prev.z) / 2 + 1) * 2) / 4;
      const a = 0.14 + zq * 0.7;
      const key = `${d}|${a}`;
      if (key !== runKey) { flush(); runKey = key; dash = d; alpha = a; run = new Path2D(); run.moveTo(prev.x, prev.y); }
      run!.lineTo(p.x, p.y);
      prev = p;
    }
    flush();
    ctx.setLineDash([]); ctx.globalAlpha = 1;

    // tilt spring for the front card
    let gx = 0, gy = 0;
    if (!S.coarse && S.ptr.on && inView) {
      gx = clamp((S.ptr.x - (offX + cx)) / (W * 0.5), -1, 1);
      gy = clamp((S.ptr.y - (offY + cy)) / (H * 0.5), -1, 1);
    }
    tvx += (gx - tx) * 140 * dt; tvx *= Math.exp(-18 * dt); tx += tvx * dt;
    tvy += (gy - ty) * 140 * dt; tvy *= Math.exp(-18 * dt); ty += tvy * dt;

    for (let i = 0; i < n; i++) {
      const c = cards[i], off = i - cur, ao = Math.abs(off);
      if (ao > SHOWN) { if (c.style.visibility !== 'hidden') c.style.visibility = 'hidden'; continue; }
      if (c.style.visibility !== 'visible') c.style.visibility = 'visible';
      const p = at(i);
      const front = Math.max(0, 1 - ao);
      const sc = (0.8 + 0.2 * front) * (0.9 + 0.1 * ((p.z + 1) / 2));
      const turn = (-(p.x - cx) / r) * 26 * (1 - front);
      const lean = front > 0.5 ? `rotateX(${(-ty * 5 * front).toFixed(2)}deg) rotateY(${(tx * 6 * front).toFixed(2)}deg)` : '';
      c.style.transform = `translate(-50%, -50%) translate3d(${(p.x - cx).toFixed(1)}px, ${(p.y - cy).toFixed(1)}px, 0) perspective(900px) rotateY(${turn.toFixed(2)}deg) ${lean} scale(${sc.toFixed(3)})`;
      c.style.opacity = Math.min(1, Math.max(0, (SHOWN - ao) / 1.1)).toFixed(3);
      c.style.zIndex = String(Math.round(100 + p.z * 40 - ao * 6));
      shades[i].style.opacity = ((1 - front) * (0.16 + 0.34 * (1 - (p.z + 1) / 2))).toFixed(3);
    }
    railFill.style.setProperty('--p', (cur / last).toFixed(4));
  }

  return { draw, size };
}

export function makeList(projects: Project[]) {
  const ol = document.getElementById('plain-list') as HTMLOListElement;
  let k = 0, last = '';
  projects.forEach((p) => {
    if (p.group !== last) {
      last = p.group;
      const h = el('li', 'group-h'); h.setAttribute('data-row', 'l');
      const t = el('h3', '', `${GROUP[p.group]}`); t.append(' ', el('span', 'mono', String(projects.filter((q) => q.group === p.group).length)));
      h.appendChild(t); ol.appendChild(h);
    }
    k++;
    const li = el('li', `row ${p.kind}`); li.setAttribute('data-row', k % 2 ? 'r' : 'l'); li.id = `row-${p.id}`;
    li.innerHTML = `<span class="n"></span><div class="row-in"><p class="nm"><i class="shape" aria-hidden="true"></i><span></span></p><p class="w mono"></p></div>`;
    (li.querySelector('.n') as HTMLElement).textContent = String(k).padStart(2, '0');
    (li.querySelector('.shape') as HTMLElement).classList.add(shapeOf(p));
    (li.querySelector('.nm span') as HTMLElement).textContent = p.name;
    (li.querySelector('.w') as HTMLElement).textContent = `${p.slogan ? `"${p.slogan}". ` : ''}${when(p.when)}. ${tag(p)}.`;
    const body = li.querySelector('.row-in') as HTMLElement;
    body.appendChild(cardBody(p, `lmore-${p.id}`));
    bindStats(body, p);
    body.querySelector('.more')!.addEventListener('click', (e) => {
      const b = e.currentTarget as HTMLButtonElement, box = document.getElementById(b.getAttribute('aria-controls')!) as HTMLElement;
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Less' : 'More'; box.hidden = !open;
    });
    ol.appendChild(li);
  });
  // list rows count their numbers once, when they come into view
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); countUp(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  ol.querySelectorAll('li.row').forEach((li) => io.observe(li));
}
