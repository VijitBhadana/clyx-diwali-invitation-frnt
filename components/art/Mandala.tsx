type Props = { className?: string; strokeWidth?: number };

const ring = (count: number) => Array.from({ length: count }, (_, i) => (360 / count) * i);

/** Line-art mandala drawn in currentColor, so colour it with a text-* class. */
export default function Mandala({ className = "", strokeWidth = 0.8 }: Props) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden>
      <circle r="98" opacity="0.5" />
      {ring(48).map((a) => (
        <circle key={`d${a}`} cx="0" cy="-92" r="1.6" fill="currentColor" stroke="none" transform={`rotate(${a})`} />
      ))}
      {ring(16).map((a) => (
        <g key={`p${a}`} transform={`rotate(${a})`}>
          <path d="M0 -88 Q13 -70 0 -52 Q-13 -70 0 -88Z" />
          <path d="M0 -80 Q6 -70 0 -60 Q-6 -70 0 -80Z" />
        </g>
      ))}
      <circle r="52" />
      {ring(12).map((a) => (
        <g key={`q${a}`} transform={`rotate(${a + 15})`}>
          <path d="M0 -50 Q17 -36 0 -20 Q-17 -36 0 -50Z" />
          <circle cx="0" cy="-56" r="2.4" />
        </g>
      ))}
      <circle r="20" />
      {ring(8).map((a) => (
        <path key={`r${a}`} d="M0 -19 Q7 -10 0 -3 Q-7 -10 0 -19Z" transform={`rotate(${a})`} />
      ))}
      <circle r="4" fill="currentColor" />
      {ring(32).map((a) => (
        <line key={`l${a}`} x1="0" y1="-22" x2="0" y2="-28" transform={`rotate(${a})`} opacity="0.7" />
      ))}
    </svg>
  );
}
