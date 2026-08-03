/**
 * In-memory sliding-window rate limiter. Good enough for a single-instance
 * deployment; on a horizontally-scaled/serverless deployment (e.g. Vercel
 * with concurrent isolates) each instance has its own counters, so this is
 * a best-effort throttle rather than a hard global guarantee. Swap for
 * Vercel KV / Upstash Redis if that ever matters for this app.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Prevent unbounded memory growth from one-off keys (e.g. per-IP) piling up.
const MAX_BUCKETS = 50_000;

export class RateLimitError extends Error {
  constructor(public retryAfterMs: number) {
    super("Too many requests. Please try again later.");
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    throw new RateLimitError(existing.resetAt - now);
  }

  existing.count++;
}
