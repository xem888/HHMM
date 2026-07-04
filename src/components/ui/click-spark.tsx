import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

interface Spark {
  x: number;
  y: number;
  angle: number;
  start: number;
}

export function ClickSpark({
  children,
  color = "#ffffff",
  count = 8,
  radius = 16,
  lineLength = 8,
  duration = 450,
  className = "",
}: {
  children: ReactNode;
  color?: string;
  count?: number;
  radius?: number;
  lineLength?: number;
  duration?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const raf = useRef(0);
  const startLoop = useRef<() => void>(() => {});
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let running = true;
    let active = false;
    const easeOut = (t: number) => t * (2 - t);
    const tick = (now: number) => {
      if (!running) return;
      const dpr = window.devicePixelRatio || 1;
      const wrap = canvas.parentElement;
      if (wrap && canvas.width !== Math.round(wrap.clientWidth * dpr)) {
        canvas.width = wrap.clientWidth * dpr;
        canvas.height = wrap.clientHeight * dpr;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      sparks.current = sparks.current.filter((s) => {
        const elapsed = now - s.start;
        if (elapsed >= duration) return false;
        const p = easeOut(elapsed / duration);
        const dist = p * radius;
        const len = lineLength * (1 - p);
        const cos = Math.cos(s.angle);
        const sin = Math.sin(s.angle);
        ctx.globalAlpha = 1 - p;
        ctx.beginPath();
        ctx.moveTo(s.x + cos * dist, s.y + sin * dist);
        ctx.lineTo(s.x + cos * (dist + len), s.y + sin * (dist + len));
        ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
      if (sparks.current.length === 0) {
        active = false;
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    startLoop.current = () => {
      if (active || !running) return;
      active = true;
      raf.current = requestAnimationFrame(tick);
    };
    return () => {
      running = false;
      startLoop.current = () => {};
      cancelAnimationFrame(raf.current);
    };
  }, [color, radius, lineLength, duration]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        sparks.current.push({
          x,
          y,
          angle: (2 * Math.PI * i) / count,
          start: now,
        });
      }
      startLoop.current();
    },
    [count, reduce],
  );

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      className={`relative ${className}`}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20"
      />
    </div>
  );
}
