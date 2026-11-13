import { Charging } from "@/components/home/Charging";
import { City } from "@/components/home/City";
import { Discovery } from "@/components/home/Discovery";
import { Engineering } from "@/components/home/Engineering";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Showroom } from "@/components/home/Showroom";
import { HomeMotion } from "@/components/motion/HomeMotion";
import { Support } from "@/components/home/Support";

/**
 * Home: Entrance → Discovery → Showroom → Engineering → Charging → City → Support → Final CTA.
 * The server HTML is the complete, final page. <HomeMotion /> layers the Phase 4 animation on top.
 * Light studio → dark lab → light city, per the approved direction.
 */
export default function HomePage() {
  return (
    <>
      {/* First, so on unmount its cleanup runs before any section node is removed */}
      <HomeMotion />
      <Hero />
      <Discovery />
      <Showroom />
      <Engineering />
      <Charging />
      <City />
      <Support />
      <FinalCta />
    </>
  );
}
