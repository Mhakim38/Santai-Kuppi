// "Try it here": the card unfolds into a window onto the live site, on this page. A native modal
// <dialog> (the page behind is inert, Esc closes it), built on open and removed on close, so no
// other site is loaded until someone asks for it.
import { S, type Project } from './state.ts';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e;
};
const SLOW_MS = 12000;

export function openTry(p: Project, opener: HTMLElement) {
  if (!p.try || document.querySelector('dialog.try')) return;
  // measured before anything changes: the unfold starts from the card or list row that was pressed
  const from = (opener.closest('.card, li.row') ?? opener).getBoundingClientRect();
  const y = scrollY;

  const dlg = el('dialog', 'try'); dlg.setAttribute('aria-labelledby', 'try-name'); dlg.dataset.mode = 'full';
  const edge = () => { const s = el('span', 'try-edge'); s.tabIndex = 0; return s; };
  const first = edge(), end = edge();

  const bar = el('div', 'try-bar');
  const title = el('div', 'try-title');
  const name = el('h2', 'try-name', p.name); name.id = 'try-name';
  const sub = el('p', 'try-sub mono');
  const out = el('a', 'try-out', 'Open in a new tab'); out.href = p.try; out.target = '_blank'; out.rel = 'noopener';
  sub.append(el('span', '', new URL(p.try).hostname), out);
  title.append(name, sub);

  const modes = el('div', 'try-modes'); modes.setAttribute('role', 'group'); modes.setAttribute('aria-label', 'Preview width');
  const buttons = ([['full', 'Full width'], ['phone', 'Phone width']] as const).map(([mode, text]) => {
    const b = el('button', 'try-mode mono', text); b.type = 'button'; b.setAttribute('aria-pressed', String(mode === 'full'));
    b.addEventListener('click', () => {
      dlg.dataset.mode = mode;
      buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    });
    modes.appendChild(b);
    return b;
  });
  const close = el('button', 'try-close mono', 'Close'); close.type = 'button';
  close.addEventListener('click', () => dlg.close());
  bar.append(title, modes, close);

  const stage = el('div', 'try-stage');
  const device = el('div', 'try-device');
  const load = el('div', 'try-load mono'); load.setAttribute('role', 'status');
  const kite = el('i', ''); kite.setAttribute('aria-hidden', 'true');
  const msg = el('p', '', 'Opening the site');
  load.append(kite, msg);
  const frame = el('iframe', '');
  frame.title = `${p.name}, live site`;
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
  const slow = setTimeout(() => { msg.textContent = 'Still loading. You can also open it in a new tab.'; }, SLOW_MS);
  frame.addEventListener('load', () => { clearTimeout(slow); device.classList.add('ready'); msg.textContent = ''; });
  frame.src = p.try; // set before it joins the page, so it adds no history entry
  device.append(load, frame);
  stage.appendChild(device);
  dlg.append(first, bar, stage, end);

  // keep Tab inside: past either end wraps to the other
  first.addEventListener('focus', () => frame.focus());
  end.addEventListener('focus', () => out.focus());

  dlg.addEventListener('close', () => {
    clearTimeout(slow);
    dlg.remove(); // takes the iframe, and everything running in it, with it
    document.documentElement.classList.remove('try-open');
    S.paused = false;
    if (scrollY !== y) scrollTo({ top: y, behavior: 'instant' });
    opener.focus({ preventScroll: true });
  });

  document.body.appendChild(dlg);
  document.documentElement.classList.add('try-open');
  S.paused = true;
  dlg.showModal();
  close.focus({ preventScroll: true });

  if (!S.reduce) {
    const vw = dlg.clientWidth, vh = dlg.clientHeight;
    const px = (v: number) => `${Math.max(0, Math.round(v))}px`;
    dlg.animate([
      { clipPath: `inset(${px(from.top)} ${px(vw - from.right)} ${px(vh - from.bottom)} ${px(from.left)} round 26px)` },
      { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
    ], { duration: 420, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
  }
}
