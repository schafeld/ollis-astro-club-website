'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './wheel.module.css';

const SEGMENT_COLORS = [
  '#3a7bd5', '#6c3ec1', '#f0c040', '#00d4ff',
  '#8e44ad', '#2980b9', '#e67e22', '#1abc9c',
  '#d35400', '#c0392b', '#16a085', '#2c3e50',
  '#e74c3c', '#9b59b6', '#f39c12', '#1dd2af',
  '#3498db', '#e91e63', '#00bcd4', '#4caf50',
];

const SPIN_DURATION = 5000;
const MIN_NUMBER = 1;

type Particle = { x: number; y: number; vx: number; vy: number; r: number; color: string; life: number; decay: number };
type ParticleRefs = { particles: React.MutableRefObject<Particle[]>; animId: React.MutableRefObject<number | null>; canvas: React.RefObject<HTMLCanvasElement | null> };

function runParticleAnimation({ particles, animId, canvas }: ParticleRefs) {
  const cvs = canvas.current;
  if (!cvs) return;
  const pCtx = cvs.getContext('2d');
  if (!pCtx) return;

  pCtx.clearRect(0, 0, cvs.width, cvs.height);
  particles.current.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= p.decay;
    if (p.life > 0) {
      pCtx.globalAlpha = p.life;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = p.color;
      pCtx.fill();
    }
  });
  pCtx.globalAlpha = 1;
  particles.current = particles.current.filter((p) => p.life > 0);
  if (particles.current.length > 0) {
    animId.current = requestAnimationFrame(() => runParticleAnimation({ particles, animId, canvas }));
  } else {
    animId.current = null;
    pCtx.clearRect(0, 0, cvs.width, cvs.height);
  }
}

function spawnParticles(cx: number, cy: number, refs: ParticleRefs) {
  const colors = ['#f0c040', '#00d4ff', '#6c3ec1', '#3a7bd5', '#fff', '#e67e22'];
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    refs.particles.current.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: Math.random() * 0.015 + 0.008,
    });
  }
  if (!refs.animId.current) runParticleAnimation(refs);
}

export default function GluecksradPage() {
  const t = useTranslations('fun.wheelOfFortune');

  const [maxNumber, setMaxNumber] = useState(8);
  const [inputValue, setInputValue] = useState('8');
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const wheelGroupRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const particleAnimIdRef = useRef<number | null>(null);

  const count = Math.max(2, Math.min(20, maxNumber));
  const segmentAngle = 360 / count;

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 2 && parsed <= 20) {
      setMaxNumber(parsed);
      setResultNumber(null);
      setShowResult(false);
      setWheelRotation(0);
    }
  };

  const ensureAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  };

  // Stars canvas — contained within the wheel section
  useEffect(() => {
    const canvas = starsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; r: number; a: number; da: number }[] = [];
    let animId: number;

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

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.a += s.da;
        if (s.a > 1 || s.a < 0.15) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${s.a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Particle canvas — fixed overlay, sized to viewport
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Build wheel SVG whenever segment count changes
  useEffect(() => {
    if (!wheelGroupRef.current) return;

    const wheelGroup = wheelGroupRef.current;
    wheelGroup.innerHTML = '';

    const CX = 200, CY = 200, R = 195;

    const polarToCart = (cx: number, cy: number, r: number, deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    for (let i = 0; i < count; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const s = polarToCart(CX, CY, R, startAngle);
      const e = polarToCart(CX, CY, R, endAngle);
      const large = segmentAngle > 180 ? 1 : 0;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${CX},${CY} L${s.x},${s.y} A${R},${R} 0 ${large} 1 ${e.x},${e.y} Z`);
      path.setAttribute('fill', SEGMENT_COLORS[i % SEGMENT_COLORS.length]);
      path.setAttribute('stroke', '#0b0e1a');
      path.setAttribute('stroke-width', '2');
      wheelGroup.appendChild(path);

      const midAngle = startAngle + segmentAngle / 2;
      const lp = polarToCart(CX, CY, R * 0.68, midAngle);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(lp.x));
      text.setAttribute('y', String(lp.y));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', `${Math.min(36, 200 / count)}px`);
      text.setAttribute('font-weight', '900');
      text.setAttribute('transform', `rotate(${midAngle}, ${lp.x}, ${lp.y})`);
      text.setAttribute('style', 'text-shadow: 0 2px 6px rgba(0,0,0,0.6);');
      text.textContent = String(MIN_NUMBER + i);
      wheelGroup.appendChild(text);
    }

    // Gradient ring
    let defs = svgRef.current?.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgRef.current?.prepend(defs);
    }
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'ringGrad');
    [
      { offset: '0%', color: '#f0c040' },
      { offset: '50%', color: '#00d4ff' },
      { offset: '100%', color: '#f0c040' },
    ].forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);

    const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerRing.setAttribute('cx', String(CX));
    outerRing.setAttribute('cy', String(CY));
    outerRing.setAttribute('r', String(R));
    outerRing.setAttribute('fill', 'none');
    outerRing.setAttribute('stroke', 'url(#ringGrad)');
    outerRing.setAttribute('stroke-width', '5');
    wheelGroup.appendChild(outerRing);

    // Reset rotation
    wheelGroup.style.transition = 'none';
    wheelGroup.style.transform = 'rotate(0deg)';
  }, [count, segmentAngle]);

  const playTick = (freq = 1200, dur = 0.04) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  };

  const playWin = () => {
    [0, 100, 200, 350, 500].forEach((d, i) =>
      setTimeout(() => playTick(800 + i * 200, 0.12), d)
    );
  };

  const handleSpin = () => {
    if (isSpinning) return;
    ensureAudioCtx();

    setIsSpinning(true);
    setShowResult(false);
    setResultNumber(null);

    const winnerIndex = Math.floor(Math.random() * count);
    const winnerNumber = MIN_NUMBER + winnerIndex;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetSegmentAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const jitter = (Math.random() - 0.5) * segmentAngle * 0.6;
    const finalAngle =
      wheelRotation + 360 * extraSpins + (360 - targetSegmentAngle) - (wheelRotation % 360) + jitter;

    if (wheelGroupRef.current && svgRef.current) {
      svgRef.current.classList.add(styles.spinning);
      wheelGroupRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
      wheelGroupRef.current.style.transform = `rotate(${finalAngle}deg)`;
    }

    let tickTimeout: ReturnType<typeof setTimeout>;
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

    setTimeout(() => {
      clearTimeout(tickTimeout);
      svgRef.current?.classList.remove(styles.spinning);

      setWheelRotation(finalAngle);
      setResultNumber(winnerNumber);
      setShowResult(true);
      setIsSpinning(false);

      if (pointerRef.current) {
        pointerRef.current.classList.add(styles.bounce);
        setTimeout(() => pointerRef.current?.classList.remove(styles.bounce), 800);
      }

      playWin();
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const pRefs = { particles: particlesRef, animId: particleAnimIdRef, canvas: particlesCanvasRef };
        spawnParticles(rect.left + rect.width / 2, rect.top, pRefs);
        setTimeout(() => spawnParticles(rect.left + rect.width * 0.3, rect.top + rect.height * 0.3, pRefs), 200);
        setTimeout(() => spawnParticles(rect.left + rect.width * 0.7, rect.top + rect.height * 0.3, pRefs), 400);
      }
    }, SPIN_DURATION + 100);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">🎡 {t('title')}</h1>

      <div className="flex items-center gap-3">
        <label
          htmlFor="maxSectors"
          className="font-body text-sm font-semibold opacity-80"
        >
          {t('maxSectors')}
        </label>
        <input
          id="maxSectors"
          type="number"
          min={2}
          max={20}
          value={inputValue}
          onChange={handleMaxChange}
          disabled={isSpinning}
          className="w-20 rounded-lg border-2 border-current bg-transparent px-3 py-1 font-body text-center text-lg font-bold focus:outline-none disabled:opacity-50"
        />
      </div>

      <div className={styles.wheelSection}>
        <canvas ref={starsCanvasRef} className={styles.starsCanvas} />
        <canvas ref={particlesCanvasRef} className={styles.particleCanvas} />

        <div className={styles.wheelWrapper}>
          <div className={styles.wheelStage}>
            <div ref={pointerRef} className={styles.pointer} />
            <svg ref={svgRef} className={styles.wheelSvg} viewBox="0 0 400 400">
              <g ref={wheelGroupRef} className={styles.wheelGroup} />
            </svg>
            <div className={styles.hub}>
              <Image src="/logo-astro-club-300x300.png" alt="" width={58} height={58} />
            </div>
          </div>

          <div
            className={`${styles.resultDisplay} ${showResult ? styles.visible : ''} ${resultNumber !== null ? styles.pop : ''}`}
          >
            {resultNumber !== null ? resultNumber : '?'}
          </div>

          <button
            className={styles.spinBtn}
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {t('spin')}
          </button>
        </div>
      </div>
    </div>
  );
}
