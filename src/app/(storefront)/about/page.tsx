import type { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = {
  title: "About Us",
};

const PILLARS = [
  "Potency Disclosure",
  "Sustainable Practices",
  "Artisanal Craftsmanship",
  "Innovation with Experience",
  "Holistic Wellness Approach",
  "Focused on Preventive Health",
  "Organic Ingredients & Products",
  "Scientific and Ayurvedic Synergy",
  "Quality Assurance and Traceability",
  "Fair Trade Partnerships with Farmers & Tribes",
  "Community Empowerment and Sustainable Development",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase">
        {SITE_CONFIG.sanskritTagline}
      </p>
      <h1 className="font-display text-primary-900 mt-3 text-3xl sm:text-4xl">Our Story</h1>

      <p className="text-foreground mt-8 text-lg leading-relaxed">
        Organic Arogya is devoted to harnessing nature&apos;s healing power to elevate well-being
        for all. Our journey began in the fertile lands of rural India, where we blend ancient
        Ayurvedic wisdom with modern science to craft premium, plant-based wellness products.
      </p>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Founded by a dedicated herbalist with over 25 years of expertise in herbs cultivation,
        naturopathy, yogic sciences, and Ayurvedic nutrition, Organic Arogya is driven by a
        commitment to making Ayurveda accessible. Each product reflects meticulous research and
        craftsmanship, designed to promote holistic health and vitality.
      </p>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        We believe in sustainability and ethical sourcing. Our ingredients are carefully selected
        to ensure the highest quality, respecting both nature and the environment. By combining
        traditional practices with innovative techniques, we aim to empower individuals in their
        pursuit of healthier living.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="bg-primary-50 rounded-xl p-6">
          <p className="text-primary-700 text-sm font-semibold tracking-wide uppercase">Vision</p>
          <p className="font-display text-primary-900 mt-2 text-xl">
            A healthier world nurtured by nature&apos;s purity.
          </p>
        </div>
        <div className="bg-accent-50 rounded-xl p-6">
          <p className="text-accent-700 text-sm font-semibold tracking-wide uppercase">Mission</p>
          <p className="font-display text-primary-900 mt-2 text-xl">
            Empowering wellness through botanical goodness.
          </p>
        </div>
      </div>

      <h2 className="font-display text-primary-900 mt-16 text-2xl">What Sets Us Apart</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <li key={pillar} className="border-border flex items-start gap-2 rounded-lg border p-3 text-sm">
            <span className="bg-primary-500 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            {pillar}
          </li>
        ))}
      </ul>
    </div>
  );
}
