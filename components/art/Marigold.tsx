type Tone = "orange" | "yellow";

const TONES: Record<Tone, [string, string, string, string]> = {
  orange: ["#c2410c", "#ea580c", "#fb923c", "#9a3412"],
  yellow: ["#e8a000", "#ffb627", "#ffd60a", "#b45309"],
};

const RINGS = [
  { r: 30, n: 18, rx: 9, ry: 15 },
  { r: 20, n: 14, rx: 8, ry: 12 },
  { r: 10, n: 10, rx: 6, ry: 9 },
];

/** Genda phool — layered petal rings, like the marigold border in the reference invite. */
export function Marigold({ size = 60, tone = "orange", className = "", style }: { size?: number; tone?: Tone; className?: string; style?: React.CSSProperties }) {
  const colors = TONES[tone];
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} style={style} aria-hidden>
      {RINGS.map((ring, ri) =>
        Array.from({ length: ring.n }, (_, i) => {
          const angle = (360 / ring.n) * i + ri * 9;
          return (
            <ellipse
              key={`${ri}-${i}`}
              cx="0"
              cy={-ring.r}
              rx={ring.rx}
              ry={ring.ry}
              transform={`rotate(${angle})`}
              fill={colors[ri]}
              stroke={colors[3]}
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
          );
        }),
      )}
      <circle r="6" fill={colors[3]} />
      <circle r="3" fill={colors[0]} />
    </svg>
  );
}

export function Leaf({ size = 40, rotate = 0, className = "", style }: { size?: number; rotate?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-25 -75 50 80" width={size * 0.62} height={size} className={className} style={{ rotate: `${rotate}deg`, ...style }} aria-hidden>
      <path d="M0 0 Q22 -32 0 -72 Q-22 -32 0 0Z" fill="#2f7d32" />
      <path d="M0 -2 L0 -68" stroke="#1b4d1e" strokeWidth="1.5" />
      {[-18, -32, -46].map((y) => (
        <g key={y} stroke="#1b4d1e" strokeWidth="1" fill="none">
          <path d={`M0 ${y} Q8 ${y - 6} 12 ${y - 12}`} />
          <path d={`M0 ${y} Q-8 ${y - 6} -12 ${y - 12}`} />
        </g>
      ))}
    </svg>
  );
}
