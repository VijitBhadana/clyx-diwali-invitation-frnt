const COLORS = ["#ffd60a", "#ff2e93", "#ff6b1a", "#c084fc", "#ff4d6d"];

// Two swags across a 1200-wide strip; bulbs are sampled along each quadratic curve.
const SWAGS: [number, number][][] = [
  [[0, 8], [300, 120], [600, 14]],
  [[600, 14], [900, 120], [1200, 8]],
];

function point([p0, p1, p2]: [number, number][], t: number) {
  const a = (1 - t) ** 2, b = 2 * (1 - t) * t, c = t ** 2;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}

export default function StringLights({ className = "" }: { className?: string }) {
  const bulbs = SWAGS.flatMap((swag, s) =>
    Array.from({ length: 13 }, (_, i) => {
      const [x, y] = point(swag, (i + 0.5) / 13);
      return { x, y, color: COLORS[(i + s * 2) % COLORS.length], delay: ((i * 7 + s * 3) % 10) / 5 };
    }),
  );
  return (
    <svg viewBox="0 0 1200 140" preserveAspectRatio="xMidYMin slice" className={`pointer-events-none ${className}`} aria-hidden>
      {SWAGS.map(([p0, p1, p2], i) => (
        <path key={i} d={`M${p0} Q${p1} ${p2}`} stroke="#3b1d4a" strokeWidth="2" fill="none" />
      ))}
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          <line x1="0" y1="0" x2="0" y2="6" stroke="#3b1d4a" strokeWidth="2" />
          <circle cy="13" r="12" fill={b.color} opacity="0.25" className="twinkle" style={{ "--delay": `${b.delay}s`, "--dur": "1.6s" } as React.CSSProperties} />
          <ellipse cy="12" rx="4.5" ry="6.5" fill={b.color} className="twinkle" style={{ "--delay": `${b.delay}s`, "--dur": "1.6s" } as React.CSSProperties} />
        </g>
      ))}
    </svg>
  );
}
