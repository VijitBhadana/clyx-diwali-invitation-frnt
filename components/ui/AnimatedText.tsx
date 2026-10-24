"use client";

import { motion, type Variants } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

const char: Variants = {
  hidden: { y: "110%", rotate: 12, opacity: 0 },
  show: { y: "0%", rotate: 0, opacity: 1, transition: { type: "spring", damping: 14, stiffness: 180 } },
};

type SplitProps = {
  text: string;
  as?: Tag;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  /** Letters jump when hovered */
  bouncy?: boolean;
};

/** Reveals text letter-by-letter (masked per word) when it scrolls into view. */
export function SplitText({ text, as = "span", className = "", charClassName = "", delay = 0, stagger = 0.03, bouncy = false }: SplitProps) {
  const Component = motion[as] as typeof motion.span;
  const words = text.split(" ");
  return (
    <Component
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden whitespace-nowrap pb-[0.12em] pr-[0.04em] align-bottom">
          {[...word].map((c, ci) => (
            <motion.span
              key={ci}
              variants={char}
              whileHover={bouncy ? { y: "-18%", rotate: -6, transition: { type: "spring", stiffness: 400, damping: 8 } } : undefined}
              className={`inline-block ${charClassName}`}
            >
              {c}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
}

/** Words fade + blur in one after another. */
export function BlurWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{ hidden: { opacity: 0, filter: "blur(10px)", y: 12 }, show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.5 } } }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
}

/** Continuous gentle wave through the letters (CSS-driven, no JS per frame). */
export function WavyText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`wavy ${className}`} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden style={{ "--i": i } as React.CSSProperties}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}
