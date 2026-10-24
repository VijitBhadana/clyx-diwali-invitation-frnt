"use client";

import { motion } from "framer-motion";
import { SplitText } from "./AnimatedText";

type Props = {
  kicker: string;
  title: string;
  accent?: string;
  className?: string;
  align?: "left" | "center";
};

/** Section heading: small kicker pill, letter-reveal display title, italic serif accent. */
export default function SectionTitle({ kicker, title, accent, className = "", align = "center" }: Props) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <motion.span
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        className="inline-block rounded-full border border-current/30 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em]"
      >
        ✦ {kicker}
      </motion.span>
      <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.9] tracking-tighter sm:text-7xl">
        <SplitText text={title} bouncy />
        {accent && (
          <>
            <br />
            <SplitText text={accent} delay={0.25} className="font-serif text-[1.05em] font-normal italic tracking-normal" />
          </>
        )}
      </h2>
    </div>
  );
}
