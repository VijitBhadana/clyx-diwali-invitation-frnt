"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { api, type Attending, type RsvpSummary } from "@/lib/api";
import { seeded } from "@/lib/random";
import { useGuestName } from "@/lib/useGuestName";
import { LanternField } from "./art/Lanterns";
import Mandala from "./art/Mandala";
import Parallax from "./ui/Parallax";
import SectionTitle from "./ui/SectionTitle";

const CHOICES: { id: Attending; label: string; emoji: string; color: string }[] = [
  { id: "yes", label: "I'm IN", emoji: "🔥", color: "bg-haldi" },
  { id: "maybe", label: "maybe", emoji: "👀", color: "bg-blush" },
  { id: "no", label: "can't", emoji: "😭", color: "bg-cream" },
];

const NOTE_COLORS = ["bg-haldi", "bg-blush", "bg-genda", "bg-cream", "bg-[#c4f1be]"];

function Confetti({ burst }: { burst: number }) {
  const rand = seeded(burst * 97 + 1);
  const pieces = Array.from({ length: 36 }, () => ({
    x: (rand() - 0.5) * 520,
    y: -120 - rand() * 280,
    r: rand() * 720 - 360,
    color: ["#ffd60a", "#ff2e93", "#ff6b1a", "#8b2fc9", "#fff6e5"][Math.floor(rand() * 5)],
    w: 6 + rand() * 8,
  }));
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={`${burst}-${i}`}
          className="absolute block rounded-sm"
          style={{ width: p.w, height: p.w * 0.5, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 400], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.4, 1] }}
        />
      ))}
    </div>
  );
}

export default function Rsvp() {
  const [name, setName] = useGuestName();
  const [attending, setAttending] = useState<Attending>("yes");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [summary, setSummary] = useState<RsvpSummary | null>(null);
  const [burst, setBurst] = useState(0);

  const load = useCallback(async () => {
    try {
      setSummary(await api.rsvpSummary());
    } catch {
      // the form still works visually; the stats just stay hidden
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setMessage({ ok: false, text: "we need ur name for the guest list" });
    setSaving(true);
    setMessage(null);
    try {
      await api.rsvp({ name: name.trim(), attending, plusOnes: 0, message: note.trim() || undefined });
      setMessage({
        ok: true,
        text: attending === "yes" ? "ur on the list bestie 🪔 see u on 1st nov" : attending === "maybe" ? "noted! we'll save u a ladoo just in case" : "we'll miss u 😭 send pics of ur own diyas",
      });
      if (attending !== "no") setBurst((b) => b + 1);
      load();
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#8b2fc9_0%,#5b1a8a_40%,#2d0a45_100%)] px-4 py-28 sm:px-8">
      <Parallax speed={0.5} className="pointer-events-none absolute inset-0">
        <LanternField depth={0} count={10} seed={77} />
      </Parallax>
      <Parallax speed={-0.3} className="pointer-events-none absolute left-1/2 top-24 h-[44rem] w-[44rem] -translate-x-1/2 text-gold/10">
        <Mandala className="spin-slow h-full w-full" />
      </Parallax>

      <SectionTitle kicker="rsvp" title="r u coming" accent="or what?" />

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-10 lg:grid-cols-2">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] border-2 border-plum bg-cream p-6 text-plum shadow-[10px_10px_0_#ff2e93] sm:p-8"
        >
          <AnimatePresence>{burst > 0 && <Confetti key={burst} burst={burst} />}</AnimatePresence>

          <label className="block font-display text-sm font-extrabold uppercase tracking-[0.2em] text-rani" htmlFor="rsvp-name">
            ur name
          </label>
          <input
            id="rsvp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="as it should appear on the guest list"
            className="mt-2 w-full rounded-full border-2 border-plum bg-white px-5 py-3 font-semibold outline-none placeholder:text-plum/40 focus:ring-4 focus:ring-haldi"
          />

          <p className="mt-6 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-rani">coming?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CHOICES.map((c) => (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => setAttending(c.id)}
                whileHover={{ y: -4, rotate: -2 }}
                whileTap={{ scale: 0.93 }}
                aria-pressed={attending === c.id}
                className={`rounded-2xl border-2 border-plum py-4 font-display text-lg font-extrabold transition-all ${attending === c.id ? `${c.color} shadow-[4px_4px_0_#1a0526]` : "bg-white/50 opacity-70"}`}
              >
                <motion.span className="block text-3xl" animate={attending === c.id ? { scale: [1, 1.4, 1], rotate: [0, 15, 0] } : {}}>
                  {c.emoji}
                </motion.span>
                {c.label}
              </motion.button>
            ))}
          </div>

          <label className="mt-6 block font-display text-sm font-extrabold uppercase tracking-[0.2em] text-rani" htmlFor="rsvp-note">
            leave a note for the wall
          </label>
          <textarea
            id="rsvp-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={280}
            rows={3}
            placeholder="bringing my famous gajar halwa…"
            className="mt-2 w-full resize-none rounded-3xl border-2 border-plum bg-white px-5 py-3 font-semibold outline-none placeholder:text-plum/40 focus:ring-4 focus:ring-haldi"
          />

          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 w-full rounded-full border-2 border-plum bg-rani py-4 font-display text-xl font-extrabold text-cream shadow-[5px_5px_0_#1a0526] disabled:opacity-60"
          >
            {saving ? "sending…" : "send my rsvp ✦"}
          </motion.button>

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className={`mt-4 text-center font-bold ${message.ok ? "text-leaf" : "text-sindoor"}`}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        <div className="text-cream">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "headcount", value: summary?.headcount },
              { label: "confirmed", value: summary?.counts.yes },
              { label: "maybe", value: summary?.counts.maybe },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="glass rounded-3xl p-4 text-center"
              >
                <p className="text-shimmer-gold font-display text-5xl font-extrabold">{s.value ?? "–"}</p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream/60">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <h3 className="mt-10 font-display text-3xl font-extrabold tracking-tight">
            the guestbook <span className="font-serif font-normal italic text-blush">wall</span>
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(summary?.wall ?? []).filter((w) => w.message).length === 0 ? (
              <p className="col-span-full rounded-2xl border-2 border-dashed border-cream/40 p-6 text-center font-serif text-xl italic text-cream/70">
                no notes yet — leave the first one
              </p>
            ) : (
              summary!.wall
                .filter((w) => w.message)
                .slice(0, 8)
                .map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 30, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                    whileHover={{ rotate: 0, scale: 1.04 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 160, damping: 15, delay: i * 0.05 }}
                    className={`${NOTE_COLORS[i % NOTE_COLORS.length]} rounded-2xl p-4 text-plum shadow-[4px_4px_0_#1a0526]`}
                  >
                    <p className="font-serif text-lg italic leading-snug">&ldquo;{w.message}&rdquo;</p>
                    <p className="mt-2 text-xs font-extrabold uppercase tracking-wider">
                      — {w.name} {w.attending === "yes" ? "🔥" : "👀"}
                    </p>
                  </motion.div>
                ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
