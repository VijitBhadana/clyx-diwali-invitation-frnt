import { seeded } from "@/lib/random";

const PALETTE = ["#ffd60a", "#fff3b0", "#ff8fc4", "#ffb627"];

/** Twinkling four-point stars scattered over the parent. */
export default function Sparkles({ count = 40, seed = 7, className = "" }: { count?: number; seed?: number; className?: string }) {
  const rand = seeded(seed);
  const stars = Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 4 + rand() * 12,
    dur: 1.5 + rand() * 3,
    delay: -rand() * 4,
    color: PALETTE[Math.floor(rand() * PALETTE.length)],
  }));
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {stars.map((s, i) => (
        <svg
          key={i}
          viewBox="-10 -10 20 20"
          width={s.size}
          height={s.size}
          className="twinkle absolute"
          style={{ left: `${s.left}%`, top: `${s.top}%`, "--dur": `${s.dur}s`, "--delay": `${s.delay}s` } as React.CSSProperties}
        >
          <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill={s.color} />
        </svg>
      ))}
    </div>
  );
}
