"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SCHEDULE } from "@/lib/event";
import Sparkles from "./art/Sparkles";
import { SplitText } from "./ui/AnimatedText";

const CARD_COLORS = ["bg-haldi", "bg-blush", "bg-genda", "bg-cream", "bg-rani", "bg-kesari", "bg-cream", "bg-haldi", "bg-blush", "bg-rani"];

/**
 * Pinned section that scrolls sideways through the schedule.
 * The sky behind it moves from sunrise to midnight as you go.
 */
export default function DayPlan() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      setViewport(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 });

  const x = useTransform(progress, [0, 1], [0, -distance]);
  const sky = useTransform(
    progress,
    [0, 0.3, 0.55, 0.75, 1],
    [
      "linear-gradient(180deg,#ff9a3c 0%,#ffd60a 100%)",
      "linear-gradient(180deg,#ff6b1a 0%,#ffb627 100%)",
      "linear-gradient(180deg,#e3173e 0%,#ff2e93 100%)",
      "linear-gradient(180deg,#5b1a8a 0%,#c0267a 100%)",
      "linear-gradient(180deg,#12031c 0%,#3b0d5c 100%)",
    ],
  );
  const orbX = useTransform(progress, [0, 1], ["6vw", "86vw"]);
  const orbY = useTransform(progress, [0, 0.5, 1], ["34vh", "10vh", "30vh"]);
  const orbColor = useTransform(progress, [0, 0.55, 0.75, 1], ["#fff3b0", "#ffb627", "#ffd6e8", "#fff6e5"]);
  const orbGlow = useTransform(progress, [0, 0.6, 1], ["0 0 80px 30px rgba(255,214,10,.7)", "0 0 90px 30px rgba(255,107,26,.6)", "0 0 60px 16px rgba(255,246,229,.35)"]);
  const starsOpacity = useTransform(progress, [0.6, 0.85], [0, 1]);
  const lineScale = useTransform(progress, [0, 1], [0, 1]);
  const titleColor = useTransform(progress, [0, 0.45, 0.6], ["#1a0526", "#1a0526", "#fff6e5"]);
  const farSkylineX = useTransform(progress, [0, 1], [0, -distance * 0.15]);
  const nearSkylineX = useTransform(progress, [0, 1], [0, -distance * 0.35]);

  return (
    <section id="day" ref={sectionRef} style={{ height: distance ? distance + viewport : "500vh" }} className="relative">
      <motion.div style={{ background: sky }} className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ opacity: starsOpacity }} className="absolute inset-0">
          <Sparkles count={60} seed={33} />
        </motion.div>
        <motion.div style={{ x: orbX, y: orbY, backgroundColor: orbColor, boxShadow: orbGlow }} className="absolute left-0 top-0 h-24 w-24 rounded-full sm:h-32 sm:w-32" />

        {/* distant skyline silhouettes for depth */}
        <motion.svg style={{ x: farSkylineX }} viewBox="0 0 2400 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-40 w-[250vw] text-plum/40" aria-hidden>
          <path fill="currentColor" d="M0 200 V120 h80 v-40 h40 v40 h60 V90 l30-30 30 30 v40 h90 V70 h20 V40 h10 v30 h20 v60 h120 v-50 l40-40 40 40 v50 h100 V100 h60 V60 h30 v70 h110 V90 l50-50 50 50 v40 h90 v-60 h40 v60 h120 V80 h20 V50 h10 v30 h20 v50 h140 v-40 l40-40 40 40 v40 h100 V100 h60 V70 h30 v60 h120 V90 l40-40 40 40 v40 h200 V200Z" />
        </motion.svg>
        <motion.svg style={{ x: nearSkylineX }} viewBox="0 0 2400 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-24 w-[250vw] text-plum/70" aria-hidden>
          <path fill="currentColor" d="M0 200 V140 q60-50 120 0 q60-60 140 0 V110 h40 v30 q80-70 160 0 q70-40 140 0 V120 h30 v20 q90-60 180 0 q60-50 120 0 V100 h50 v40 q80-60 160 0 q70-50 140 0 V130 h40 v10 q90-70 180 0 q60-40 120 0 V110 h30 v30 q80-60 160 0 q70-50 140 0 V200Z" />
        </motion.svg>

        <div className="relative z-10 flex h-full flex-col justify-center">
          <motion.div style={{ color: titleColor }} className="px-6 sm:px-12">
            <span className="inline-block rounded-full border border-current/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em]">✦ the itinerary</span>
            <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.9] tracking-tighter sm:text-7xl">
              <SplitText text="one day," bouncy /> <SplitText text="zero chill." delay={0.2} className="font-serif font-normal italic tracking-normal" />
            </h2>
          </motion.div>

          <motion.div ref={trackRef} style={{ x }} className="mt-8 flex w-max items-stretch gap-5 px-6 sm:gap-8 sm:px-12">
            {SCHEDULE.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 60, rotate: i % 2 ? 4 : -4 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
                whileHover={{ rotate: 0, y: -10, scale: 1.03 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                className={`${CARD_COLORS[i % CARD_COLORS.length]} relative flex w-[78vw] shrink-0 flex-col rounded-[2rem] border-2 border-plum p-6 text-plum shadow-[8px_8px_0_#1a0526] sm:w-[360px]`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-4xl font-extrabold tracking-tighter sm:text-5xl">{item.time}</span>
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [0, -12, 12, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 + (i % 3), ease: "easeInOut" }}
                  >
                    {item.emoji}
                  </motion.span>
                </div>
                <h3 className="mt-6 font-serif text-4xl italic leading-none">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-plum/80">{item.blurb}</p>
                <div className="mt-auto pt-6">
                  <span className="rounded-full bg-plum px-3 py-1 text-xs font-bold uppercase tracking-wider text-cream">{item.tag}</span>
                </div>
                <span className="absolute -top-3 right-6 rounded-full border-2 border-plum bg-white px-2 text-xs font-extrabold">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.article>
            ))}
            <div className="flex w-[60vw] shrink-0 flex-col justify-center sm:w-[380px]">
              <p className="font-display text-6xl font-extrabold leading-[0.9] tracking-tighter text-cream sm:text-7xl">
                and then
                <br />
                <span className="text-shimmer-gold">we sleep.</span>
              </p>
              <p className="mt-3 font-serif text-2xl italic text-cream/70">(maybe.)</p>
            </div>
          </motion.div>

          {/* how far through the day we are */}
          <div className="mx-6 mt-10 h-1.5 overflow-hidden rounded-full bg-white/25 sm:mx-12">
            <motion.div style={{ scaleX: lineScale }} className="h-full origin-left rounded-full bg-gradient-to-r from-plum via-rani to-haldi" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
