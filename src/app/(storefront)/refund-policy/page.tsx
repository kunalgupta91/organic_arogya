import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy">
      <p>Last updated: [DATE]</p>

      <h2>Eligibility for Returns</h2>
      <ul>
        <li>Items must be reported within [X] days of delivery.</li>
        <li>
          Due to the consumable nature of our products, we can only accept returns for items
          that arrive damaged, defective, or incorrect.
        </li>
        <li>Opened consumable products are not eligible for return unless defective.</li>
      </ul>

      <h2>How to Request a Refund</h2>
      <p>
        Contact us at {SITE_CONFIG.email} with your order number and photos of the issue. Our
        team will review and respond within [X] business days.
      </p>

      <h2>Refund Processing</h2>
      <p>
        Approved refunds are issued to the original payment method within [X] business days.
        Shipping charges are [refundable/non-refundable — confirm policy].
      </p>

      <h2>Cancellations</h2>
      <p>
        Orders can be cancelled before they are shipped by contacting us or via your
        account&apos;s order history. Once shipped, an order can no longer be cancelled but may
        be eligible
        for return per the policy above.
      </p>

      <p className="text-muted-foreground">
        [LEGAL REVIEW REQUIRED] — confirm specific timeframes and any consumer-protection
        requirements that apply in each country {SITE_CONFIG.name} ships to.
      </p>
    </LegalPage>
  );
}
