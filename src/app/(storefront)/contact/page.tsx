import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(SITE_CONFIG.address.office);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Contact Us</h1>
      <p className="text-muted-foreground mt-2 max-w-xl">
        Questions about our products, an order, or a bulk enquiry? We&apos;d love to hear from
        you.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="border-border overflow-hidden rounded-xl border">
            <iframe
              title="Organic Arogya location"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-primary-600 mt-0.5 shrink-0" />
              {SITE_CONFIG.address.office}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-primary-600 shrink-0" />
              {SITE_CONFIG.phones.join(" / ")}
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-primary-600 shrink-0" />
              {SITE_CONFIG.email}
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={18} className="text-primary-600 shrink-0" />
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
