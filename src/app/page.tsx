import { Charging } from "@/components/home/Charging";
import { City } from "@/components/home/City";
import { Discovery } from "@/components/home/Discovery";
import { Engineering } from "@/components/home/Engineering";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Showroom } from "@/components/home/Showroom";
import { Support } from "@/components/home/Support";

/**
 * Home: Entrance → Discovery → Showroom → Engineering → Charging → City → Support → Final CTA.
 * Phase 3: fully laid out and finished WITHOUT motion. Phase 4 layers the animation on top.
 * Light studio → dark lab → light city, per the approved direction.
 */
export default function HomePage() {
  return (
    <>
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
