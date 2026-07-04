import {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from "react";

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(", ");
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x: number) {
  return x * x * x;
}

interface AnimateOpts {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`,
    );
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "145 71% 48%",
  backgroundColor = "var(--card)",
  borderRadius = 16,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ["#1bd96a", "#34d399", "#00af5c"],
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const st = useRef({ hovered: false, sweeping: false, angle: 45, proximity: 0 });

  const applyVars = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const s = st.current;
    const visible = s.hovered || s.sweeping;
    const colorSensitivity = edgeSensitivity + 20;
    const borderOpacity = visible
      ? Math.max(0, (s.proximity * 100 - colorSensitivity) / (100 - colorSensitivity))
      : 0;
    const glowOpacity = visible
      ? Math.max(0, (s.proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
      : 0;
    el.style.setProperty("--bg-angle", `${s.angle.toFixed(3)}deg`);
    el.style.setProperty("--bg-border-o", borderOpacity.toFixed(4));
    el.style.setProperty("--bg-fill-o", (borderOpacity * fillOpacity).toFixed(4));
    el.style.setProperty("--bg-glow-o", glowOpacity.toFixed(4));
    el.style.setProperty(
      "--bg-trans",
      visible ? "0.25s ease-out" : "0.75s ease-in-out",
    );
  }, [edgeSensitivity, fillOpacity]);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card || frame.current) return;
      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const rect = card.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = clientX - rect.left - cx;
        const dy = clientY - rect.top - cy;
        const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
        const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
        st.current.proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
        if (dx !== 0 || dy !== 0) {
          let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          if (deg < 0) deg += 360;
          st.current.angle = deg;
        }
        applyVars();
      });
    },
    [applyVars],
  );

  const setHover = useCallback(
    (v: boolean) => {
      st.current.hovered = v;
      applyVars();
    },
    [applyVars],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (!animated) return;
    const angleStart = 110;
    const angleEnd = 465;
    st.current.sweeping = true;
    st.current.angle = angleStart;
    applyVars();

    const setProx = (v: number) => {
      st.current.proximity = v / 100;
      applyVars();
    };
    const setAngleP = (v: number) => {
      st.current.angle = (angleEnd - angleStart) * (v / 100) + angleStart;
      applyVars();
    };
    animateValue({ duration: 500, onUpdate: setProx });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: setAngleP });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: setAngleP,
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: setProx,
      onEnd: () => {
        st.current.sweeping = false;
        applyVars();
      },
    });
  }, [animated, applyVars]);

  const staticParts = useMemo(() => {
    const meshGradients = buildMeshGradients(colors);
    const borderBg = meshGradients.map((g) => `${g} border-box`);
    const fillBg = meshGradients.map((g) => `${g} padding-box`);
    const borderMask = `conic-gradient(from var(--bg-angle, 45deg) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`;
    const fillMask = [
      "linear-gradient(to bottom, black, black)",
      "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
      "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
      "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
      "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
      "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
      "conic-gradient(from var(--bg-angle, 45deg) at center, transparent 5%, black 15%, black 85%, transparent 95%)",
    ].join(", ");
    const glowMask = `conic-gradient(from var(--bg-angle, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`;
    return {
      borderBg,
      fillBg,
      borderMask,
      fillMask,
      glowMask,
      glowShadow: buildBoxShadow(glowColor, glowIntensity),
    };
  }, [colors, coneSpread, glowColor, glowIntensity]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={`relative grid isolate border border-border ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: "translate3d(0, 0, 0.01px)",
        boxShadow:
          "rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px",
      }}
    >
      { }
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: "1px solid transparent",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...staticParts.borderBg,
          ].join(", "),
          opacity: "var(--bg-border-o, 0)",
          maskImage: staticParts.borderMask,
          WebkitMaskImage: staticParts.borderMask,
          transition: "opacity var(--bg-trans, 0.75s ease-in-out)",
        }}
      />

      { }
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={
          {
            border: "1px solid transparent",
            background: staticParts.fillBg.join(", "),
            maskImage: staticParts.fillMask,
            WebkitMaskImage: staticParts.fillMask,
            maskComposite: "subtract, add, add, add, add, add",
            WebkitMaskComposite:
              "source-out, source-over, source-over, source-over, source-over, source-over",
            opacity: "var(--bg-fill-o, 0)",
            mixBlendMode: "soft-light",
            transition: "opacity var(--bg-trans, 0.75s ease-in-out)",
          } as CSSProperties
        }
      />

      { }
      <span
        className="absolute pointer-events-none z-[1] rounded-[inherit]"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage: staticParts.glowMask,
            WebkitMaskImage: staticParts.glowMask,
            opacity: "var(--bg-glow-o, 0)",
            mixBlendMode: "plus-lighter",
            transition: "opacity var(--bg-trans, 0.75s ease-in-out)",
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: staticParts.glowShadow,
          }}
        />
      </span>

      <div className="relative z-[1] flex min-w-0 flex-col">{children}</div>
    </div>
  );
}

export default BorderGlow;
