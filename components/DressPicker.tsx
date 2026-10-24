"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type OutfitPick, type OutfitType } from "@/lib/api";
import { ACCENTS, COLORS, OUTFITS, VIBES, colorName, outfitLabel } from "@/lib/fits";
import { useGuestName } from "@/lib/useGuestName";
import Mandala from "./art/Mandala";
import { Marigold } from "./art/Marigold";
import FitFigure from "./FitFigure";
import Parallax from "./ui/Parallax";
import SectionTitle from "./ui/SectionTitle";

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="rounded-[1.75rem] border-2 border-plum bg-cream/90 p-5 shadow-[6px_6px_0_#1a0526] sm:p-6"
    >
      <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-rani">
        {n} <span className="text-plum">— {title}</span>
      </p>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function Swatch({ hex, name, selected, onClick }: { hex: string; name: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.15, rotate: -8 }}
      whileTap={{ scale: 0.9 }}
      title={name}
      aria-label={name}
      aria-pressed={selected}
      className={`relative h-11 w-11 rounded-full border-2 border-plum shadow-[3px_3px_0_#1a0526] ${selected ? "ring-4 ring-plum ring-offset-2 ring-offset-cream" : ""}`}
      style={{ backgroundColor: hex }}
    >
      {selected && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 grid place-items-center text-lg font-black" style={{ color: hex === "#1a1a1a" || hex === "#1d2b64" || hex === "#7b2cbf" ? "#fff" : "#1a0526" }}>
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}

export default function DressPicker() {
  const [name, setName] = useGuestName();
  const [outfit, setOutfit] = useState<OutfitType>("lehenga");
  const [color, setColor] = useState(COLORS[0].hex);
  const [accent, setAccent] = useState(ACCENTS[0].hex);
  const [vibe, setVibe] = useState(VIBES[0]);
  const [board, setBoard] = useState<OutfitPick[]>([]);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const loadBoard = useCallback(async () => {
    try {
      const res = await api.outfits();
      setBoard(res.items);
      setBoardError(null);
    } catch (e) {
      setBoardError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const twins = useMemo(
    () => board.filter((b) => b.color === color.toLowerCase() && b.name.toLowerCase() !== name.trim().toLowerCase()),
    [board, color, name],
  );

  const colorShare = useMemo(() => {
    const counts = board.reduce<Record<string, number>>((acc, b) => ({ ...acc, [b.color]: (acc[b.color] ?? 0) + 1 }), {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [board]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({ kind: "error", message: "drop ur name first bestie" });
      return;
    }
    setStatus({ kind: "saving" });
    try {
      await api.saveOutfit({ name: name.trim(), outfit, color, accent, vibe });
      setStatus({ kind: "saved", message: "fit locked 🔒 see u in it" });
      loadBoard();
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  };

  return (
    <section id="fits" className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#ff8fc4_0%,#ff2e93_35%,#c0167a_100%)] px-4 py-28 text-plum sm:px-8">
      <Parallax speed={0.5} className="pointer-events-none absolute -left-24 top-24 h-80 w-80 text-plum/15">
        <Mandala className="spin-slow h-full w-full" />
      </Parallax>
      <Parallax speed={-0.4} className="pointer-events-none absolute -right-10 top-40">
        <Marigold size={140} tone="yellow" className="spin-slower" />
      </Parallax>
      <Parallax speed={0.8} className="pointer-events-none absolute bottom-40 left-[6%]">
        <Marigold size={90} tone="orange" className="spin-slow" />
      </Parallax>
      <Parallax speed={-0.7} className="pointer-events-none absolute bottom-10 right-[12%]">
        <Marigold size={70} tone="yellow" />
      </Parallax>

      <SectionTitle kicker="dress picker" title="pick ur fit" accent="before someone else does." />
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto mt-5 max-w-lg text-center font-semibold text-plum/80"
      >
        Dress code: <span className="rounded-md bg-haldi px-1.5">festive brights</span>. Lock in your outfit and see what everyone else is wearing, so nobody shows up in the same Rani pink by accident.
      </motion.p>

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* live preview card */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, rotate: -6, y: 40 }}
            whileInView={{ opacity: 1, rotate: -2, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-plum bg-plum p-6 text-cream shadow-[10px_10px_0_#1a0526]"
          >
            {/* holographic sheen */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-haldi">
              <span>fit card</span>
              <span>diwali &apos;26</span>
            </div>

            <div className="relative mx-auto mt-4 aspect-square w-full max-w-[320px]">
              <div className="absolute inset-0 rounded-full opacity-40 blur-2xl transition-colors duration-500" style={{ backgroundColor: color }} />
              <div className="absolute inset-0 text-gold/40">
                <Mandala className="spin-slow h-full w-full" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={outfit}
                  initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.7, opacity: 0, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="absolute inset-[6%]"
                >
                  <FitFigure outfit={outfit} color={color} accent={accent} className="sway h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
                </motion.div>
              </AnimatePresence>
            </div>

            <h3 className="mt-4 truncate font-display text-3xl font-extrabold tracking-tight">{name.trim() || "ur name"}&apos;s fit</h3>
            <p className="font-serif text-2xl italic text-blush">
              {colorName(color)} {outfitLabel(outfit)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase">
              <span className="rounded-full px-3 py-1 text-plum" style={{ backgroundColor: accent }}>
                {colorName(accent)} details
              </span>
              <span className="rounded-full bg-haldi px-3 py-1 text-plum">{vibe}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={`${color}-${twins.length}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm"
              >
                {twins.length === 0
                  ? `nobody's in ${colorName(color)} yet. u'd be iconic ✨`
                  : twins.length < 3
                    ? `${twins.map((t) => t.name).join(" & ")} ${twins.length === 1 ? "is" : "are"} also in ${colorName(color)} — twinning potential 👯`
                    : `${twins.length} people already picked ${colorName(color)}. maybe switch it up? 👀`}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* controls */}
        <form onSubmit={save} className="flex flex-col gap-5">
          <Step n="01" title="what are we wearing?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {OUTFITS.map((o) => (
                <motion.button
                  key={o.id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setOutfit(o.id)}
                  aria-pressed={outfit === o.id}
                  className="relative rounded-2xl border-2 border-plum px-2 py-3 text-sm font-bold"
                >
                  {outfit === o.id && <motion.span layoutId="outfit-pill" className="absolute inset-0 rounded-[14px] bg-haldi" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span className="relative block text-2xl">{o.emoji}</span>
                  <span className="relative">{o.label}</span>
                </motion.button>
              ))}
            </div>
          </Step>

          <Step n="02" title="main colour">
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <Swatch key={c.hex} {...c} selected={color === c.hex} onClick={() => setColor(c.hex)} />
              ))}
            </div>
            <p className="mt-3 font-serif text-xl italic">{colorName(color)}</p>
          </Step>

          <Step n="03" title="zari & details">
            <div className="flex flex-wrap gap-3">
              {ACCENTS.map((c) => (
                <Swatch key={c.hex} {...c} selected={accent === c.hex} onClick={() => setAccent(c.hex)} />
              ))}
            </div>
            <p className="mt-3 font-serif text-xl italic">{colorName(accent)}</p>
          </Step>

          <Step n="04" title="the vibe">
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <motion.button
                  key={v}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setVibe(v)}
                  aria-pressed={vibe === v}
                  className={`rounded-full border-2 border-plum px-4 py-2 text-sm font-bold transition-colors ${vibe === v ? "bg-plum text-haldi" : "bg-transparent"}`}
                >
                  {v}
                </motion.button>
              ))}
            </div>
          </Step>

          <Step n="05" title="lock it in">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="ur name (so we know who's twinning)"
                className="min-w-0 flex-1 rounded-full border-2 border-plum bg-white px-5 py-3 font-semibold outline-none placeholder:text-plum/40 focus:ring-4 focus:ring-haldi"
              />
              <motion.button
                type="submit"
                disabled={status.kind === "saving"}
                whileHover={{ scale: 1.04, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-full border-2 border-plum bg-plum px-6 py-3 font-display font-extrabold text-haldi shadow-[4px_4px_0_#ffd60a] disabled:opacity-60"
              >
                {status.kind === "saving" ? "locking…" : "lock my fit 🔒"}
              </motion.button>
            </div>
            <AnimatePresence>
              {status.message && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="status"
                  className={`mt-3 text-sm font-bold ${status.kind === "error" ? "text-sindoor" : "text-leaf"}`}
                >
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>
          </Step>
        </form>
      </div>

      {/* the fit board */}
      <div className="relative mx-auto mt-24 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-4xl font-extrabold tracking-tighter sm:text-5xl">
            the fit board <span className="font-serif font-normal italic">({board.length})</span>
          </h3>
          {colorShare.length > 0 && (
            <div className="flex h-5 w-full max-w-sm overflow-hidden rounded-full border-2 border-plum" title="colour split">
              {colorShare.map(([hex, n]) => (
                <motion.div
                  key={hex}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(n / board.length) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{ backgroundColor: hex }}
                  title={`${colorName(hex)}: ${n}`}
                />
              ))}
            </div>
          )}
        </div>

        {boardError ? (
          <p className="mt-6 rounded-2xl border-2 border-dashed border-plum/50 p-6 text-center font-semibold">fit board is offline rn — {boardError}</p>
        ) : board.length === 0 ? (
          <p className="mt-6 rounded-2xl border-2 border-dashed border-plum/50 p-6 text-center font-semibold">no fits locked yet. be the trendsetter ✦</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {board.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30, rotate: i % 2 ? 6 : -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                whileHover={{ rotate: 0, y: -6 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 160, damping: 16, delay: (i % 5) * 0.05 }}
                className="rounded-3xl border-2 border-plum bg-cream p-3 shadow-[4px_4px_0_#1a0526]"
              >
                <div className="rounded-2xl" style={{ background: `radial-gradient(circle, ${b.color}55, transparent 70%)` }}>
                  <FitFigure outfit={b.outfit} color={b.color} accent={b.accent} className="mx-auto h-40 w-auto" />
                </div>
                <p className="mt-2 truncate font-display text-lg font-extrabold">{b.name}</p>
                <p className="truncate text-xs font-semibold text-plum/70">
                  {colorName(b.color)} {outfitLabel(b.outfit)}
                </p>
                {b.vibe && <p className="mt-1 truncate font-serif text-sm italic text-rani">{b.vibe}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
