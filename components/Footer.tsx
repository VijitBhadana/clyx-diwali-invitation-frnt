"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EVENT } from "@/lib/event";
import Diya from "./art/Diya";
import { Marigold } from "./art/Marigold";
import Sparkles from "./art/Sparkles";
import { SplitText, WavyText } from "./ui/AnimatedText";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [-160, 0]);
  const garlandY = useTransform(scrollYProgress, [0, 1], [-80, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-plum px-4 pb-10 pt-0 sm:px-8">
      {/* marigold toran hanging from the top edge */}
      <motion.div style={{ y: garlandY }} className="flex justify-center gap-0" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} className="flex flex-col items-center" style={{ marginTop: Math.sin((i / 17) * Math.PI) * 40 }}>
            {Array.from({ length: 2 + (i % 3) }, (_, j) => (
              <Marigold key={j} size={34} tone={(i + j) % 2 ? "yellow" : "orange"} className="-mt-2" />
            ))}
          </div>
        ))}
      </motion.div>

      <Sparkles count={40} seed={99} />

      <motion.div style={{ y }} className="relative mx-auto max-w-6xl pt-24 text-center">
        <p className="font-script text-4xl text-blush">so, it&apos;s a date?</p>
        <h2 className="mt-2 font-display text-[16vw] font-extrabold leading-[0.85] tracking-tighter sm:text-[9rem]">
          <SplitText text="see u at" bouncy className="block" />
          <SplitText text="the diya drop" delay={0.2} bouncy className="block" charClassName="text-shimmer-funk" />
        </h2>

        <div className="mt-10 flex items-end justify-center gap-3">
          {[50, 70, 90, 70, 50].map((s, i) => (
            <Diya key={i} size={s} delay={i * 0.25} />
          ))}
        </div>

        <div className="mt-14 grid gap-6 text-left sm:grid-cols-3">
          <div className="glass rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-haldi">when</p>
            <p className="mt-2 font-display text-xl font-extrabold">{EVENT.dateLabel}</p>
            <p className="text-cream/70">{EVENT.timeLabel}</p>
          </div>
          <a href={EVENT.mapsUrl} target="_blank" rel="noreferrer" className="glass group rounded-3xl p-6 transition-colors hover:bg-white/15">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-haldi">where</p>
            <p className="mt-2 font-display text-xl font-extrabold">{EVENT.venue}</p>
            <p className="text-cream/70">{EVENT.address}</p>
            <p className="mt-2 text-sm font-bold text-blush group-hover:underline">open in maps ↗</p>
          </a>
          <a href={`tel:${EVENT.contact.phone.replace(/\s/g, "")}`} className="glass group rounded-3xl p-6 transition-colors hover:bg-white/15">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-haldi">lost? call</p>
            <p className="mt-2 font-display text-xl font-extrabold">{EVENT.contact.name}</p>
            <p className="text-cream/70 group-hover:underline">{EVENT.contact.phone}</p>
          </a>
        </div>

        <p className="mt-16 text-sm font-semibold text-cream/50">
          <WavyText text="made with ghee, glitter & love" /> · {EVENT.host} · diwali 2026
        </p>
      </motion.div>
    </footer>
  );
}
