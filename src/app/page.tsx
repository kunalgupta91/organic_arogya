import { SITE_CONFIG } from "@/constants/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-primary-600 font-sans text-sm tracking-[0.2em] uppercase">
        {SITE_CONFIG.sanskritTagline}
      </p>
      <h1 className="text-primary-900 font-display text-4xl sm:text-6xl">
        {SITE_CONFIG.name}
      </h1>
      <p className="text-muted-foreground max-w-xl">{SITE_CONFIG.description}</p>
      <p className="text-muted-foreground mt-8 text-sm">
        Storefront under construction — Phase 1 scaffold.
      </p>
    </main>
  );
}
