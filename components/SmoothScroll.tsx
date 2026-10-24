"use client";

import { cancelFrame, frame, type FrameData } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";

let lenis: Lenis | null = null;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/** Pauses page scrolling while a modal / preloader is on screen. */
export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Freeze the looping CSS animations (sparkles, flames, shimmer…) of sections that are off screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-offscreen", !e.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
    document.querySelectorAll("main > section, footer").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis = instance;

    // Drive Lenis from framer-motion's frame loop so scroll position and scroll-linked transforms update in the same frame
    const update = ({ timestamp }: FrameData) => instance.raf(timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
