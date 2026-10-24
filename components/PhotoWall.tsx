"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, type Phase, type Photo } from "@/lib/api";
import { hashString } from "@/lib/random";
import { useGuestName } from "@/lib/useGuestName";
import Diya from "./art/Diya";
import Mandala from "./art/Mandala";
import Sparkles from "./art/Sparkles";
import { setScrollLocked } from "./SmoothScroll";
import Parallax from "./ui/Parallax";
import SectionTitle from "./ui/SectionTitle";

const MAX_BYTES = 10 * 1024 * 1024;
const REFRESH_MS = 30_000;

const TABS: { id: Phase; label: string; sub: string }[] = [
  { id: "before", label: "before", sub: "getting ready, mirror selfies, rangoli WIP" },
  { id: "after", label: "after", sub: "the aftermath — sparklers, smudged kajal, full bellies" },
];

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return hrs < 24 ? `${hrs}h ago` : `${Math.round(hrs / 24)}d ago`;
}

function Polaroid({ photo, onOpen, index }: { photo: Photo; onOpen: () => void; index: number }) {
  const tilt = (hashString(photo.id) % 9) - 4;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 60, rotate: tilt * 2 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: Math.min(index, 8) * 0.04 }}
      className="relative mb-5 block w-full break-inside-avoid rounded-md bg-paper p-3 pb-4 text-left text-plum shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-3deg] bg-haldi/80" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={photo.caption || `Photo by ${photo.uploader}`} loading="lazy" decoding="async" className="w-full rounded-sm object-cover" />
      {photo.caption && <p className="mt-3 font-script text-2xl leading-tight">{photo.caption}</p>}
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-plum/60">
        {photo.uploader} · {timeAgo(photo.createdAt)}
      </p>
    </motion.button>
  );
}

export default function PhotoWall() {
  const [phase, setPhase] = useState<Phase>("before");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useGuestName();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [open, setOpen] = useState<Photo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const next = await api.photos();
      // the 30s poll usually returns the same list — keep the old array so the gallery doesn't re-render
      setPhotos((prev) => (prev.length === next.length && prev.every((p, i) => p.id === next[i].id) ? prev : next));
      setLoadError(null);
    } catch (e) {
      setLoadError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (f: File | undefined) => {
    setMessage(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) return setMessage({ ok: false, text: "images only pls 📸" });
    if (f.size > MAX_BYTES) return setMessage({ ok: false, text: "that pic is over 10MB — try a smaller one" });
    setFile(f);
  };

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage({ ok: false, text: "pick a pic first" });
    if (!name.trim()) return setMessage({ ok: false, text: "who's posting? add ur name" });
    setProgress(0);
    setMessage(null);
    try {
      const photo = await api.uploadPhoto({ file, uploader: name.trim(), phase, caption: caption.trim() || undefined }, setProgress);
      setPhotos((prev) => [photo, ...prev]);
      setFile(null);
      setCaption("");
      if (inputRef.current) inputRef.current.value = "";
      setMessage({ ok: true, text: "posted! everyone can see it now ✨" });
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setProgress(null);
    }
  };

  const visible = photos.filter((p) => p.phase === phase);
  const counts = { before: photos.filter((p) => p.phase === "before").length, after: photos.filter((p) => p.phase === "after").length };

  return (
    <section id="photos" className="relative overflow-hidden bg-[linear-gradient(160deg,#ff8a1f_0%,#ff6b1a_35%,#e3173e_100%)] px-4 py-28 sm:px-8">
      <Sparkles count={30} seed={55} />
      <Parallax speed={0.6} className="pointer-events-none absolute -left-32 -top-20 h-96 w-96 text-haldi/30">
        <Mandala className="spin-slow h-full w-full" />
      </Parallax>
      <Parallax speed={-0.5} className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] text-plum/20">
        <Mandala className="spin-slower h-full w-full" />
      </Parallax>
      <Parallax speed={-0.8} className="pointer-events-none absolute left-[5%] top-[30%] hidden md:block">
        <Diya size={80} />
      </Parallax>
      <Parallax speed={0.7} className="pointer-events-none absolute right-[6%] top-[18%] hidden md:block">
        <Diya size={64} delay={0.7} />
      </Parallax>

      <div className="text-cream">
        <SectionTitle kicker="photo dump" title="pics or it" accent="didn't happen." />
      </div>

      {/* phase tabs */}
      <div className="relative mx-auto mt-10 flex w-fit rounded-full border-2 border-plum bg-plum/30 p-1 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setPhase(t.id)}
            className={`relative rounded-full px-6 py-2.5 font-display text-lg font-extrabold transition-colors sm:px-10 ${phase === t.id ? "text-plum" : "text-cream"}`}
          >
            {phase === t.id && <motion.span layoutId="phase-pill" className="absolute inset-0 rounded-full bg-haldi" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="relative">
              {t.label} <span className="text-sm opacity-70">({counts[t.id]})</span>
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3 text-center font-serif text-xl italic text-cream/90">
          {TABS.find((t) => t.id === phase)?.sub}
        </motion.p>
      </AnimatePresence>

      <div className="relative mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        {/* uploader */}
        <motion.form
          onSubmit={upload}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="h-fit rounded-[2rem] border-2 border-plum bg-cream p-5 text-plum shadow-[8px_8px_0_#1a0526] lg:sticky lg:top-24"
        >
          <p className="font-display text-2xl font-extrabold tracking-tight">
            drop a <span className="font-serif font-normal italic text-rani">{phase}</span> pic
          </p>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files[0]);
            }}
            className={`mt-4 grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${dragging ? "border-rani bg-rani/10" : "border-plum/40 bg-white"}`}
          >
            <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Selected photo preview" className="h-full w-full object-cover" />
            ) : (
              <div className="p-4 text-center">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl">
                  📸
                </motion.div>
                <p className="mt-2 font-bold">tap or drag a pic here</p>
                <p className="text-xs text-plum/60">jpg, png, webp, heic · up to 10MB</p>
              </div>
            )}
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="ur name"
            className="mt-4 w-full rounded-full border-2 border-plum bg-white px-5 py-3 font-semibold outline-none placeholder:text-plum/40 focus:ring-4 focus:ring-haldi"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={140}
            placeholder="caption (optional, but make it funny)"
            className="mt-3 w-full rounded-full border-2 border-plum bg-white px-5 py-3 font-semibold outline-none placeholder:text-plum/40 focus:ring-4 focus:ring-haldi"
          />

          <motion.button
            type="submit"
            disabled={progress !== null}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative mt-4 w-full overflow-hidden rounded-full border-2 border-plum bg-plum py-3 font-display text-lg font-extrabold text-haldi shadow-[4px_4px_0_#ff2e93] disabled:cursor-wait"
          >
            {progress !== null && <motion.span className="absolute inset-y-0 left-0 bg-rani" animate={{ width: `${progress}%` }} />}
            <span className="relative">{progress !== null ? `uploading ${progress}%` : "post it ✦"}</span>
          </motion.button>

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="status"
                className={`mt-3 text-sm font-bold ${message.ok ? "text-leaf" : "text-sindoor"}`}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        {/* gallery */}
        <div>
          {loading ? (
            <p className="text-center font-bold text-cream">loading the dump…</p>
          ) : loadError ? (
            <p className="rounded-2xl border-2 border-dashed border-cream/60 p-8 text-center font-semibold text-cream">gallery is offline rn — {loadError}</p>
          ) : visible.length === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed border-cream/60 p-10 text-center text-cream">
              <p className="font-display text-3xl font-extrabold">empty… for now</p>
              <p className="mt-2 font-serif text-xl italic">
                {phase === "before" ? "be the first to post a getting-ready selfie" : "the after-party pics land here once the diyas are lit"}
              </p>
            </div>
          ) : (
            <div className="columns-2 gap-5 md:columns-3">
              <AnimatePresence>
                {visible.map((p, i) => (
                  <Polaroid key={p.id} photo={p} index={i} onOpen={() => setOpen(p)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-plum/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.caption || `Photo by ${open.uploader}`}
          >
            <motion.figure
              initial={{ scale: 0.8, rotate: -6, y: 40 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.8, rotate: 6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-3xl rounded-md bg-paper p-4 pb-5 text-plum"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.url} alt={open.caption || `Photo by ${open.uploader}`} className="max-h-[75svh] w-auto rounded-sm object-contain" />
              <figcaption className="mt-3 flex items-end justify-between gap-4">
                <div>
                  {open.caption && <p className="font-script text-3xl leading-tight">{open.caption}</p>}
                  <p className="text-xs font-bold uppercase tracking-wider text-plum/60">
                    {open.uploader} · {open.phase} the party · {timeAgo(open.createdAt)}
                  </p>
                </div>
                <button onClick={() => setOpen(null)} className="rounded-full bg-plum px-4 py-2 text-sm font-bold text-cream">
                  close ✕
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
