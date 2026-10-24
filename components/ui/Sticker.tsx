"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  dragArea?: React.RefObject<HTMLElement | null>;
};

/** Gen-Z sticker badge — draggable, wobbles on hover. */
export default function Sticker({ children, className = "", rotate = -8, dragArea }: Props) {
  return (
    <motion.div
      drag
      dragConstraints={dragArea}
      dragElastic={0.3}
      whileHover={{ scale: 1.08, rotate: rotate + 6 }}
      whileDrag={{ scale: 1.15, cursor: "grabbing" }}
      initial={{ scale: 0, rotate: rotate - 40 }}
      whileInView={{ scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 14 }}
      className={`absolute z-20 cursor-grab select-none rounded-full border-2 border-plum px-4 py-2 font-display text-sm font-extrabold uppercase tracking-tight text-plum shadow-[4px_4px_0_#1a0526] ${className}`}
    >
      {children}
    </motion.div>
  );
}
