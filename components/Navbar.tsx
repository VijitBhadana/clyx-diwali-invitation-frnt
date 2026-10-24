"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { INTRO_DELAY } from "./Preloader";
import { scrollToId } from "./SmoothScroll";

const LINKS = [
  { id: "invite", label: "invite" },
  { id: "day", label: "the day" },
  { id: "fits", label: "fits" },
  { id: "photos", label: "pics" },
  { id: "rsvp", label: "rsvp" },
];

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), INTRO_DELAY * 1000 + 600);
    return () => clearTimeout(t);
  }, []);

  // Hide while scrolling down, come back on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-rani via-kesari to-haldi" />
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24, delay: introDone ? 0 : INTRO_DELAY }}
        className="fixed inset-x-0 top-3 z-50 mx-auto flex w-[min(96vw,760px)] items-center justify-between gap-2 rounded-full glass px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
      >
        <button onClick={() => scrollToId("top")} className="shrink-0 rounded-full bg-haldi px-3 py-1.5 font-display text-sm font-extrabold tracking-tight text-plum">
          diwali<span className="text-rani">.</span>26
        </button>
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="relative shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-cream/80 transition-colors hover:text-white"
            >
              {active === l.id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-rani" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative">{l.label}</span>
            </button>
          ))}
        </div>
      </motion.nav>
    </>
  );
}
