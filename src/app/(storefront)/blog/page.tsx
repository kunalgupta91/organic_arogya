import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Ayurveda Blog",
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Health & Ayurveda Blog</h1>
      <p className="text-muted-foreground mt-3">
        Our blog is launching in an upcoming build phase — check back soon for Ayurvedic health
        tips and articles.
      </p>
    </div>
  );
}
