import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Great_Vibes, Instrument_Serif, Yatra_One } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { EVENT } from "@/lib/event";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const yatra = Yatra_One({ subsets: ["latin", "devanagari"], weight: "400", variable: "--font-yatra", display: "swap" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes", display: "swap" });

export const metadata: Metadata = {
  title: `${EVENT.name} — You're Invited`,
  description: `${EVENT.host} invites you to an all-day Diwali bash on ${EVENT.dateLabel}. Pick your fit, drop your pics, RSVP.`,
};

export const viewport: Viewport = {
  themeColor: "#1a0526",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${yatra.variable} ${vibes.variable}`}>
      <body className="font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
