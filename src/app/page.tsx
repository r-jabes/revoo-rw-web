import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { assets } from "@/data/assets";

/**
 * PHASE 2 FOUNDATION HOME: intentionally minimal.
 * The full cinematic homepage is built in Phase 3 (static) and Phase 4 (motion).
 */
export default function HomePage() {
  return (
    <section
      data-header-theme="light"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[radial-gradient(120%_80%_at_50%_100%,var(--color-mist),var(--color-paper)_70%)] pb-14 pt-32"
    >
      <div className="container-x relative z-10">
        <p className="t-label mb-5 text-[color:var(--accent-text)]">Design concept · Foundation build</p>
        <h1 className="t-display t-mega">
          The future
          <br />
          doesn&apos;t wait.
        </h1>
        <p className="t-lead mt-6">Discover a smarter way to move.</p>
      </div>
      <div className="pointer-events-none relative z-0 mx-auto mt-6 w-[min(92vw,1100px)]">
        <Picture asset={assets.models.a12.side} priority sizes="(min-width:1100px) 1100px, 92vw" />
      </div>
      <div className="container-x relative z-10 mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/range">Explore the range</ButtonLink>
        <ButtonLink href="/contact#test-ride" variant="outline">
          Find your REVOO
        </ButtonLink>
      </div>
    </section>
  );
}
