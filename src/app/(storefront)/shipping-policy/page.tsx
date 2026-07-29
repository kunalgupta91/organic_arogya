import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping Policy">
      <p>Last updated: [DATE]</p>

      <h2>Domestic Shipping (India)</h2>
      <p>
        Orders are typically processed within [X] business days and delivered within [X-X]
        business days depending on location. Shipping rates are calculated at checkout based on
        order value and destination.
      </p>

      <h2>International Shipping</h2>
      <p>
        We ship to select international destinations. International orders may be subject to
        customs duties and import taxes, which are the responsibility of the customer.
        Delivery times vary by destination, typically [X-X] business days.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, you&apos;ll receive a tracking link by email. You can also view
        shipment status from your account&apos;s order history.
      </p>

      <h2>Delays</h2>
      <p>
        {SITE_CONFIG.name} is not responsible for delays caused by customs processing, weather,
        or courier disruptions, but we&apos;ll do our best to keep you informed.
      </p>

      <p className="text-muted-foreground">
        [LEGAL REVIEW REQUIRED] — confirm actual carrier partners, delivery timeframes, and
        customs/duties language for each destination country before publishing live rates.
      </p>
    </LegalPage>
  );
}
