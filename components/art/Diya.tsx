import { useId } from "react";

type Props = { size?: number; className?: string; delay?: number };

export default function Diya({ size = 80, className = "", delay = 0 }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden>
      <div className="diya-glow" style={{ animationDelay: `${delay}s` }} />
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          <linearGradient id={`clay${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f97316" />
            <stop offset="0.55" stopColor="#c2410c" />
            <stop offset="1" stopColor="#7c2d12" />
          </linearGradient>
          <radialGradient id={`flame${id}`} cx="0.5" cy="0.75" r="0.7">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#fff3b0" />
            <stop offset="0.7" stopColor="#ffb627" />
            <stop offset="1" stopColor="#ff6b1a" />
          </radialGradient>
        </defs>

        <g className="flame" style={{ animationDelay: `${delay}s` }}>
          <path d="M50 16 Q64 38 57 52 Q50 59 43 52 Q36 38 50 16Z" fill={`url(#flame${id})`} />
          <path d="M50 32 Q56 43 53 50 Q50 53 47 50 Q44 43 50 32Z" fill="#fffdf0" opacity="0.9" />
        </g>
        <line x1="50" y1="60" x2="50" y2="53" stroke="#3b1d0a" strokeWidth="2" strokeLinecap="round" />

        <path d="M8 60 Q50 54 92 60 Q86 90 50 93 Q14 90 8 60Z" fill={`url(#clay${id})`} />
        <ellipse cx="50" cy="60" rx="42" ry="7" fill="#9a3412" />
        <ellipse cx="50" cy="60" rx="34" ry="4.5" fill="#f59e0b" opacity="0.85" />
        {/* painted dots on the bowl */}
        {[22, 34, 50, 66, 78].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 76 : 73} r="3" fill={i % 2 ? "#ff2e93" : "#ffd60a"} />
        ))}
        <path d="M18 70 Q50 80 82 70" stroke="#ffd60a" strokeWidth="1.6" fill="none" opacity="0.8" />
        <path d="M24 84 Q50 90 76 84" stroke="#ff8fc4" strokeWidth="1.4" fill="none" opacity="0.7" />
      </svg>
    </div>
  );
}
