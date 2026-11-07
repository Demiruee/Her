// ── Guard & state ──────────────────────────────────────────
let isTransitioning = false;

// ── Grab elements ──────────────────────────────────────────
const yesBtn        = document.getElementById('yes-btn');
const noBtn         = document.getElementById('no-btn');
const scene1        = document.getElementById('scene-1');
const scene2        = document.getElementById('scene-2');
const scene3        = document.getElementById('scene-3');
const scrollWrapper = document.getElementById('scrollWrapper');
const scrollStage   = document.getElementById('scrollStage');
const touchHint     = document.getElementById('touchHint');
const letterContainer = document.getElementById('letterContainer');
const nextBtn       = document.getElementById('nextBtn');

// ── Helper to switch between scenes ────────────────────────
function switchScene(from, to, onComplete) {
  if (isTransitioning) return;
  if (!from || !to) return;
  isTransitioning = true;

  from.classList.add('scene-exit');

  setTimeout(() => {
    from.classList.remove('active', 'scene-exit');
    from.classList.add('hidden');

    to.classList.remove('hidden');
    to.classList.add('active', 'scene-enter');

    if (onComplete) onComplete();

    setTimeout(() => {
      to.classList.remove('scene-enter');
      isTransitioning = false;
    }, 700);
  }, 450);
}

// ── Reset Scene 2 scroll state ─────────────────────────────
function resetScene2() {
  if (scrollStage) scrollStage.classList.remove('hidden');
  if (touchHint) touchHint.classList.remove('fade-out');
  if (scrollWrapper) scrollWrapper.classList.remove('opening');
  if (letterContainer) {
    letterContainer.classList.add('hidden');
    const letterBody = letterContainer.querySelector('.letter-body');
    if (letterBody) letterBody.scrollTop = 0;
  }
}

// ── NO button: shrink → disappear ──────────────────────────
if (noBtn) {
  noBtn.addEventListener('click', () => {
    noBtn.classList.add('shrinking');
    setTimeout(() => {
      if (yesBtn) yesBtn.classList.add('yes-grow');
    }, 350);
  });
}

// ── YES button: Scene 1 → Scene 2 ──────────────────────────
if (yesBtn) {
  yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isTransitioning) return;

    resetScene2();
    switchScene(scene1, scene2, () => {
      launchConfetti();
    });
  });
}

// ── Scroll tap: unroll → reveal letter ─────────────────────
function openScroll() {
  if (!touchHint || !scrollWrapper || !letterContainer) return;
  if (scrollWrapper.classList.contains('opening')) return;

  touchHint.classList.add('fade-out');
  scrollWrapper.classList.add('opening');

  setTimeout(() => {
    if (scrollStage) scrollStage.classList.add('hidden');
    letterContainer.classList.remove('hidden');
  }, 600);
}

if (scrollWrapper) {
  scrollWrapper.addEventListener('click', openScroll);
  scrollWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openScroll();
    }
  });
}

// ── Next button: Scene 2 → Scene 3 ─────────────────────────
if (nextBtn) {
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isTransitioning) return;
    switchScene(scene2, scene3);
  });
}

// ── Confetti ───────────────────────────────────────────────
function launchConfetti() {
  const colors  = ['#cc44ff', '#ff88ff', '#ffffff', '#ffbbff', '#aa00ff', '#ffccff'];
  const symbols = ['💜', '✦', '✧', '★', '·'];
  const count   = 55;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'confetti-piece';

      const useEmoji = Math.random() < 0.35;
      el.textContent = useEmoji ? '💜' : symbols[Math.floor(Math.random() * 3)];
      if (!useEmoji) el.style.color = colors[Math.floor(Math.random() * colors.length)];

      const startX = Math.random() * 100;
      const drift  = (Math.random() - 0.5) * 200;
      const rot    = (Math.random() - 0.5) * 720;
      const size   = 0.8 + Math.random() * 1.3;
      const dur    = 1.8 + Math.random() * 1.8;

      el.style.cssText += `
        left: ${startX}vw;
        font-size: ${size}rem;
        --drift: ${drift}px;
        --rot: ${rot}deg;
        animation-duration: ${dur}s;
      `;

      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 100);
    }, i * 25);
  }
}
