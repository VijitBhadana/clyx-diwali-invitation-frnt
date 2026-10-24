// Everything guests read about the day lives here — edit this file to change the invite.

export const EVENT = {
  name: "Diwali Day Out",
  host: "The Clyx Fam",
  dateLabel: "Sunday, 8 November 2026",
  shortDate: "08.11.26",
  // Lakshmi Puja day, IST
  startsAt: "2026-11-08T07:30:00+05:30",
  timeLabel: "7:30 AM — till the last phuljhadi",
  venue: "The Clyx House",
  address: "221B Rangoli Lane, Hauz Khas, New Delhi",
  mapsUrl: "https://maps.google.com/?q=Hauz+Khas+New+Delhi",
  contact: { name: "Clyx Fam", phone: "+91 98765 43210" },
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
  { time: "7:30 AM", title: "Rise & Rangoli", emoji: "🎨", blurb: "Adrak chai, sleepy faces and a full-on rangoli face-off at the entrance. Teams get picked on the spot.", tag: "competitive era" },
  { time: "10:00 AM", title: "Mithai Lab", emoji: "🍬", blurb: "We roll besan ladoos and burn at least one batch of kaju katli. Taste-testing is mandatory.", tag: "sugar rush" },
  { time: "12:30 PM", title: "Thali Era", emoji: "🍛", blurb: "Puri, chole, dahi bhalle and paneer. Seconds are encouraged, thirds are respected.", tag: "food coma" },
  { time: "2:30 PM", title: "Taash Tournament", emoji: "🃏", blurb: "Teen patti with play money only. The winner gets bragging rights and the last gulab jamun.", tag: "high stakes (fake)" },
  { time: "4:30 PM", title: "Glow Up Hour", emoji: "💅", blurb: "Mehendi, outfit change, chaos at the mirror. Wear the fit you locked in on this site.", tag: "getting ready" },
  { time: "6:00 PM", title: "Diya Drop", emoji: "🪔", blurb: "Everyone lights diyas together. We're going for 101 flames across the house and terrace.", tag: "the moment" },
  { time: "7:00 PM", title: "Lakshmi Puja", emoji: "🌸", blurb: "Aarti, prasad and a few quiet minutes. Phones down for this one, please.", tag: "sacred" },
  { time: "8:00 PM", title: "Phuljhadi Fest", emoji: "✨", blurb: "Green crackers and sparklers on the terrace, plus a long-exposure photo booth for light-writing.", tag: "sparkle szn" },
  { time: "9:30 PM", title: "Dinner Ka Scene", emoji: "🍽️", blurb: "Biryani, dal makhani and a dessert table that has no business being this big.", tag: "round two" },
  { time: "11:00 PM", title: "Dhol & Dance", emoji: "🥁", blurb: "The dhol arrives, then a DJ set till late. Bollywood bangers only, no skipping.", tag: "till we drop" },
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
