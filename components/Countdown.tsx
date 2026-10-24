"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event";

const target = new Date(EVENT.startsAt).getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "days", value: Math.floor(s / 86400) },
    { label: "hrs", value: Math.floor((s % 86400) / 3600) },
    { label: "min", value: Math.floor((s % 3600) / 60) },
    { label: "sec", value: s % 60 },
  ];
}

export default function Countdown() {
  // null until mounted so server and client markup match
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now !== null && now >= target) {
    return <p className="font-display text-2xl font-extrabold text-haldi">it&apos;s happening rn 🔥</p>;
  }

  const units = parts(now === null ? 0 : target - now);
  return (
    <div className="flex gap-2 sm:gap-3" aria-live="off">
      {units.map((u) => (
        <div key={u.label} className="glass flex w-16 flex-col items-center rounded-2xl py-2 sm:w-20">
          <div className="relative h-9 overflow-hidden font-display text-3xl font-extrabold tabular-nums leading-9 text-white sm:h-11 sm:text-4xl sm:leading-[44px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={now === null ? "-" : u.value}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="block"
              >
                {now === null ? "--" : String(u.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/60">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
