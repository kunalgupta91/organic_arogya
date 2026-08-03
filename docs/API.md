# API Documentation

## A note on architecture

Most of this app's server-side logic is **not** exposed as REST endpoints.
It uses Next.js Server Actions — functions in `actions.ts` files
(e.g. `src/app/(storefront)/cart/actions.ts`) that run on the server and
are called directly from React components, without a hand-written HTTP
API layer in between. This is why you won't find routes like
`POST /api/cart` — cart, checkout, reviews, comments, bulk orders,
newsletter, and every admin CRUD module all work this way. If you need to
integrate with this app from an external system, the routes below are the
actual public HTTP surface; everything else runs through Server Actions
and isn't independently callable over HTTP by design.

## Routes

### `GET/POST /api/auth/[...nextauth]`

Handled entirely by Auth.js (NextAuth v5) — session management, OAuth
callbacks (`/api/auth/callback/google`), CSRF token issuance
(`/api/auth/csrf`), sign-in/out. See the [Auth.js documentation](https://authjs.dev)
for the full set of sub-routes this exposes; nothing here is custom.

### `POST /api/admin/upload`

Uploads an image or PDF to Cloudinary. **Admin/staff only** — the caller
must have an authenticated session with `role: ADMIN` or `role: STAFF`
(returns `401` otherwise). Rate-limited to 60 requests per 15 minutes per
user.

**Request:** `multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | File | Yes | Image: jpeg/png/webp/avif, max 10MB. PDF: max 20MB. |
| `kind` | string | Yes | `"image"` or `"pdf"` |
| `folder` | string | No | Cloudinary folder name (e.g. `products`, `blog`); defaults to `misc` |

**Response** `200`:

```json
{
  "url": "https://res.cloudinary.com/.../image.jpg",
  "publicId": "organic-arogya/products/abc123",
  "width": 1200,
  "height": 1200,
  "bytes": 245678
}
```

**Errors:** `400` invalid file type/size/malformed request, `401`
unauthorized, `429` rate limited.

### `POST /api/payments/razorpay/verify`

Verifies a Razorpay payment signature after the client-side Checkout.js
widget completes, and confirms the order. Called automatically by the
checkout flow (`src/app/(storefront)/checkout/checkout-form.tsx`) — not
meant to be called directly, but documented since it's a real endpoint.

**Request:** `application/json`

```json
{
  "orderId": "order_xxxxx",
  "paymentId": "pay_xxxxx",
  "signature": "hex-encoded HMAC signature from Razorpay"
}
```

**Response** `200`: `{ "success": true }`
**Errors:** `400` invalid request or signature verification failed, `500`
processing error.

Idempotent: safe to call more than once for the same payment (the second
call is a no-op if it's already been confirmed — see
`confirmRazorpayPayment` in `src/services/order-service.ts`).

### `POST /api/webhooks/razorpay`

Razorpay's server-to-server webhook — backup confirmation path in case the
client never calls the `verify` endpoint above (e.g. the browser closed
right after paying). Verifies the `x-razorpay-signature` header against
the raw request body using `RAZORPAY_WEBHOOK_SECRET`, then runs the same
idempotent confirmation logic as the client-side path. Configure this URL
in the Razorpay Dashboard — see `DEPLOYMENT.md`.

Not meant to be called by anything other than Razorpay's own servers.

## Sitemap & robots

- `GET /sitemap.xml` — generated from published products, blog posts,
  active categories, and static routes. Revalidates hourly; falls back to
  static routes only if the database is transiently unreachable rather
  than failing.
- `GET /robots.txt` — disallows `/admin`, `/api`, `/account`, `/checkout`,
  `/cart`; points to the sitemap above.
