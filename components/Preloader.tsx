"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Diya from "./art/Diya";
import { setScrollLocked } from "./SmoothScroll";

export const INTRO_DELAY = 1.7;

/** Short curtain: a diya lights up, then the curtain lifts to reveal the hero. */
export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setScrollLocked(true);
    const t = setTimeout(() => {
      setShow(false);
      setScrollLocked(false);
    }, INTRO_DELAY * 1000 - 300);
    return () => {
      clearTimeout(t);
      setScrollLocked(false);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-plum"
          exit={{ y: "-100%", borderBottomLeftRadius: "50% 20%", borderBottomRightRadius: "50% 20%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
            <Diya size={110} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 font-display text-xs font-bold uppercase text-gold"
          >
            lighting things up…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
