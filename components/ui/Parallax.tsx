"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Positive drifts down (slower than the page), negative drifts up (faster). */
  speed?: number;
  className?: string;
  rotate?: number;
};

/** Moves its children relative to scroll while the element is on screen. */
export default function Parallax({ children, speed = 0.3, className = "", rotate = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const distance = reduce ? 0 : speed * 300;
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);

  return (
    <motion.div ref={ref} style={{ y, rotate: r }} className={className}>
      {children}
    </motion.div>
  );
}
