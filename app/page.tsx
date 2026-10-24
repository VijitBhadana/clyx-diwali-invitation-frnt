import CursorGlow from "@/components/CursorGlow";
import DayPlan from "@/components/DayPlan";
import DressPicker from "@/components/DressPicker";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InviteCard from "@/components/InviteCard";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import PhotoWall from "@/components/PhotoWall";
import Preloader from "@/components/Preloader";
import Rsvp from "@/components/Rsvp";

export default function Home() {
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <InviteCard />
        <DayPlan />
        <DressPicker />
        <PhotoWall />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}
