<script setup lang="ts">
interface FortuneWheelProps {
  title: string;
  spinLabel: string;
  maxSectorsLabel?: string;
  initialMaxNumber?: number;
  minNumber?: number;
  showInput?: boolean;
  fullPage?: boolean;
  showTopLogo?: boolean;
  homeHref?: string;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  decay: number;
};

const props = withDefaults(defineProps<FortuneWheelProps>(), {
  initialMaxNumber: 8,
  minNumber: 1,
  showInput: true,
  fullPage: false,
  showTopLogo: false,
  homeHref: '/',
  maxSectorsLabel: '',
});

const SEGMENT_COLORS = [
  '#3a7bd5', '#6c3ec1', '#f0c040', '#00d4ff',
  '#8e44ad', '#2980b9', '#e67e22', '#1abc9c',
  '#d35400', '#c0392b', '#16a085', '#2c3e50',
  '#e74c3c', '#9b59b6', '#f39c12', '#1dd2af',
  '#3498db', '#e91e63', '#00bcd4', '#4caf50',
];
const SPIN_DURATION = 5000;

const maxNumber = ref(props.initialMaxNumber);
const inputValue = ref(String(props.initialMaxNumber));
const isSpinning = ref(false);
const resultNumber = ref<number | null>(null);
const showResult = ref(false);
const wheelRotation = ref(0);

const wheelGroupRef = ref<SVGGElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const starsCanvasRef = ref<HTMLCanvasElement | null>(null);
const particlesCanvasRef = ref<HTMLCanvasElement | null>(null);
const pointerRef = ref<HTMLDivElement | null>(null);
const audioCtxRef = ref<AudioContext | null>(null);
const particlesRef = ref<Particle[]>([]);
const particleAnimIdRef = ref<number | null>(null);

const count = computed(() => Math.max(2, Math.min(20, maxNumber.value)));
const segmentAngle = computed(() => 360 / count.value);

let disposeStars = () => undefined;
let disposeParticles = () => undefined;
let stopWatching: (() => void) | undefined;

function handleMaxChange(event: Event) {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  const parsed = Number.parseInt(target.value, 10);

  if (!Number.isNaN(parsed) && parsed >= 2 && parsed <= 20) {
    maxNumber.value = parsed;
    resultNumber.value = null;
    showResult.value = false;
    wheelRotation.value = 0;
  }
}

function ensureAudioCtx() {
  if (!audioCtxRef.value) {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioCtor) {
      audioCtxRef.value = new AudioCtor();
    }
  }
}

function playTick(freq = 1200, dur = 0.04) {
  if (!audioCtxRef.value) return;

  const ctx = audioCtxRef.value;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function playWin() {
  [0, 100, 200, 350, 500].forEach((delay, index) => {
    window.setTimeout(() => playTick(800 + index * 200, 0.12), delay);
  });
}

function runParticleAnimation() {
  const canvas = particlesCanvasRef.value;
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  particlesRef.value.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.08;
    particle.life -= particle.decay;

    if (particle.life > 0) {
      context.globalAlpha = particle.life;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.fill();
    }
  });

  context.globalAlpha = 1;
  particlesRef.value = particlesRef.value.filter((particle) => particle.life > 0);

  if (particlesRef.value.length > 0) {
    particleAnimIdRef.value = requestAnimationFrame(runParticleAnimation);
  } else {
    particleAnimIdRef.value = null;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function spawnParticles(cx: number, cy: number) {
  const colors = ['#f0c040', '#00d4ff', '#6c3ec1', '#3a7bd5', '#fff', '#e67e22'];

  for (let index = 0; index < 80; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    particlesRef.value.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: Math.random() * 0.015 + 0.008,
    });
  }

  if (!particleAnimIdRef.value) {
    runParticleAnimation();
  }
}

function buildWheel() {
  if (!wheelGroupRef.value || !svgRef.value) return;

  const wheelGroup = wheelGroupRef.value;
  wheelGroup.innerHTML = '';

  const centerX = 200;
  const centerY = 200;
  const radius = 195;

  const polarToCart = (cx: number, cy: number, r: number, degrees: number) => {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(radians), y: cy + r * Math.sin(radians) };
  };

  for (let index = 0; index < count.value; index += 1) {
    const startAngle = index * segmentAngle.value;
    const endAngle = startAngle + segmentAngle.value;
    const start = polarToCart(centerX, centerY, radius, startAngle);
    const end = polarToCart(centerX, centerY, radius, endAngle);
    const large = segmentAngle.value > 180 ? 1 : 0;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${centerX},${centerY} L${start.x},${start.y} A${radius},${radius} 0 ${large} 1 ${end.x},${end.y} Z`);
    path.setAttribute('fill', SEGMENT_COLORS[index % SEGMENT_COLORS.length]);
    path.setAttribute('stroke', '#0b0e1a');
    path.setAttribute('stroke-width', '2');
    wheelGroup.appendChild(path);

    const midAngle = startAngle + segmentAngle.value / 2;
    const labelPoint = polarToCart(centerX, centerY, radius * 0.68, midAngle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(labelPoint.x));
    text.setAttribute('y', String(labelPoint.y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', `${Math.min(36, 200 / count.value)}px`);
    text.setAttribute('font-weight', '900');
    text.setAttribute('transform', `rotate(${midAngle}, ${labelPoint.x}, ${labelPoint.y})`);
    text.setAttribute('style', 'text-shadow: 0 2px 6px rgba(0,0,0,0.6);');
    text.textContent = String(props.minNumber + index);
    wheelGroup.appendChild(text);
  }

  let defs = svgRef.value.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgRef.value.prepend(defs);
  }
  defs.innerHTML = '';

  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'ringGrad');
  [
    { offset: '0%', color: '#f0c040' },
    { offset: '50%', color: '#00d4ff' },
    { offset: '100%', color: '#f0c040' },
  ].forEach(({ offset, color }) => {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    gradient.appendChild(stop);
  });
  defs.appendChild(gradient);

  const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  outerRing.setAttribute('cx', String(centerX));
  outerRing.setAttribute('cy', String(centerY));
  outerRing.setAttribute('r', String(radius));
  outerRing.setAttribute('fill', 'none');
  outerRing.setAttribute('stroke', 'url(#ringGrad)');
  outerRing.setAttribute('stroke-width', '5');
  wheelGroup.appendChild(outerRing);

  wheelGroup.style.transition = 'none';
  wheelGroup.style.transform = 'rotate(0deg)';
}

function initStarsCanvas() {
  const canvas = starsCanvasRef.value;
  if (!canvas) {
    return () => undefined;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return () => undefined;
  }

  let stars: Array<{ x: number; y: number; r: number; a: number; da: number }> = [];
  let animationId = 0;

  const resize = () => {
    const parent = canvas.parentElement;
    canvas.width = parent ? parent.clientWidth : 400;
    canvas.height = parent ? parent.clientHeight : 400;
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.015,
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      star.a += star.da;
      if (star.a > 1 || star.a < 0.15) {
        star.da *= -1;
      }
      context.beginPath();
      context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(200,220,255,${star.a})`;
      context.fill();
    });
    animationId = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  draw();

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  };
}

function initParticleCanvas() {
  const canvas = particlesCanvasRef.value;
  if (!canvas) {
    return () => undefined;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener('resize', resize);

  return () => {
    window.removeEventListener('resize', resize);
  };
}

function handleSpin() {
  if (isSpinning.value) return;

  ensureAudioCtx();
  isSpinning.value = true;
  showResult.value = false;
  resultNumber.value = null;

  const winnerIndex = Math.floor(Math.random() * count.value);
  const winnerNumber = props.minNumber + winnerIndex;
  const extraSpins = 5 + Math.floor(Math.random() * 3);
  const targetSegmentAngle = winnerIndex * segmentAngle.value + segmentAngle.value / 2;
  const jitter = (Math.random() - 0.5) * segmentAngle.value * 0.6;
  const finalAngle =
    wheelRotation.value +
    360 * extraSpins +
    (360 - targetSegmentAngle) -
    (wheelRotation.value % 360) +
    jitter;

  if (wheelGroupRef.value && svgRef.value) {
    svgRef.value.classList.add('spinning');
    wheelGroupRef.value.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
    wheelGroupRef.value.style.transform = `rotate(${finalAngle}deg)`;
  }

  let tickTimeout: ReturnType<typeof setTimeout> | undefined;
  const startTime = Date.now();

  const scheduleTicks = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / SPIN_DURATION, 1);
    const tickRate = 50 + progress * 400;
    if (progress < 0.95) {
      playTick(800 + Math.random() * 400, 0.03);
    }
    if (progress < 1) {
      tickTimeout = setTimeout(scheduleTicks, tickRate);
    }
  };

  scheduleTicks();

  window.setTimeout(() => {
    if (tickTimeout) {
      clearTimeout(tickTimeout);
    }

    svgRef.value?.classList.remove('spinning');
    wheelRotation.value = finalAngle;
    resultNumber.value = winnerNumber;
    showResult.value = true;
    isSpinning.value = false;

    if (pointerRef.value) {
      pointerRef.value.classList.add('bounce');
      window.setTimeout(() => pointerRef.value?.classList.remove('bounce'), 800);
    }

    playWin();
    const rect = svgRef.value?.getBoundingClientRect();
    if (rect) {
      spawnParticles(rect.left + rect.width / 2, rect.top);
      window.setTimeout(() => spawnParticles(rect.left + rect.width * 0.3, rect.top + rect.height * 0.3), 200);
      window.setTimeout(() => spawnParticles(rect.left + rect.width * 0.7, rect.top + rect.height * 0.3), 400);
    }
  }, SPIN_DURATION + 100);
}

onMounted(() => {
  disposeStars = initStarsCanvas();
  disposeParticles = initParticleCanvas();
  buildWheel();
  stopWatching = watch([count, segmentAngle], buildWheel);
});

onBeforeUnmount(() => {
  disposeStars();
  disposeParticles();
  stopWatching?.();
  if (particleAnimIdRef.value) {
    cancelAnimationFrame(particleAnimIdRef.value);
  }
});
</script>

<template>
  <div :class="fullPage ? 'fortune-container' : 'space-y-6'">
    <div v-if="fullPage && showTopLogo" class="fortune-logo">
      <NuxtLink :to="homeHref">
        <img src="/logo-astro-club-300x300.png" alt="Ollis Astro Club" width="90" height="90" />
      </NuxtLink>
    </div>

    <template v-if="!fullPage">
      <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">🎡 {{ title }}</h1>

      <div v-if="showInput" class="flex items-center gap-3">
        <label for="maxSectors" class="font-body text-sm font-semibold opacity-80">
          {{ maxSectorsLabel }}
        </label>
        <input
          id="maxSectors"
          type="number"
          min="2"
          max="20"
          :value="inputValue"
          :disabled="isSpinning"
          class="w-20 rounded-lg border-2 border-current bg-transparent px-3 py-1 font-body text-center text-lg font-bold focus:outline-none disabled:opacity-50"
          @input="handleMaxChange"
        />
      </div>
    </template>

    <div class="wheelSection">
      <canvas ref="starsCanvasRef" class="starsCanvas" />
      <canvas ref="particlesCanvasRef" class="particleCanvas" />

      <div class="wheelWrapper">
        <div class="wheelStage">
          <div ref="pointerRef" class="pointer" />
          <svg ref="svgRef" class="wheelSvg" viewBox="0 0 400 400">
            <g ref="wheelGroupRef" class="wheelGroup" />
          </svg>
          <div class="hub">
            <img src="/logo-astro-club-300x300.png" alt="" width="58" height="58" />
          </div>
        </div>

        <div :class="['resultDisplay', { visible: showResult, pop: resultNumber !== null }]">
          {{ resultNumber !== null ? resultNumber : '?' }}
        </div>

        <button class="spinBtn" :disabled="isSpinning" @click="handleSpin">
          {{ spinLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fortune-container {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-dark, #0b0e1a);
  color: var(--text-light, #e8eaf6);
  --bg-dark: #0b0e1a;
  --bg-radial: #141833;
  --accent-blue: #3a7bd5;
  --accent-purple: #6c3ec1;
  --accent-gold: #f0c040;
  --accent-cyan: #00d4ff;
  --text-light: #e8eaf6;
  --glow-color: rgba(0, 212, 255, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.fortune-logo {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  filter: drop-shadow(0 0 18px rgba(0, 212, 255, 0.5));
}

.fortune-logo img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
}

.wheelSection {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 40%, #141833 0%, #0b0e1a 70%);
  padding: 2.5rem 1rem 2rem;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  --accent-blue: #3a7bd5;
  --accent-purple: #6c3ec1;
  --accent-gold: #f0c040;
  --accent-cyan: #00d4ff;
  --glow-color: rgba(0, 212, 255, 0.35);
}

.starsCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particleCanvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.wheelWrapper {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.wheelStage {
  position: relative;
  width: 420px;
  height: 420px;
}

.wheelStage::before {
  content: '';
  position: absolute;
  inset: -18px;
  border-radius: 50%;
  background: conic-gradient(var(--accent-cyan), var(--accent-purple), var(--accent-gold), var(--accent-blue), var(--accent-cyan));
  opacity: 0.35;
  filter: blur(18px);
  animation: ringPulse 3s ease-in-out infinite;
  z-index: 0;
}

@keyframes ringPulse {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.04); }
}

.wheelSvg {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 24px rgba(0, 0, 0, 0.6));
  transition: filter 0.3s;
}

.wheelSvg.spinning {
  filter: drop-shadow(0 0 40px var(--glow-color));
}

.wheelGroup {
  transform-origin: 50% 50%;
}

.pointer {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 36px solid var(--accent-gold);
  filter: drop-shadow(0 4px 12px rgba(240, 192, 64, 0.7));
  transition: transform 0.15s;
}

.pointer.bounce {
  animation: pointerBounce 0.25s ease-in-out 3;
}

@keyframes pointerBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

.hub {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  z-index: 8;
  background: radial-gradient(circle, #1e2244 30%, #0b0e1a 100%);
  border-radius: 50%;
  border: 3px solid var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(240, 192, 64, 0.4);
}

.hub img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
}

.resultDisplay {
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 4px;
  color: #e8eaf6;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 30px var(--accent-cyan), 0 0 60px var(--accent-purple);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.5s, transform 0.5s;
}

.resultDisplay.visible {
  opacity: 1;
  transform: scale(1);
}

.resultDisplay.pop {
  animation: popIn 0.6s cubic-bezier(0.17, 0.89, 0.32, 1.28);
}

@keyframes popIn {
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.spinBtn {
  position: relative;
  padding: 16px 52px;
  font-size: 1.35rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #fff;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
  box-shadow: 0 4px 24px rgba(58, 123, 213, 0.4), 0 0 60px rgba(108, 62, 193, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 10;
  overflow: hidden;
}

.spinBtn::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 62px;
  background: conic-gradient(var(--accent-cyan), var(--accent-purple), var(--accent-gold), var(--accent-cyan));
  z-index: -1;
  animation: borderSpin 3s linear infinite;
}

.spinBtn::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 58px;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
  z-index: -1;
}

@keyframes borderSpin {
  to { transform: rotate(360deg); }
}

.spinBtn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 32px rgba(58, 123, 213, 0.6), 0 0 80px rgba(108, 62, 193, 0.35);
}

.spinBtn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.spinBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .wheelStage {
    width: 300px;
    height: 300px;
  }

  .hub {
    width: 60px;
    height: 60px;
  }

  .hub img {
    width: 42px;
    height: 42px;
  }

  .resultDisplay {
    font-size: 2.8rem;
  }

  .spinBtn {
    padding: 12px 36px;
    font-size: 1.1rem;
  }

  .fortune-logo img {
    width: 64px;
    height: 64px;
  }
}
</style>