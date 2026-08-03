import { headers } from "next/headers";

/** Best-effort client identifier for rate limiting (Vercel sets x-forwarded-for). */
export async function getClientIp() {
  const store = await headers();
  const forwardedFor = store.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return store.get("x-real-ip") ?? "unknown";
}
