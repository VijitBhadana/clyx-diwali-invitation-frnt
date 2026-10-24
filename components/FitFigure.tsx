import { useId } from "react";
import type { OutfitType } from "@/lib/api";

type Props = { outfit: OutfitType; color: string; accent: string; className?: string };

const SKIN = "#b9764a";
const HAIR = "#2b1608";
const PANTS = "#f6ecd8";

const FLOWY: OutfitType[] = ["lehenga", "saree", "anarkali", "sharara"];

/** Stylised avatar wearing the chosen outfit — every garment is recoloured live. */
export default function FitFigure({ outfit, color, accent, className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pattern = `url(#zari${id})`;
  const flowy = FLOWY.includes(outfit);
  const garment = { fill: color, stroke: accent, strokeWidth: 2.5, style: { transition: "fill .4s, stroke .4s" } };
  const embroidery = { fill: pattern, opacity: 0.55, pointerEvents: "none" as const };

  return (
    <svg viewBox="0 0 200 320" className={className} aria-hidden>
      <defs>
        <pattern id={`zari${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.6" fill={accent} />
          <circle cx="0" cy="0" r="0.9" fill={accent} />
          <circle cx="14" cy="14" r="0.9" fill={accent} />
        </pattern>
      </defs>

      {/* arms (sleeves) */}
      <g stroke={color} strokeWidth="12" strokeLinecap="round" style={{ transition: "stroke .4s" }}>
        <line x1="74" y1="88" x2="58" y2="178" />
        <line x1="126" y1="88" x2="142" y2="178" />
      </g>
      <circle cx="57" cy="184" r="6.5" fill={SKIN} />
      <circle cx="143" cy="184" r="6.5" fill={SKIN} />

      {/* head */}
      <rect x="93" y="64" width="14" height="16" rx="5" fill={SKIN} />
      <circle cx="100" cy="48" r="21" fill={SKIN} />
      <path d="M79 48 Q78 24 100 23 Q122 24 121 48 Q117 34 100 34 Q83 34 79 48Z" fill={HAIR} />
      {flowy ? (
        <>
          <circle cx="100" cy="22" r="9" fill={HAIR} />
          <circle cx="100" cy="41" r="1.8" fill="#e3173e" />
          <circle cx="78" cy="54" r="2.5" fill={accent} />
          <circle cx="122" cy="54" r="2.5" fill={accent} />
        </>
      ) : (
        <path d="M86 58 Q100 66 114 58" stroke={HAIR} strokeWidth="2" fill="none" opacity="0.5" />
      )}
      <circle cx="92" cy="49" r="1.8" fill={HAIR} />
      <circle cx="108" cy="49" r="1.8" fill={HAIR} />
      <path d="M94 57 Q100 61 106 57" stroke={HAIR} strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {outfit === "lehenga" && (
        <>
          <path d="M80 148 L120 148 Q150 230 174 300 Q100 314 26 300 Q50 230 80 148Z" {...garment} />
          <path d="M80 148 L120 148 Q150 230 174 300 Q100 314 26 300 Q50 230 80 148Z" {...embroidery} />
          <path d="M30 292 Q100 306 170 292" stroke={accent} strokeWidth="5" fill="none" />
          <path d="M72 84 Q100 76 128 84 L122 146 L78 146Z" {...garment} />
          <path d="M124 86 Q160 150 150 250 L140 246 Q148 160 116 92Z" fill={accent} opacity="0.55" />
        </>
      )}

      {outfit === "saree" && (
        <>
          <path d="M80 146 L120 146 Q134 230 142 302 Q100 312 58 302 Q66 230 80 146Z" {...garment} />
          <path d="M80 146 L120 146 Q134 230 142 302 Q100 312 58 302 Q66 230 80 146Z" {...embroidery} />
          <path d="M74 84 Q100 78 126 84 L120 140 L80 140Z" fill={accent} opacity="0.9" />
          <path d="M74 86 Q102 120 126 150 L136 146 Q110 112 86 80Z" {...garment} />
          <path d="M128 84 Q158 160 150 236 L138 230 Q144 160 120 94Z" {...garment} />
          <path d="M62 290 Q100 302 140 290" stroke={accent} strokeWidth="4" fill="none" />
        </>
      )}

      {outfit === "anarkali" && (
        <>
          <path d="M72 84 Q100 76 128 84 L120 128 L80 128Z" {...garment} />
          <path d="M80 126 L120 126 Q162 220 170 298 Q100 312 30 298 Q38 220 80 126Z" {...garment} />
          <path d="M80 126 L120 126 Q162 220 170 298 Q100 312 30 298 Q38 220 80 126Z" {...embroidery} />
          <path d="M82 128 Q100 136 118 128" stroke={accent} strokeWidth="4" fill="none" />
          {[60, 80, 100, 120, 140].map((x) => (
            <line key={x} x1="100" y1="132" x2={x + (x - 100) * 0.55} y2="298" stroke={accent} strokeWidth="1" opacity="0.5" />
          ))}
        </>
      )}

      {outfit === "sharara" && (
        <>
          <path d="M76 214 L100 214 L97 302 Q72 308 50 300Z" fill={accent} opacity="0.85" />
          <path d="M100 214 L124 214 L150 300 Q128 308 103 302Z" fill={accent} opacity="0.85" />
          <path d="M72 84 Q100 76 128 84 L138 222 Q100 230 62 222Z" {...garment} />
          <path d="M72 84 Q100 76 128 84 L138 222 Q100 230 62 222Z" {...embroidery} />
          <path d="M64 216 Q100 226 136 216" stroke={accent} strokeWidth="4" fill="none" />
        </>
      )}

      {(outfit === "kurta" || outfit === "nehru-jacket") && (
        <>
          <path d="M82 226 L98 226 L96 304 L84 304Z" fill={PANTS} />
          <path d="M102 226 L118 226 L116 304 L104 304Z" fill={PANTS} />
          <path d="M72 84 Q100 76 128 84 L134 232 Q100 238 66 232Z" {...garment} />
          <path d="M100 82 L100 128" stroke={accent} strokeWidth="2" />
          {[94, 106, 118].map((y) => (
            <circle key={y} cx="100" cy={y} r="2" fill={accent} />
          ))}
          <path d="M68 226 Q100 234 132 226" stroke={accent} strokeWidth="3" fill="none" />
        </>
      )}

      {outfit === "nehru-jacket" && (
        <>
          <path d="M74 86 L98 94 L98 176 L74 172Z" fill={accent} stroke={color} strokeWidth="1.5" />
          <path d="M126 86 L102 94 L102 176 L126 172Z" fill={accent} stroke={color} strokeWidth="1.5" />
          <rect x="80" y="132" width="10" height="4" rx="1" fill={color} opacity="0.8" />
        </>
      )}

      {outfit === "sherwani" && (
        <>
          <path d="M82 246 L98 246 L96 304 L84 304Z" fill={PANTS} />
          <path d="M102 246 L118 246 L116 304 L104 304Z" fill={PANTS} />
          <path d="M70 84 Q100 76 130 84 L138 252 Q100 258 62 252Z" {...garment} />
          <path d="M70 84 Q100 76 130 84 L138 252 Q100 258 62 252Z" {...embroidery} />
          {[96, 114, 132, 150, 168, 186].map((y) => (
            <circle key={y} cx="100" cy={y} r="2.6" fill={accent} />
          ))}
          <path d="M78 84 L90 84 L96 250 L84 254Z" fill={accent} opacity="0.75" />
          <path d="M84 80 Q100 88 116 80 L116 74 Q100 80 84 74Z" fill={accent} />
        </>
      )}

      {outfit === "indo-western" && (
        <>
          <path d="M78 204 L122 204 Q130 258 120 304 L104 304 L100 252 L96 304 L80 304 Q70 258 78 204Z" fill={accent} opacity="0.9" />
          <path d="M72 84 Q100 76 128 84 L142 252 L60 212Z" {...garment} />
          <path d="M72 84 Q100 76 128 84 L142 252 L60 212Z" {...embroidery} />
          <path d="M60 212 L142 252" stroke={accent} strokeWidth="4" />
          <path d="M100 80 L112 140" stroke={accent} strokeWidth="2.5" />
        </>
      )}

      {/* juttis */}
      <ellipse cx="88" cy="306" rx="11" ry="5" fill={accent} />
      <ellipse cx="112" cy="306" rx="11" ry="5" fill={accent} />
    </svg>
  );
}
