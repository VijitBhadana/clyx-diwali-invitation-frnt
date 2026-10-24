import { useId } from "react";
import { seeded } from "@/lib/random";

export function Lantern({ size = 60, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 60 80" width={size} height={(size * 80) / 60} className={`lantern ${className}`} style={style} aria-hidden>
      <defs>
        <radialGradient id={`lg${id}`} cx="0.5" cy="0.7" r="0.75">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset="0.35" stopColor="#ffd36b" />
          <stop offset="0.75" stopColor="#ff8a1f" />
          <stop offset="1" stopColor="#d9480f" />
        </radialGradient>
      </defs>
      <path d="M12 6 Q30 0 48 6 L55 64 Q30 73 5 64 Z" fill={`url(#lg${id})`} />
      <path d="M22 4 L18 66 M38 4 L42 66" stroke="#c2410c" strokeOpacity="0.25" strokeWidth="1.2" fill="none" />
      <ellipse cx="30" cy="66" rx="25" ry="5" fill="#ff6b1a" opacity="0.7" />
      <ellipse cx="30" cy="68" rx="6" ry="3" fill="#fff6c8" />
    </svg>
  );
}

type Depth = 0 | 1 | 2;

const DEPTH = {
  0: { min: 18, max: 34, opacity: 0.55, blur: 1.5 },
  1: { min: 34, max: 56, opacity: 0.85, blur: 0 },
  2: { min: 60, max: 96, opacity: 1, blur: 0 },
} as const;

/** A field of floating sky lanterns at one parallax depth. */
export function LanternField({ count = 8, seed = 1, depth = 1 }: { count?: number; seed?: number; depth?: Depth }) {
  const rand = seeded(seed);
  const d = DEPTH[depth];
  const lanterns = Array.from({ length: count }, (_, i) => ({
    left: (i / count) * 100 + rand() * (100 / count) * 0.8,
    top: rand() * 85,
    size: d.min + rand() * (d.max - d.min),
    dur: 5 + rand() * 5,
    delay: -rand() * 6,
  }));
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {lanterns.map((l, i) => (
        <div key={i} className="absolute" style={{ left: `${l.left}%`, top: `${l.top}%`, opacity: d.opacity, filter: d.blur ? `blur(${d.blur}px)` : undefined }}>
          <Lantern size={l.size} style={{ "--dur": `${l.dur}s`, "--delay": `${l.delay}s` } as React.CSSProperties} />
        </div>
      ))}
    </div>
  );
}
