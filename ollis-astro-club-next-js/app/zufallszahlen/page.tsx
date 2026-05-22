'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import styles from './zufallszahlen.module.css';
import Link from 'next/link';

export default function ZufallszahlenPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const wheelGroupRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const particlesRef = useRef<any[]>([]);
  const particleAnimIdRef = useRef<number | null>(null);

  const CONFIG = {
    minNumber: 1,
    maxNumber: 8,
    spinDuration: 5000,
  };

  const COUNT = CONFIG.maxNumber - CONFIG.minNumber + 1;
  const SEGMENT_ANGLE = 360 / COUNT;

  const SEGMENT_COLORS = [
    '#3a7bd5', '#6c3ec1', '#f0c040', '#00d4ff',
    '#8e44ad', '#2980b9', '#e67e22', '#1abc9c',
    '#d35400', '#c0392b', '#16a085', '#2c3e50',
  ];

  // Initialize audio context
  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  // Initialize stars canvas
  useEffect(() => {
    const canvas = starsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 200 }, () => ({
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
      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Initialize particles canvas
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;

    const resizeParticles = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    return () => {
      window.removeEventListener('resize', resizeParticles);
    };
  }, []);

  // Build wheel SVG
  useEffect(() => {
    if (!wheelGroupRef.current) return;

    const wheelGroup = wheelGroupRef.current;
    wheelGroup.innerHTML = '';

    const CX = 200,
      CY = 200,
      R = 195;

    const polarToCart = (cx: number, cy: number, r: number, deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    for (let i = 0; i < COUNT; i++) {
      const startAngle = i * SEGMENT_ANGLE;
      const endAngle = startAngle + SEGMENT_ANGLE;
      const s = polarToCart(CX, CY, R, startAngle);
      const e = polarToCart(CX, CY, R, endAngle);
      const large = SEGMENT_ANGLE > 180 ? 1 : 0;

      // Segment path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        `M${CX},${CY} L${s.x},${s.y} A${R},${R} 0 ${large} 1 ${e.x},${e.y} Z`
      );
      path.setAttribute('fill', SEGMENT_COLORS[i % SEGMENT_COLORS.length]);
      path.setAttribute('stroke', '#0b0e1a');
      path.setAttribute('stroke-width', '2');
      wheelGroup.appendChild(path);

      // Label
      const midAngle = startAngle + SEGMENT_ANGLE / 2;
      const labelR = R * 0.68;
      const lp = polarToCart(CX, CY, labelR, midAngle);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(lp.x));
      text.setAttribute('y', String(lp.y));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', `${Math.min(36, 200 / COUNT)}px`);
      text.setAttribute('font-weight', '900');
      text.setAttribute('transform', `rotate(${midAngle}, ${lp.x}, ${lp.y})`);
      text.setAttribute('style', 'text-shadow: 0 2px 6px rgba(0,0,0,0.6);');
      text.textContent = String(CONFIG.minNumber + i);
      wheelGroup.appendChild(text);
    }

    // Outer ring gradient - check if defs exists
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
    ].forEach((s) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
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
  }, [COUNT, SEGMENT_ANGLE, SEGMENT_COLORS]);

  const playTick = (freq: number = 1200, dur: number = 0.04) => {
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

  const emitParticles = (cx: number, cy: number) => {
    const colors = ['#f0c040', '#00d4ff', '#6c3ec1', '#3a7bd5', '#fff', '#e67e22'];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
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
    if (!particleAnimIdRef.current) animateParticles();
  };

  const animateParticles = () => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;

    const pCtx = canvas.getContext('2d');
    if (!pCtx) return;

    pCtx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current.forEach((p) => {
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
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
    if (particlesRef.current.length > 0) {
      particleAnimIdRef.current = requestAnimationFrame(animateParticles);
    } else {
      particleAnimIdRef.current = null;
      pCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setResultNumber(null);

    const winnerIndex = Math.floor(Math.random() * COUNT);
    const winnerNumber = CONFIG.minNumber + winnerIndex;

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetSegmentAngle = winnerIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const jitter = (Math.random() - 0.5) * SEGMENT_ANGLE * 0.6;
    const finalAngle =
      wheelRotation + 360 * extraSpins + (360 - targetSegmentAngle) - (wheelRotation % 360) + jitter;

    if (wheelGroupRef.current && svgRef.current) {
      svgRef.current.classList.add(styles.spinning);
      wheelGroupRef.current.style.transition = `transform ${CONFIG.spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
      wheelGroupRef.current.style.transform = `rotate(${finalAngle}deg)`;
    }

    let tickTimeout: any;
    const startTime = Date.now();

    const scheduleTicks = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / CONFIG.spinDuration, 1);
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
      if (svgRef.current) {
        svgRef.current.classList.remove(styles.spinning);
      }

      setWheelRotation(finalAngle);
      setResultNumber(winnerNumber);
      setShowResult(true);
      setIsSpinning(false);

      // Pointer bounce
      if (pointerRef.current) {
        pointerRef.current.classList.add(styles.bounce);
        setTimeout(() => {
          if (pointerRef.current) {
            pointerRef.current.classList.remove(styles.bounce);
          }
        }, 800);
      }

      // Celebrations
      playWin();
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        emitParticles(rect.left + rect.width / 2, rect.top);
        setTimeout(() => emitParticles(rect.left + rect.width * 0.3, rect.top + rect.height * 0.3), 200);
        setTimeout(() => emitParticles(rect.left + rect.width * 0.7, rect.top + rect.height * 0.3), 400);
      }
    }, CONFIG.spinDuration + 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        <canvas ref={starsCanvasRef} id="starsCanvas"></canvas>
      </div>

      <canvas ref={particlesCanvasRef} className={styles.particleCanvas} id="particleCanvas"></canvas>

      <div className={styles.logo}>
        <Link href="/">
        <Image
          src="/logo-astro-club-300x300.png"
          alt="Ollis Astro Club"
          width={90}
          height={90}
        />
        </Link>
      </div>

      <div className={styles.wheelWrapper}>
        <div className={styles.wheelStage}>
          <div ref={pointerRef} className={styles.pointer} id="pointer"></div>
          <svg
            ref={svgRef}
            className={styles.wheelSvg}
            id="wheelSvg"
            viewBox="0 0 400 400"
          >
            <g ref={wheelGroupRef} className={styles.wheelGroup} id="wheelGroup"></g>
          </svg>
          <div className={styles.hub}>
            <Image
              src="/logo-astro-club-300x300.png"
              alt=""
              width={58}
              height={58}
            />
          </div>
        </div>

        <div className={`${styles.resultDisplay} ${showResult ? styles.visible : ''} ${resultNumber !== null ? styles.pop : ''}`} id="resultDisplay">
          {resultNumber !== null ? resultNumber : '?'}
        </div>

        <button
          className={styles.spinBtn}
          id="spinBtn"
          onClick={handleSpin}
          disabled={isSpinning}
        >
          Drehen!
        </button>
      </div>
    </div>
  );
}
