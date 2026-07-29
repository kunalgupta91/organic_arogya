import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/icons/social-icons";
import { SITE_CONFIG } from "@/constants/site";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/blog", label: "Health Blog" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

export function Footer() {
  return (
    <footer className="border-border bg-primary-900 mt-24 border-t text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg">{SITE_CONFIG.name}</p>
          <p className="mt-2 text-sm text-white/70">{SITE_CONFIG.tagline}</p>
          <div className="mt-4 flex gap-3">
            <a href={SITE_CONFIG.social.instagram} aria-label="Instagram" className="text-white/80 hover:text-white">
              <InstagramIcon size={18} />
            </a>
            <a href={SITE_CONFIG.social.facebook} aria-label="Facebook" className="text-white/80 hover:text-white">
              <FacebookIcon size={18} />
            </a>
            <a href={SITE_CONFIG.social.twitter} aria-label="Twitter" className="text-white/80 hover:text-white">
              <TwitterIcon size={18} />
            </a>
            <a href={SITE_CONFIG.social.youtube} aria-label="YouTube" className="text-white/80 hover:text-white">
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/90">Shop</p>
          <ul className="mt-3 space-y-2">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/90">Company</p>
          <ul className="mt-3 space-y-2">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/90">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {SITE_CONFIG.address.office}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              {SITE_CONFIG.phones[0]}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              {SITE_CONFIG.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-white/60 sm:flex-row sm:px-6">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
