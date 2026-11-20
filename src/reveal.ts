// Every element animates on scroll. Entrances: CSS transitions flipped by ScrollTrigger.batch.
// Scrubbed motion (tied to the scroll position, both ways): GSAP with scrub, transform and opacity only.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { S } from './state.ts';

export function makeReveals() {
  // split the big headings into words (kept as one accessible text via aria-label)
  document.querySelectorAll<HTMLElement>('.words').forEach((h) => {
    const text = h.textContent ?? '';
    h.setAttribute('aria-label', text);
    h.textContent = '';
    text.split(' ').forEach((w, i, all) => {
      const s = document.createElement('span');
      s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.textContent = w;
      h.appendChild(s);
      if (i < all.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  const tag = (step: number, max: number) => (batch: Element[]) => batch.forEach((el, i) => {
    (el as HTMLElement).style.setProperty('--d', `${Math.min(i, max) * step}ms`);
    el.classList.add('in');
  });
  ScrollTrigger.batch('[data-r]', { start: 'top 92%', once: true, onEnter: tag(50, 5) });
  ScrollTrigger.batch('[data-f]', { start: 'top 96%', once: true, onEnter: tag(30, 12) });
  ScrollTrigger.batch('[data-row]', { start: 'top 94%', once: true, onEnter: tag(60, 4) });

  if (S.reduce) {
    document.querySelectorAll('.words .w').forEach((w) => w.classList.add('in'));
    return;
  }

  // headings: each word fills in as you scroll through it (and empties again if you scroll back)
  document.querySelectorAll<HTMLElement>('.words').forEach((h) => {
    gsap.fromTo(h.querySelectorAll('.w'), { opacity: 0.16, y: 14 }, {
      opacity: 1, y: 0, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 62%', scrub: 0.4 },
    });
  });

  // hero: everything is visible on load; scrolling away lifts each line at its own rate,
  // and the letters of the name let go one by one
  gsap.utils.toArray<HTMLElement>('[data-hero]').forEach((el, i) => {
    gsap.to(el, {
      y: -(20 + i * 16), opacity: 0.1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });
  gsap.utils.toArray<HTMLElement>('.hero-name .ch').forEach((el, i) => {
    gsap.to(el, {
      y: -(10 + ((i * 37) % 5) * 22), rotate: ((i % 2 ? 1 : -1) * (4 + i * 2)), ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.3 },
    });
  });
  // tap or click the name: the letters hop in a wave
  const name = document.querySelector('.hero-name') as HTMLElement;
  name.addEventListener('click', () => {
    name.classList.remove('hop'); void name.offsetWidth; name.classList.add('hop');
  });
  name.addEventListener('animationend', (e) => { if ((e.target as Element).parentElement === name.lastElementChild) name.classList.remove('hop'); });

  // the intro's lead string draws down toward the cards
  gsap.fromTo('.intro .lead', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.intro', start: 'top 70%', end: 'bottom 40%', scrub: true },
  });
  // the panel (counter, year rail, hint) slides in as the cards arrive
  gsap.from('.stage .panel > *', {
    x: -18, opacity: 0, ease: 'none', stagger: 0.15,
    scrollTrigger: { trigger: '.spiral', start: 'top 85%', end: 'top 25%', scrub: true },
  });
  gsap.from('.stage .helix', {
    y: 60, opacity: 0, scale: 0.94, ease: 'none',
    scrollTrigger: { trigger: '.spiral', start: 'top 95%', end: 'top 15%', scrub: true },
  });
  // footer: the clouds sink in slower than the page, the sea rises to meet them
  gsap.fromTo('.sky-band .ascii', { yPercent: -18 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.sky-band', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.from('#flyer', {
    x: -40, ease: 'none',
    scrollTrigger: { trigger: '.sea', start: 'top 90%', end: 'center 60%', scrub: true },
  });
  gsap.from('.caption', {
    x: 30, ease: 'none',
    scrollTrigger: { trigger: '.sea', start: 'top 80%', end: 'bottom bottom', scrub: true },
  });
}
