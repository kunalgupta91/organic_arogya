# Organic Arogya — E-commerce Platform

Premium Ayurvedic wellness storefront and admin platform.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Forms/validation:** React Hook Form + Zod
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** Auth.js (NextAuth v5) — credentials + Google OAuth, role-based
- **Media:** Cloudinary (images + PDFs)
- **Email:** Resend
- **Payments:** Razorpay (live), Stripe (adapter wired, dormant)
- **Testing:** Vitest (unit), Playwright (e2e)

## Getting started

```bash
npm install
cp .env.example .env   # fill in the values — see comments in the file
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                | Purpose                                   |
| --------------------- | ------------------------------------------ |
| `npm run dev`         | Start dev server                           |
| `npm run build`       | Production build                           |
| `npm run start`       | Start production server                    |
| `npm run lint`        | ESLint                                     |
| `npm run typecheck`   | TypeScript, no emit                        |
| `npm run format`      | Prettier write                             |
| `npm run test`        | Vitest unit tests                          |
| `npm run test:e2e`    | Playwright end-to-end tests                |
| `npm run db:migrate`  | Run Prisma migrations (dev)                |
| `npm run db:seed`     | Seed the database from `prisma/seed.ts`    |
| `npm run db:studio`   | Open Prisma Studio                         |

## Project structure

```
src/
  app/            # Routes (App Router): storefront, admin, api
  components/     # ui/ (primitives), layout/, shared/
  hooks/          # Reusable React hooks
  lib/            # Cross-cutting clients (db, auth, cloudinary, resend, razorpay, env)
  services/       # Business logic (product, order, cart, bulk-order, etc.)
  store/          # Client state (Zustand — cart, wishlist)
  types/          # Shared TypeScript types
  constants/      # Site config, enums
  validations/    # Zod schemas
prisma/
  schema.prisma   # Database schema
  seed.ts         # Seed script (reads Product_Description.xlsx)
e2e/              # Playwright tests
```

See `DEPLOYMENT.md` (added in the deployment-prep phase) for production setup.
