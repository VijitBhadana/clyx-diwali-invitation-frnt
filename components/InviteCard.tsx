"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { EVENT } from "@/lib/event";
import Diya from "./art/Diya";
import Mandala from "./art/Mandala";
import { Leaf, Marigold } from "./art/Marigold";
import Sparkles from "./art/Sparkles";
import { WavyText } from "./ui/AnimatedText";
import Parallax from "./ui/Parallax";

// Flower clusters along the card edges, in % of the card box
const BORDER: { x: number; y: number; s: number; tone: "orange" | "yellow"; leaf?: number }[] = [
  { x: -4, y: -3, s: 26, tone: "orange", leaf: 30 },
  { x: 14, y: -5, s: 20, tone: "yellow" },
  { x: 30, y: -4, s: 16, tone: "orange", leaf: -20 },
  { x: 62, y: -4, s: 17, tone: "yellow", leaf: 40 },
  { x: 78, y: -5, s: 20, tone: "orange" },
  { x: 92, y: -3, s: 25, tone: "yellow", leaf: -35 },
  { x: -6, y: 14, s: 21, tone: "yellow", leaf: 70 },
  { x: -3, y: 30, s: 17, tone: "orange" },
  { x: -7, y: 45, s: 22, tone: "orange", leaf: 110 },
  { x: -3, y: 62, s: 16, tone: "yellow" },
  { x: -6, y: 76, s: 22, tone: "yellow", leaf: 60 },
  { x: -4, y: 92, s: 25, tone: "orange", leaf: 140 },
  { x: 94, y: 14, s: 20, tone: "orange", leaf: -70 },
  { x: 97, y: 30, s: 17, tone: "yellow" },
  { x: 92, y: 45, s: 23, tone: "yellow", leaf: -110 },
  { x: 97, y: 62, s: 16, tone: "orange" },
  { x: 93, y: 76, s: 22, tone: "orange", leaf: -60 },
  { x: 90, y: 92, s: 26, tone: "yellow", leaf: -140 },
  { x: 20, y: 96, s: 15, tone: "orange" },
  { x: 72, y: 96, s: 15, tone: "yellow" },
];

function MarigoldBorder() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {BORDER.map((f, i) => (
        <div key={i} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.s}%` }}>
          {f.leaf !== undefined && (
            <Leaf size={60} rotate={f.leaf} className="absolute left-1/2 top-1/2 h-auto w-[55%] -translate-x-1/2 -translate-y-full" style={{ transformOrigin: "50% 100%" }} />
          )}
          <Marigold tone={f.tone} className="sway relative h-auto w-full drop-shadow-md" style={{ animationDelay: `${-i * 0.4}s` }} />
        </div>
      ))}
    </div>
  );
}

export default function InviteCard() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, restDelta: 0.001 });

  // Envelope choreography: flap opens → card slides out → envelope drops away
  const flapRotate = useTransform(p, [0.02, 0.2], [0, 180]);
  const flapZ = useTransform(p, (v) => (v < 0.11 ? 30 : 1));
  const cardY = useTransform(p, [0.18, 0.6], ["55%", "0%"]);
  const cardScale = useTransform(p, [0.55, 0.8], [0.94, 1]);
  const envelopeY = useTransform(p, [0.6, 0.85], ["0%", "70%"]);
  const envelopeOpacity = useTransform(p, [0.7, 0.88], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

  // Pointer tilt on the card
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rx = useSpring(tiltX, { stiffness: 150, damping: 15 });
  const ry = useSpring(tiltY, { stiffness: 150, damping: 15 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section id="invite" ref={ref} className="relative h-[260vh] bg-plum">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* background depth */}
        <Sparkles count={30} seed={12} />
        <Parallax speed={0.4} className="absolute -left-40 top-10 h-[420px] w-[420px] text-genda/15">
          <Mandala className="spin-slow h-full w-full" />
        </Parallax>
        <Parallax speed={-0.3} className="absolute -right-48 bottom-0 h-[520px] w-[520px] text-rani/15">
          <Mandala className="spin-slower h-full w-full" />
        </Parallax>
        <Parallax speed={-0.6} className="absolute left-[8%] top-[18%] hidden lg:block">
          <Diya size={90} />
        </Parallax>
        <Parallax speed={0.5} className="absolute right-[9%] top-[30%] hidden lg:block">
          <Diya size={110} delay={0.6} />
        </Parallax>
        <Parallax speed={-0.2} className="absolute bottom-[12%] left-[14%] hidden lg:block">
          <Diya size={70} delay={1.1} />
        </Parallax>

        <motion.p style={{ opacity: hintOpacity }} className="absolute top-[12%] z-40 text-center font-display text-sm font-bold uppercase tracking-[0.3em] text-haldi">
          <WavyText text="scroll to open ur invite ✉" />
        </motion.p>

        <div className="relative h-[min(84svh,720px)] w-[min(90vw,500px)] [perspective:1400px]">
          {/* envelope back */}
          <motion.div style={{ y: envelopeY, opacity: envelopeOpacity }} className="absolute inset-x-0 bottom-0 z-0 h-[52%] rounded-b-2xl rounded-t-md bg-[#c2410c]" />

          {/* the card — clipped to the envelope box so it can't peek out underneath */}
          <div className="absolute -inset-x-6 -top-6 bottom-0 z-10 overflow-hidden [perspective:1400px]">
          <motion.div style={{ y: cardY, scale: cardScale }} className="absolute left-[calc(5%+18px)] right-[calc(5%+18px)] top-[calc(4%+24px)] h-[88%]">
            <motion.div
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{ rotateX: rx, rotateY: ry }}
              className="paper relative h-full w-full overflow-hidden rounded-md text-plum shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            >
              <MarigoldBorder />
              <div className="relative flex h-full flex-col items-center justify-center px-[19%] py-[16%] text-center">
                <p className="text-[clamp(9px,2.4vw,12px)] font-semibold uppercase tracking-[0.35em] text-plum/70">You&apos;re invited to</p>
                <h3 className="mt-3 font-serif text-[clamp(38px,11vw,64px)] italic leading-[0.9] text-sindoor">
                  Light
                  <br />
                  the Diya
                </h3>
                <p className="mt-3 text-[clamp(10px,2.6vw,13px)] font-semibold uppercase tracking-[0.25em] text-plum/80">& an all-night Diwali bash</p>

                <div className="my-4 flex items-center gap-2 text-kesari" aria-hidden>
                  <span className="h-px w-8 bg-current" />
                  <span>✦</span>
                  <span className="h-px w-8 bg-current" />
                </div>

                <p className="font-display text-[clamp(14px,4vw,20px)] font-extrabold leading-tight">{EVENT.dateLabel}</p>
                <p className="mt-1 text-[clamp(11px,2.8vw,14px)] text-plum/70">{EVENT.timeLabel}</p>

                <p className="mt-4 font-serif text-[clamp(18px,5vw,26px)] italic leading-tight">{EVENT.venue}</p>
                <p className="mt-1 text-[clamp(10px,2.6vw,12px)] uppercase tracking-[0.2em] text-plum/60">{EVENT.address}</p>

                <p className="mt-5 font-script text-[clamp(20px,6vw,30px)] text-rani">with love, {EVENT.host}</p>
              </div>
            </motion.div>
          </motion.div>
          </div>

          {/* envelope front pocket */}
          <motion.div
            style={{ y: envelopeY, opacity: envelopeOpacity, clipPath: "polygon(0 0, 50% 42%, 100% 0, 100% 100%, 0 100%)" }}
            className="absolute inset-x-0 bottom-0 z-20 h-[52%] rounded-b-2xl bg-gradient-to-b from-[#ea580c] to-[#c2410c] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="font-script text-3xl text-cream/90">for you ✦</p>
            </div>
          </motion.div>

          {/* envelope flap */}
          <motion.div
            style={{ y: envelopeY, opacity: envelopeOpacity, zIndex: flapZ }}
            className="absolute inset-x-0 top-[48%] h-[30%]"
          >
            <motion.div
              style={{ rotateX: flapRotate, clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformOrigin: "50% 0%" }}
              className="h-full w-full bg-gradient-to-b from-[#f97316] to-[#c2410c]"
            >
              <div className="absolute left-1/2 top-[55%] grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-sindoor text-xl text-haldi shadow-lg">
                🪔
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
