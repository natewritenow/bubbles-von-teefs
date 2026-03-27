import FISH_DATA_URL from './fish-data';

const COMMAND_NAME = 'bubbles-von-teefs.fish-celebration';
const ROOT_ID = 'aha-fish-celebration-root';
const STYLE_ID = 'aha-fish-celebration-styles';
const ANIMATION_MS = 1265;
const COOLDOWN_MS = 500;
const FISH_COUNT = 4;
const FISH_STAGGER_MS = 390;
const TOTAL_EFFECT_MS = ANIMATION_MS + FISH_STAGGER_MS * (FISH_COUNT - 1);
const FISH_LEFT_START = -18;
const FISH_LEFT_VARIANCE = 36;
const FISH_TOP_START = 8;
const FISH_TOP_VARIANCE = 28;
const BUBBLE_COUNT = 180;

let lastTriggeredAt = 0;
let lastAnchor = null;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${ROOT_ID} {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 10000;
      overflow: hidden;
    }

    #${ROOT_ID} .fish-celebration__cluster {
      position: absolute;
      width: 104px;
      height: 104px;
      transform: translate(-34px, -56px);
    }

    #${ROOT_ID} .fish-celebration__fish {
      position: absolute;
      left: -18px;
      top: 8px;
      width: 81px;
      z-index: 2;
      opacity: 0;
      will-change: transform, opacity;
      filter: drop-shadow(0 7px 10px rgba(0, 0, 0, 0.18));
      animation: fish-pop ${ANIMATION_MS}ms ease-out forwards;
    }

    #${ROOT_ID} .fish-celebration__bubble {
      position: absolute;
      bottom: var(--bubble-base-y);
      left: var(--bubble-base-x);
      width: var(--bubble-size);
      height: var(--bubble-size);
      z-index: 1;
      border-radius: 999px;
      opacity: 0;
      will-change: transform, opacity;
      background:
        radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.28) 45%, rgba(150, 222, 255, 0.2) 70%, rgba(150, 222, 255, 0.05) 100%);
      box-shadow:
        inset 0 0 2px rgba(255, 255, 255, 0.7),
        0 0 4px rgba(101, 196, 255, 0.3);
      animation: bubble-rise var(--bubble-duration) ease-out var(--bubble-delay) forwards;
    }

    @keyframes fish-pop {
      0% {
        opacity: 0;
        transform: translate3d(-8px, 20px, 0) scale(0.3) rotate(-10deg);
      }
      18% {
        opacity: 1;
      }
      45% {
        transform: translate3d(8px, -4px, 0) scale(0.98) rotate(5deg);
      }
      70% {
        opacity: 1;
        transform: translate3d(2px, -8px, 0) scale(1) rotate(-2deg);
      }
      100% {
        opacity: 0;
        transform: translate3d(16px, -18px, 0) scale(0.85) rotate(6deg);
      }
    }

    @keyframes bubble-rise {
      0% {
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(0.2);
      }
      20% {
        opacity: 0.9;
      }
      100% {
        opacity: 0;
        transform: translate3d(var(--bubble-drift-x), var(--bubble-rise-y), 0) scale(1);
      }
    }
  `;

  document.head.appendChild(style);
}

function ensureRoot() {
  let root = document.getElementById(ROOT_ID);

  if (!root) {
    root = document.createElement('div');
    root.id = ROOT_ID;
    document.body.appendChild(root);
  }

  return root;
}

function buildBubble() {
  const bubble = document.createElement('div');
  const size = 3 + Math.round(Math.random() * 4);
  const baseX = `${Math.round(0 + Math.random() * 52)}px`;
  const baseY = `${Math.round(10 + Math.random() * 26)}px`;
  const driftX = `${Math.round(-26 + Math.random() * 52)}px`;
  const riseY = `${Math.round(-38 - Math.random() * 34)}px`;
  const duration = 345 + Math.round(Math.random() * 255);
  const delay = Math.round(Math.random() * 105);

  bubble.className = 'fish-celebration__bubble';
  bubble.style.setProperty('--bubble-size', `${size}px`);
  bubble.style.setProperty('--bubble-base-x', baseX);
  bubble.style.setProperty('--bubble-base-y', baseY);
  bubble.style.setProperty('--bubble-drift-x', driftX);
  bubble.style.setProperty('--bubble-rise-y', riseY);
  bubble.style.setProperty('--bubble-duration', `${duration}ms`);
  bubble.style.setProperty('--bubble-delay', `${delay}ms`);

  return bubble;
}

function buildFish(index) {
  const fish = document.createElement('img');
  fish.className = 'fish-celebration__fish';
  fish.alt = 'Celebration fish';
  fish.src = FISH_DATA_URL;
  fish.style.left = `${FISH_LEFT_START + Math.round(-18 + Math.random() * FISH_LEFT_VARIANCE)}px`;
  fish.style.top = `${FISH_TOP_START + Math.round(-14 + Math.random() * FISH_TOP_VARIANCE)}px`;
  fish.style.animationDelay = `${index * FISH_STAGGER_MS}ms`;
  return fish;
}

function normalizeAnchor(anchor) {
  if (anchor && typeof anchor.x === 'number' && typeof anchor.y === 'number') {
    return anchor;
  }

  if (lastAnchor) {
    return lastAnchor;
  }

  return {
    x: Math.round(window.innerWidth * 0.5),
    y: Math.round(window.innerHeight * 0.35)
  };
}

function showFishCelebration(anchor) {
  const now = Date.now();
  if (now - lastTriggeredAt < COOLDOWN_MS) {
    return;
  }
  lastTriggeredAt = now;

  ensureStyles();
  const root = ensureRoot();
  const point = normalizeAnchor(anchor);
  lastAnchor = point;

  const cluster = document.createElement('div');
  cluster.className = 'fish-celebration__cluster';
  cluster.style.left = `${point.x}px`;
  cluster.style.top = `${point.y}px`;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < FISH_COUNT; index += 1) {
    fragment.appendChild(buildFish(index));
  }

  for (let index = 0; index < BUBBLE_COUNT; index += 1) {
    fragment.appendChild(buildBubble());
  }

  cluster.appendChild(fragment);
  root.appendChild(cluster);
  window.setTimeout(() => cluster.remove(), TOTAL_EFFECT_MS);
}

aha.on(COMMAND_NAME, () => {
  showFishCelebration();
});

$(document).on('click', '.aha-icon.aha-icon-pending', (event) => {
  showFishCelebration({
    x: event.clientX - 2,
    y: event.clientY - 42
  });
});
