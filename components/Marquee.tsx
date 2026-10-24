"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { MARQUEE_WORDS } from "@/lib/event";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Infinite band whose speed and direction follow the scroll velocity. */
function Band({ baseVelocity, className, words }: { baseVelocity: number; className: string; words: string[] }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden whitespace-nowrap py-3 ${className}`}>
      <motion.div style={{ x, skewX: skew }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {row.map((w, i) => (
              <span key={i} className="mx-5 flex items-center gap-5 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
                {w}
                <span className="text-[0.7em]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Highlights" className="relative z-10 -my-6 overflow-hidden py-10">
      <div className="-rotate-3 scale-105 border-y-2 border-plum bg-rani text-plum">
        <Band baseVelocity={-3} words={MARQUEE_WORDS} className="" />
      </div>
      <div className="-mt-4 rotate-2 scale-105 border-y-2 border-plum bg-haldi text-plum">
        <Band baseVelocity={2.5} words={[...MARQUEE_WORDS].reverse()} className="" />
      </div>
    </section>
  );
}
