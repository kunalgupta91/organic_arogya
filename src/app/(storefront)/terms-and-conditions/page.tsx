import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>Last updated: [DATE]</p>
      <p>
        By accessing or using {SITE_CONFIG.url}, you agree to be bound by these Terms &amp;
        Conditions.
      </p>

      <h2>Use of the Site</h2>
      <p>
        You must be at least 18 years old, or using the site under the supervision of an adult,
        to place an order. You agree to provide accurate account and order information.
      </p>

      <h2>Products &amp; Pricing</h2>
      <p>
        Product descriptions, images, and prices are subject to change without notice. We make
        reasonable efforts to display accurate pricing but reserve the right to correct errors.
      </p>

      <h2>Health Disclaimer</h2>
      <p>
        [LEGAL REVIEW REQUIRED] — Ayurvedic products are not evaluated to diagnose, treat, cure,
        or prevent any disease unless backed by appropriate regulatory approval. This section
        must be reviewed against applicable food/supplement/drug labeling regulations in every
        market {SITE_CONFIG.name} ships to (e.g. FSSAI in India, FDA/FTC guidance in the US).
      </p>

      <h2>Orders &amp; Payment</h2>
      <p>
        Orders are confirmed only after successful payment via our payment partners (Razorpay,
        Stripe). We reserve the right to cancel orders suspected of fraud or error.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this site, including text, images, and branding, is the property of{" "}
        {SITE_CONFIG.name} unless otherwise noted.
      </p>

      <h2>Governing Law</h2>
      <p>
        [LEGAL REVIEW REQUIRED] — governing law/jurisdiction clause, appropriate for a business
        based in India selling internationally.
      </p>

      <h2>Contact</h2>
      <p>{SITE_CONFIG.email}</p>
    </LegalPage>
  );
}
