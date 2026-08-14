import Link from "next/link";
import { LayoutDashboard, Search, ShoppingBag, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { SITE_CONFIG } from "@/constants/site";
import { getCartItemCount } from "@/services/cart-service";
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
  const cartCount = await getCartItemCount();

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
          {(session?.user?.role === "ADMIN" || session?.user?.role === "STAFF") && (
            <Link
              href="/admin"
              className="text-foreground hover:text-primary-600 hidden p-1.5 sm:block"
              aria-label="Admin dashboard"
            >
              <LayoutDashboard size={20} />
            </Link>
          )}
          <Link
            href={session?.user ? "/account" : "/login"}
            className="text-foreground hover:text-primary-600 p-1.5"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
          <Link
            href="/cart"
            className="text-foreground hover:text-primary-600 relative p-1.5"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="bg-accent-500 absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
