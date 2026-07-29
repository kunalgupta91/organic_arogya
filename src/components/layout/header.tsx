import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { SITE_CONFIG } from "@/constants/site";
import { MobileNav } from "./mobile-nav";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const session = await auth();

  return (
    <header className="border-border sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-primary-900 shrink-0 text-xl">
          {SITE_CONFIG.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary-600 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form action="/products" className="hidden max-w-xs flex-1 items-center md:flex">
          <div className="border-border focus-within:border-primary-500 flex w-full items-center gap-2 rounded-full border px-3 py-1.5">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              type="search"
              name="search"
              placeholder="Search products…"
              className="w-full text-sm outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <Link
            href={session?.user ? "/account" : "/login"}
            className="text-foreground hover:text-primary-600 p-1.5"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
          <Link
            href="/cart"
            className="text-foreground hover:text-primary-600 p-1.5"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
