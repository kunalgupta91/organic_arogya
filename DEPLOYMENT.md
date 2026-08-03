# Deployment Guide

This app is code-complete and deploy-ready, but **going live requires you to
create accounts with the external services below and supply real API
keys** — nothing here is done automatically, since these are your accounts
and credentials.

## 1. Accounts you'll need

| Service | Purpose | Get keys at |
|---|---|---|
| [Neon](https://neon.tech) | Production Postgres database | Project → Connection string |
| [Cloudinary](https://cloudinary.com) | Product images, PDFs, blog images | Console → API Environment variable |
| [Resend](https://resend.com) | Transactional email (orders, password reset, notifications) | API Keys — verify your sending domain first |
| [Razorpay](https://dashboard.razorpay.com) | Payments (India: UPI/cards/netbanking/wallets) | Settings → API Keys, and Settings → Webhooks |
| [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | "Sign in with Google" | OAuth 2.0 Client ID (Web application) |
| [Vercel](https://vercel.com) | Hosting (recommended path) | — |

Copy `.env.example` to `.env` and fill in each value as you create these
accounts. See the comments in that file for where to find each key.

## 2. Deploying to Vercel (recommended)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel: **New Project** → import the repo. Vercel auto-detects
   Next.js — no build configuration needed.
3. Under **Environment Variables**, add every variable from `.env.example`
   with your real values (do this for Production, and again for Preview if
   you want preview deployments to work — you can point Preview at a
   separate Neon branch).
4. For `AUTH_URL` / `NEXT_PUBLIC_SITE_URL`, use your actual Vercel domain
   (e.g. `https://www.organicarogya.com` once your custom domain is
   attached, or the `*.vercel.app` URL in the meantime).
5. Deploy. Vercel builds and serves the app; `output: "standalone"` in
   `next.config.ts` is harmless here — Vercel packages the app its own way
   regardless.
6. **Apply the database schema** (one-time, and again after any future
   schema change) — from your local machine or CI, with `DATABASE_URL`
   pointed at your real Neon database:
   ```bash
   npm run db:deploy   # prisma migrate deploy — applies prisma/migrations/
   npm run db:seed     # optional: seeds categories, admin user, 36 real
                        # products (as DRAFT), general FAQs, shipping rules
   ```
7. Point your domain's DNS at Vercel (Vercel walks you through this when
   you add a custom domain in the project settings).

### Razorpay webhook

In the Razorpay Dashboard → Settings → Webhooks, add an endpoint pointing
to `https://<your-domain>/api/webhooks/razorpay`, subscribe to the
`payment.captured` event, and set the webhook secret as
`RAZORPAY_WEBHOOK_SECRET`. This is a backup confirmation path (the primary
one is client-side, right after checkout) — both are idempotent and safe
to have both configured.

### Google OAuth redirect URI

In Google Cloud Console, add
`https://<your-domain>/api/auth/callback/google` as an authorized redirect
URI on your OAuth client.

## 3. Docker / self-hosted deployment

For hosting outside Vercel (a VPS, your own Kubernetes, etc.):

```bash
# Build (NEXT_PUBLIC_* vars are baked into the client bundle at build
# time, so they must be real values here, not placeholders):
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  --build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx \
  -t organic-arogya .

# Or bring up the app + a self-hosted Postgres together:
docker compose up -d --build
```

Notes:

- The image does **not** include the `prisma` CLI or `prisma/` folder —
  Next's standalone output only bundles what the running server needs.
  Run migrations as a separate step, from a machine with the full
  `node_modules` and `DATABASE_URL` pointed at your production database:
  `npm run db:deploy`.
- All other runtime secrets (`DATABASE_URL`, `AUTH_SECRET`,
  `CLOUDINARY_*`, `RESEND_API_KEY`, `RAZORPAY_*`, etc.) are read at
  **runtime**, not baked into the image — pass them via `docker-compose`'s
  `env_file: .env` (already configured) or your platform's secret
  manager. Only the two `NEXT_PUBLIC_*` vars need to be build args.
- `docker-compose.yml`'s Postgres container is for self-hosting; if you're
  using Neon in production instead, skip the `db` service and point
  `DATABASE_URL` at Neon directly.

## 4. Post-deploy checklist

These are things the code deliberately leaves for you to review before
customers see them — not omissions, but decisions that shouldn't be made
silently by an AI:

- [ ] **Products**: all 36 real products are seeded as `status: DRAFT`
      with `[NEEDS REVIEW]` placeholders in dosage/precautions/side
      effects/age group (medical claims, not invented). Have a qualified
      Ayurvedic practitioner review and fill these in per product before
      publishing (`/admin/products`).
- [ ] **Product photography**: only 13 of 36 products had finished
      photography available when the catalog was seeded; the rest use a
      placeholder image. Upload real photos via the product edit form.
- [ ] **Legal pages**: Privacy Policy, Terms & Conditions, Refund Policy,
      and Shipping Policy are generic placeholder templates explicitly
      marked `[LEGAL REVIEW REQUIRED]`. Have a lawyer review and finalize
      these — they cover multiple jurisdictions given the global ambition,
      which needs real legal judgment, not a template.
- [ ] **GST rate**: products default to 5% GST as a placeholder; confirm
      the correct HSN/GST classification for each product line with your
      accountant.
- [ ] **Shipping rates**: seeded with placeholder flat rates
      (`prisma/seed.ts`) — set real domestic/international rates via
      `/admin` once you know your actual shipping costs (there's no
      shipping-rules admin UI yet; edit via Prisma Studio — `npm run
      db:studio` — or extend the admin like the other CRUD modules).
- [ ] **Email sending domain**: verify your domain in Resend so
      `no-reply@organicarogya.com` actually delivers.
- [ ] **Razorpay test → live**: test the full checkout flow with Razorpay
      test keys first, then switch to live keys once satisfied.
- [ ] **Change the seed admin password** (`SEED_ADMIN_PASSWORD`) — it's a
      known default in `.env.example`.
- [ ] **International/USD checkout**: only Razorpay/INR is wired up.
      Non-India addresses currently see a "coming soon" message at
      checkout — Stripe would need to be implemented against the existing
      `PaymentProvider` interface (`src/lib/payment-provider.ts`) before
      international orders can actually be placed.

## 5. Environment variable reference

See `.env.example` for the full list with inline documentation. Required
vs. optional:

- **Required to run at all**: `DATABASE_URL`, `AUTH_SECRET`
- **Required for image/PDF uploads**: `CLOUDINARY_*`
- **Required for transactional email**: `RESEND_API_KEY`,
  `ORDER_NOTIFICATION_EMAIL`
- **Required for checkout**: `RAZORPAY_*`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- **Optional**: `AUTH_GOOGLE_ID`/`SECRET` (Google sign-in — credentials
  login works without it), `STRIPE_*` (dormant, no live effect yet)
