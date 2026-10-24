"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { EVENT } from "@/lib/event";
import Diya from "./art/Diya";
import { LanternField } from "./art/Lanterns";
import Sparkles from "./art/Sparkles";
import StringLights from "./art/StringLights";
import Countdown from "./Countdown";
import { INTRO_DELAY } from "./Preloader";
import { scrollToId } from "./SmoothScroll";
import Sticker from "./ui/Sticker";

const TITLE = [
  { c: "D", color: "#ff2e93", r: -14 },
  { c: "I", color: "#ffb627", r: 10 },
  { c: "W", color: "#ffd60a", r: -8 },
  { c: "A", color: "#ff8fc4", r: 16 },
  { c: "L", color: "#ff6b1a", r: -10 },
  { c: "I", color: "#fff6e5", r: 12 },
];

const FOREGROUND_DIYAS = [54, 72, 96, 120, 96, 72, 54];

function useLayer(source: MotionValue<number>, amount: number) {
  return useTransform(source, (v) => v * amount);
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Scroll parallax: far layers lag behind, the foreground rushes past
  const yFar = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yNear = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const xFar = useLayer(smx, -15);
  const xMid = useLayer(smx, -40);
  const xNear = useLayer(smx, 30);
  const yMouseFar = useLayer(smy, -10);
  const yMouseMid = useLayer(smy, -25);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#8b2fc9_0%,#5b1a8a_28%,#2d0a45_58%,#1a0526_100%)]"
    >
      <motion.div style={{ y: yFar }} className="absolute inset-0">
        <Sparkles count={70} seed={4} />
      </motion.div>

      <motion.div style={{ y: yFar, x: xFar }} className="absolute inset-0">
        <motion.div style={{ y: yMouseFar }} className="absolute inset-0">
          <LanternField depth={0} count={12} seed={3} />
        </motion.div>
      </motion.div>
      <motion.div style={{ y: yMid, x: xMid }} className="absolute inset-0">
        <motion.div style={{ y: yMouseMid }} className="absolute inset-0">
          <LanternField depth={1} count={6} seed={21} />
        </motion.div>
      </motion.div>

      <StringLights className="absolute inset-x-0 top-0 h-28 w-full sm:h-40" />

      <motion.div style={{ y: yTitle, opacity: titleOpacity, scale: titleScale }} className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pb-44 pt-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY, duration: 0.6 }}
          className="glass rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-haldi"
        >
          you&apos;re invited ✦ {EVENT.shortDate}
        </motion.span>

        <motion.p
          // Negative vertical inset so the Devanagari matras above the line aren't clipped
          initial={{ opacity: 0, clipPath: "inset(-40% 100% -40% 0%)" }}
          animate={{ opacity: 1, clipPath: "inset(-40% 0% -40% 0%)" }}
          transition={{ delay: INTRO_DELAY + 0.2, duration: 1.2, ease: "easeOut" }}
          className="text-shimmer-gold mt-6 font-festive text-4xl sm:text-6xl"
          lang="hi"
        >
          शुभ दीपावली
        </motion.p>

        <h1 aria-label="Diwali" className="mt-2 flex font-display text-[24vw] font-extrabold leading-[0.82] tracking-[-0.06em] sm:text-[17vw] lg:text-[14rem]">
          {TITLE.map((l, i) => (
            <motion.span
              key={i}
              aria-hidden
              initial={{ y: "120%", rotate: l.r * 3, opacity: 0 }}
              animate={{ y: "0%", rotate: 0, opacity: 1 }}
              whileHover={{ y: "-12%", rotate: l.r, transition: { type: "spring", stiffness: 500, damping: 9 } }}
              transition={{ delay: INTRO_DELAY + 0.35 + i * 0.08, type: "spring", stiffness: 160, damping: 13 }}
              className="inline-block cursor-default"
              style={{ color: l.color, textShadow: "0 0.05em 0 #1a0526, 0 0 0.35em rgba(255,46,147,0.45)" }}
            >
              {l.c}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.9, duration: 0.7 }}
          className="mt-1 font-serif text-3xl italic text-cream sm:text-5xl"
        >
          day out — <span className="text-shimmer-funk not-italic font-display font-extrabold tracking-tight">all day, all night.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO_DELAY + 1.1 }}
          className="mt-4 max-w-md text-base text-cream/75"
        >
          {EVENT.host} is hosting an all-night Diwali somewhere in Delhi (exact spot dropping soon). Rangoli at sunset, phuljhadis at night, mithai in between.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: INTRO_DELAY + 1.25 }} className="mt-8">
          <Countdown />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: INTRO_DELAY + 1.4 }} className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.06, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToId("rsvp")}
            className="rounded-full border-2 border-plum bg-haldi px-7 py-3 font-display text-lg font-extrabold text-plum shadow-[5px_5px_0_#ff2e93]"
          >
            RSVP rn →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToId("fits")}
            className="glass rounded-full px-7 py-3 font-display text-lg font-bold text-cream"
          >
            pick ur fit ✦
          </motion.button>
        </motion.div>
      </motion.div>

      <Sticker dragArea={ref} rotate={-10} className="left-[4%] top-[20%] hidden bg-haldi md:block">no beige allowed 🚫</Sticker>
      <Sticker dragArea={ref} rotate={8} className="right-[5%] top-[26%] hidden bg-blush md:block">mithai unlimited 🍬</Sticker>
      <Sticker dragArea={ref} rotate={-4} className="bottom-[30%] right-[8%] hidden bg-kesari lg:block">drag me bestie ✦</Sticker>
      <Sticker dragArea={ref} rotate={6} className="bottom-[34%] left-[7%] hidden bg-genda lg:block">1–2 nov · all night</Sticker>

      <motion.div style={{ y: yNear, x: xNear }} className="pointer-events-none absolute inset-x-0 -bottom-4 z-20 flex items-end justify-center gap-2 sm:gap-6">
        {FOREGROUND_DIYAS.map((size, i) => (
          <motion.div
            key={i}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: INTRO_DELAY + 0.5 + Math.abs(i - 3) * 0.12, type: "spring", stiffness: 120, damping: 14 }}
            className={i === 0 || i === 6 ? "hidden sm:block" : ""}
          >
            <Diya size={size} delay={i * 0.3} />
          </motion.div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-plum to-transparent" />
    </section>
  );
}
