import type { OutfitType } from "./api";

export const OUTFITS: { id: OutfitType; label: string; emoji: string }[] = [
  { id: "lehenga", label: "Lehenga", emoji: "💃" },
  { id: "saree", label: "Saree", emoji: "🥻" },
  { id: "anarkali", label: "Anarkali", emoji: "🌸" },
  { id: "sharara", label: "Sharara", emoji: "✨" },
  { id: "kurta", label: "Kurta", emoji: "🕺" },
  { id: "sherwani", label: "Sherwani", emoji: "👑" },
  { id: "nehru-jacket", label: "Nehru Jacket", emoji: "🧥" },
  { id: "indo-western", label: "Indo-Western", emoji: "😎" },
];

export const COLORS = [
  { name: "Rani Pink", hex: "#ff2e93" },
  { name: "Genda Marigold", hex: "#ffb627" },
  { name: "Sindoor Red", hex: "#e3173e" },
  { name: "Jamuni Purple", hex: "#7b2cbf" },
  { name: "Kesari Orange", hex: "#ff6b1a" },
  { name: "Mor Teal", hex: "#0fa3a3" },
  { name: "Mehendi Green", hex: "#5a9e2f" },
  { name: "Haldi Yellow", hex: "#ffd60a" },
  { name: "Midnight Navy", hex: "#1d2b64" },
  { name: "Gulabi Blush", hex: "#ffb3c7" },
];

export const ACCENTS = [
  { name: "Zari Gold", hex: "#f5c542" },
  { name: "Chandi Silver", hex: "#d9dde3" },
  { name: "Moti White", hex: "#fff8ec" },
  { name: "Kaala Black", hex: "#1a1a1a" },
  { name: "Copper", hex: "#c8693a" },
];

export const VIBES = ["main character", "royal af", "comfy era", "chaotic good", "minimal icon", "sparkle overload"];

export const colorName = (hex: string) =>
  [...COLORS, ...ACCENTS].find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;

export const outfitLabel = (id: string) => OUTFITS.find((o) => o.id === id)?.label ?? id;
