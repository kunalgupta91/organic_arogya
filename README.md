# Organic Arogya — E-commerce Platform

Premium Ayurvedic wellness storefront and admin platform.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Forms/validation:** React Hook Form + Zod
- **Database:** PostgreSQL (Neon in production) via Prisma ORM v7 (driver adapters)
- **Auth:** Auth.js (NextAuth v5) — credentials + Google OAuth, role-based (customer/staff/admin)
- **Media:** Cloudinary (images + PDFs)
- **Email:** Resend
- **Payments:** Razorpay (live, India), Stripe (adapter interface wired, dormant — see `src/lib/payment-provider.ts`)
- **Rich text:** TipTap (blog editor) + DOMPurify (sanitized at write time)
- **Testing:** Vitest (unit), Playwright (e2e)

## What's built

**Storefront:** home, product listing with filters/pagination, product
detail (gallery, tabs, reviews with submission, related products, PDF
downloads, share buttons, JSON-LD), cart, guest/account checkout with
Razorpay, order confirmation + history, blog with comments, bulk order
enquiry form, About/Contact/FAQ + 4 legal policy pages, newsletter signup.

**Admin dashboard:** live stats, product & category CRUD (images, PDFs,
SEO, tags, related products), blog CMS (rich text editor, draft/scheduled/
published), order management, coupons, testimonials, FAQs, banners
(drives the homepage hero), bulk order requests, reviews, user role
management, audit log.

**Cross-cutting:** rate limiting on every public write path, security
headers (CSP/HSTS/etc.), audit logging on sensitive actions, accessible
star ratings and ARIA tab semantics, sitemap.xml/robots.txt/canonical
URLs/structured data.

See `docs/API.md` for the (small) public HTTP surface — most server logic
runs through Next.js Server Actions, not REST endpoints.

## Getting started

```bash
npm install
cp .env.example .env          # fill in the values — see comments in the file

# Local database (no account needed — runs Postgres on your machine):
npx prisma dev --detach       # prints a DATABASE_URL, paste it into .env
npm run db:generate
npm run db:push               # applies the schema (local dev workflow)
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with the
seed admin account (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in
`.env.example`, default `admin@organicarogya.com` / `changeme123`) to see
the admin dashboard at `/admin`.

> The local `prisma dev` server can stop in the background (e.g. after the
> machine sleeps). If you see database connection errors, just run
> `npx prisma dev --detach` again — it reuses the same data.

**Production / deployment:** see `DEPLOYMENT.md` — covers Vercel, Docker/
self-hosting, required third-party accounts, and a pre-launch checklist
(the real 36-product catalog is seeded as `DRAFT` pending content review;
legal pages are placeholders pending legal review — both are deliberate,
not oversights).

## Scripts

| Script                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start dev server                            |
| `npm run build`        | Production build                            |
| `npm run start`        | Start production server                     |
| `npm run lint`         | ESLint                                      |
| `npm run typecheck`    | TypeScript, no emit                         |
| `npm run format`       | Prettier write                              |
| `npm run test`         | Vitest unit tests                           |
| `npm run test:e2e`     | Playwright end-to-end tests                 |
| `npm run db:push`      | Sync schema to the database (local dev)     |
| `npm run db:migrate`   | Create + apply a migration (dev)            |
| `npm run db:deploy`    | Apply migrations (production/CI)            |
| `npm run db:seed`      | Seed the database from `prisma/seed.ts`     |
| `npm run db:studio`    | Open Prisma Studio                          |

## Project structure

```
src/
  app/            # Routes (App Router): (storefront)/, (auth)/, admin/, account/, api/
  components/     # ui/ (primitives), layout/, admin/, product/, home/, shared/, icons/
  lib/            # Cross-cutting clients: db, auth, cloudinary, resend, razorpay,
                  # cart, rate-limit, audit-log, sanitize-html, env
  services/       # Business logic: product, order, cart, coupon, shipping, blog, etc.
  types/          # Shared TypeScript types (Auth.js session augmentation)
  constants/      # Site config (brand info sourced from real print materials)
  validations/    # Zod schemas
prisma/
  schema.prisma   # Database schema (25+ models)
  seed.ts         # Seed script (categories, admin user, real product catalog, FAQs)
  data/products.ts    # Generated from Product_Description.xlsx — see scripts/generate-product-data.ts
e2e/              # Playwright tests
docs/API.md       # Public HTTP API surface
DEPLOYMENT.md     # Vercel/Docker deployment + pre-launch checklist
```
