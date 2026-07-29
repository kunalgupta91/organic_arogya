import { Leaf, FlaskConical, Users, Sprout, Hand } from "lucide-react";

const REASONS = [
  { icon: Users, label: "Women Empowerment" },
  { icon: FlaskConical, label: "Made with Research" },
  { icon: Sprout, label: "Supporting Farmers" },
  { icon: Leaf, label: "Ancient Ayurveda" },
  { icon: Hand, label: "Hand Picked from the Source" },
];

export function WhyOrganicArogya() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-primary-900 text-center text-2xl sm:text-3xl">
        Why Organic Arogya
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
        {REASONS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-3 text-center">
            <div className="bg-primary-50 text-primary-600 flex h-14 w-14 items-center justify-center rounded-full">
              <Icon size={24} />
            </div>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
