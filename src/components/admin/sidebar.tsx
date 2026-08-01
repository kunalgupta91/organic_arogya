"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/constants/site";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/users", label: "Users" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border flex w-60 shrink-0 flex-col border-r bg-white">
      <div className="border-border border-b px-6 py-5">
        <Link href="/admin" className="font-display text-primary-900 text-lg">
          {SITE_CONFIG.name}
        </Link>
        <p className="text-muted-foreground text-xs">Admin</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
