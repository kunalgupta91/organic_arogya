"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/constants/site";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/reviews", label: "Reviews" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/bulk-orders", label: "Bulk Orders" },
      { href: "/admin/coupons", label: "Coupons" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/faqs", label: "FAQs" },
      { href: "/admin/banners", label: "Banners" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users", label: "Users" },
      { href: "/admin/audit-log", label: "Audit Log" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border flex w-60 shrink-0 flex-col overflow-y-auto border-r bg-white">
      <div className="border-border border-b px-6 py-5">
        <Link href="/admin" className="font-display text-primary-900 text-lg">
          {SITE_CONFIG.name}
        </Link>
        <p className="text-muted-foreground text-xs">Admin</p>
      </div>
      <nav className="flex-1 space-y-4 p-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-muted-foreground px-3 pb-1 text-[10px] font-semibold tracking-wider uppercase">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
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
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
