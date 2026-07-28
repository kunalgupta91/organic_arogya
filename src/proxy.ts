import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ADMIN_ROLES = new Set(["ADMIN", "STAFF"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminArea) {
    const isAuthorized = isLoggedIn && ADMIN_ROLES.has(req.auth!.user.role);
    if (!isAuthorized) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = new URL("/login", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/account") && !isLoggedIn) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*"],
};
