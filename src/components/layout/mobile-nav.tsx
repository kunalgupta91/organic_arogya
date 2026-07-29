"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="text-foreground p-2"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav className="border-border absolute inset-x-0 top-full border-b bg-white p-4 shadow-sm">
          <ul className="space-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground block text-sm font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
