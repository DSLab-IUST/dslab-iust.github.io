# Motion

Accent color is a token. Swap `--fx-accent` to restyle every glow, pulse, and hover highlight without touching timings.

```css
:root {
  --fx-accent: 255 122 24;
  --fx-ease-out: cubic-bezier(.2, .8, .2, 1);
}
```

## Keyframes

```css
@keyframes ping {
  50% { box-shadow: 0 0 0 12px rgb(var(--fx-accent) / 0); }
}

@keyframes beacon {
  70% { box-shadow: 0 0 0 18px rgb(var(--fx-accent) / 0); }
}

@keyframes sweep {
  50%, 100% { transform: translateX(110%); }
}

@keyframes spin-ring {
  from { transform: translate(-50%, -50%) rotateX(64deg) rotateZ(0deg); }
  to   { transform: translate(-50%, -50%) rotateX(64deg) rotateZ(360deg); }
}

@keyframes spin-ring-offset {
  from { transform: translate(-50%, -50%) rotateX(69deg) rotateZ(70deg); }
  to   { transform: translate(-50%, -50%) rotateX(69deg) rotateZ(-290deg); }
}

@keyframes shimmer {
  to { background-position: -250% 0; }
}
```

## Loops

```css
.status-dot {
  animation: ping 2s infinite;
}

.stage-card::before {
  transform: translateX(-110%);
  animation: sweep 7s ease-in-out infinite;
}

.ring-a {
  animation: spin-ring 17s linear infinite;
}

.ring-b {
  animation: spin-ring-offset 24s linear infinite;
}

.beacon {
  animation: beacon 2.3s infinite;
}

.beacon-lag {
  animation-delay: 1.1s;
}

.skeleton {
  background-size: 250% 100%;
  animation: shimmer 1.4s infinite;
}
```

## Enter on scroll

```css
.enter {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .7s ease, transform .7s ease;
}

.enter.is-in {
  opacity: 1;
  transform: translateY(0);
}
```

```js
function observeEnter() {
  const nodes = document.querySelectorAll(".enter");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".enter:not(.is-in)").forEach((el) => io.observe(el));
}
```

Stagger when rendering lists:

```js
el.style.transitionDelay = `${Math.min(index * 35, 180)}ms`; // dense grid
el.style.transitionDelay = `${Math.min(index * 55, 220)}ms`; // wide cards
el.style.transitionDelay = `${Math.min(index * 45, 180)}ms`; // standard cards
```

## Pointer follow + 3D tilt

```css
.pointer-aura {
  position: fixed;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(circle, rgb(var(--fx-accent) / 0.11), transparent 68%);
  transform: translate(-50%, -50%);
  filter: blur(4px);
}

.stage {
  perspective: 900px;
}

.stage-card {
  transform-style: preserve-3d;
  transition: transform .2s ease;
}

@media (max-width: 680px) {
  .pointer-aura { display: none; }
}
```

```js
function bindPointerMotion() {
  const aura = document.getElementById("pointerAura");
  if (aura) {
    window.addEventListener("pointermove", (e) => {
      aura.style.left = `${e.clientX}px`;
      aura.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  const card = document.getElementById("stageCard");
  if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  card.addEventListener("pointermove", (e) => {
    const box = card.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    card.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "rotateY(0) rotateX(0)";
  });
}
```

## Hover and interaction

```css
.nav a { transition: .25s; }

.btn { transition: .25s; }
.btn-solid:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 45px rgb(var(--fx-accent) / 0.3);
}

.tile { transition: .35s; }
.tile:hover { transform: translateY(-7px); }
.tile::after { transition: .35s; }
.tile:hover::after { transform: scale(1.8); }

.icon-btn { transition: .25s; }
.icon-btn:hover { transform: translateY(-2px); }

.person-card { transition: .3s; }
.person-card:hover { transform: translateY(-5px); }

.item-card { transition: .3s; }
.item-card:hover { transform: translateY(-5px); }
.item-card.featured:hover { transform: translateY(-6px); }

.spotlight {
  transition: border-color .3s ease, transform .3s ease, background .3s ease;
}
.spotlight:hover { transform: translateY(-6px); }
.spotlight::after {
  transform: translateX(-120%);
  transition: transform .8s ease;
}
.spotlight:hover::after { transform: translateX(120%); }

.avatar {
  transition: transform .23s ease, border-color .23s ease, z-index .23s ease;
}
.avatar:hover,
.avatar:focus-visible {
  transform: translateY(-5px) scale(1.07);
}

.event-card {
  transition: transform .32s ease, border-color .32s ease, background .32s ease, box-shadow .32s ease;
}
.event-card:hover { transform: translateY(-5px); }

.event-speaker > svg {
  transition: transform .22s ease, color .22s ease;
}
.event-speaker:not(:disabled):hover > svg {
  transform: translate(2px, -2px);
}

.event-action a {
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease;
}
.event-action a:hover { transform: translateY(-2px); }

.item-links a { transition: .2s; }

.badge {
  transition: transform .22s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease;
}
.person-card:hover .badge { transform: translateY(-1px); }

.mode-toggle {
  transition: background .25s ease, border-color .25s ease, transform .25s ease, box-shadow .25s ease, color .25s ease;
}
.mode-toggle:hover { transform: translateY(-1px); }

.mode-icon {
  transition: opacity .28s ease, transform .35s var(--fx-ease-out);
}
.mode-icon-sun { opacity: 1; transform: rotate(0deg) scale(1); }
.mode-icon-moon { opacity: 0; transform: rotate(-35deg) scale(.6); }
html[data-theme="light"] .mode-icon-sun { opacity: 0; transform: rotate(35deg) scale(.6); }
html[data-theme="light"] .mode-icon-moon { opacity: 1; transform: rotate(0deg) scale(1); }

body,
.masthead,
.btn-soft,
.btn-ghost,
.mode-toggle,
.stage-card,
.metric,
.tile,
.lead-stage,
.lead-card,
.person-card,
.person-card.lead > .person-inner,
.panel,
.event-card,
.spotlight,
.item-card,
.quote-card,
.dialog,
.chips span,
.tags span,
.item-links a {
  transition-property: background, background-color, border-color, color, box-shadow, transform;
  transition-duration: .28s;
  transition-timing-function: ease;
}

html { scroll-behavior: smooth; }
```

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```
