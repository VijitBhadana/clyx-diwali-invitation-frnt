// Everything guests read about the day lives here — edit this file to change the invite.

export const EVENT = {
  name: "Diwali Day Out",
  host: "The Clyx Fam",
  dateLabel: "Sun 1 – Mon 2 November 2026",
  shortDate: "01.11.26",
  // Entry opens on the evening of 1 Nov, IST
  startsAt: "2026-11-01T18:00:00+05:30",
  timeLabel: "Entry 6 PM, 1 Nov — wraps up 2 Nov",
  // Exact spot gets announced soon — update venue, address and mapsUrl then
  venue: "Somewhere in Delhi",
  address: "Exact location dropping very soon",
  mapsUrl: "https://maps.google.com/?q=New+Delhi",
  contact: { name: "Clyx Fam", phone: "+91 96714 30111" },
  dressCode: "Festive Brights",
};

export type ScheduleItem = {
  time: string;
  title: string;
  emoji: string;
  blurb: string;
  tag: string;
};

export const SCHEDULE: ScheduleItem[] = [
  { time: "5:00 PM", title: "Glow Up Hour", emoji: "💅", blurb: "Mehendi, outfit change, chaos at the mirror before you head out. Wear the fit you locked in on this site.", tag: "getting ready" },
  { time: "6:00 PM", title: "Entry & Rangoli", emoji: "🎨", blurb: "Doors open. Adrak chai, hugs at the gate and a full-on rangoli face-off at the entrance. Teams get picked on the spot.", tag: "competitive era" },
  { time: "7:00 PM", title: "Diya Drop", emoji: "🪔", blurb: "Everyone lights diyas together. We're going for 101 flames across the whole place.", tag: "the moment" },
  { time: "7:30 PM", title: "Lakshmi Puja", emoji: "🌸", blurb: "Aarti, prasad and a few quiet minutes. Phones down for this one, please.", tag: "sacred" },
  { time: "8:30 PM", title: "Phuljhadi Fest", emoji: "✨", blurb: "Green crackers and sparklers, plus a long-exposure photo booth for light-writing.", tag: "sparkle szn" },
  { time: "9:30 PM", title: "Dinner Ka Scene", emoji: "🍽️", blurb: "Puri, chole, biryani, dal makhani and a dessert table that has no business being this big. Seconds are encouraged, thirds are respected.", tag: "food coma" },
  { time: "11:00 PM", title: "Taash Tournament", emoji: "🃏", blurb: "Teen patti with play money only. The winner gets bragging rights and the last gulab jamun.", tag: "high stakes (fake)" },
  { time: "12:30 AM", title: "Dhol & Dance", emoji: "🥁", blurb: "The dhol arrives, then a DJ set till late. Bollywood bangers only, no skipping.", tag: "till we drop" },
  { time: "3:00 AM", title: "Mithai Lab", emoji: "🍬", blurb: "Midnight munchies: besan ladoos and at least one burnt batch of kaju katli. Taste-testing is mandatory.", tag: "sugar rush" },
  { time: "6:30 AM", title: "Sunrise Chai", emoji: "☕", blurb: "Whoever's still standing catches the 2 Nov sunrise with adrak chai and leftover mithai. Then we wrap.", tag: "survivors only" },
];

export const MARQUEE_WORDS = [
  "diya drop",
  "mithai mode",
  "phuljhadi szn",
  "rangoli wars",
  "no beige allowed",
  "taash night",
  "glow up hour",
  "dhol till late",
];
