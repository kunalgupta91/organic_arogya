import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Last updated: [DATE]</p>
      <p>
        This Privacy Policy describes how {SITE_CONFIG.name} (&quot;we&quot;, &quot;us&quot;)
        collects, uses, and protects your personal information when you visit or make a purchase
        from {SITE_CONFIG.url}.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Account information: name, email, phone number, password (hashed).</li>
        <li>Order information: shipping/billing address, order history, payment status.</li>
        <li>Usage data: pages visited, device/browser information, cookies.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and fulfil orders, including bulk order enquiries.</li>
        <li>To communicate order updates, respond to enquiries, and send optional newsletters.</li>
        <li>To improve our website and product offerings.</li>
        <li>To comply with legal and tax obligations.</li>
      </ul>

      <h2>Sharing of Information</h2>
      <p>
        We share information with payment processors (Razorpay, Stripe), email delivery
        providers, and shipping partners only as needed to fulfil your order. We do not sell
        your personal information.
      </p>

      <h2>International Visitors</h2>
      <p>
        [LEGAL REVIEW REQUIRED] — this section must address GDPR (EU/UK visitors), applicable
        US state privacy laws, and any other jurisdictions where {SITE_CONFIG.name} does
        business, including lawful basis for processing, data subject rights, and cross-border
        transfer mechanisms.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by
        contacting us at {SITE_CONFIG.email}.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to {SITE_CONFIG.email} or {SITE_CONFIG.address.office}.
      </p>
    </LegalPage>
  );
}
