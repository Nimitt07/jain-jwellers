# Jain Jewellers

**Pure. Trusted. Timeless.**

Production-oriented monorepo for a premium Indian jewellery e-commerce and store management platform inspired by the full feature set of Malabar Gold & Diamonds.

## Workspace

- `apps/mobile` - Expo React Native customer app.
- `apps/admin` - React web admin panel.
- `services/api` - Node.js and Express REST API.
- `packages/shared` - Shared brand system, types, seed data and dynamic pricing logic.
- `apps/prototype` - Previous static prototype kept as a visual/reference demo.
- `docs` - Architecture notes and PostgreSQL schema.

## Core Pricing Rule

All gold and silver prices are calculated from shared code:

```ts
Price = (Net Weight * Today's Rate per gram) + Making Charges + Labour + 3% GST
```

The shared implementation lives in `packages/shared/src/pricing.ts`.

## Target Stack

- Mobile: React Native with Expo
- Admin: React and Vite
- Backend: Node.js and Express REST API
- Database: PostgreSQL
- Cache: Redis
- Auth: Firebase Auth
- Payments: Razorpay
- Maps: Google Maps SDK
- Notifications: Firebase Cloud Messaging
- Images: Cloudinary or AWS S3
- Gold feed: GoldAPI or bullion-rate provider with admin override
- AR try-on: Expo Camera first, Banuba or similar SDK later

## Run After Installing Dependencies

```powershell
npm install
npm run dev:api
npm run dev:admin
npm run dev:mobile
```

Copy `services/api/.env.example` to `services/api/.env` before running the API.

On Windows PowerShell, use `npm.cmd` if `npm` is blocked by execution policy.

Quick admin start:

```powershell
.\start-admin.bat
```

Admin URL:

```text
http://127.0.0.1:5174
```

Demo admin login:

```text
Mobile: 9876543210
Password: admin@123
```

Any other 10 digit mobile number with a 4+ character password can log in as a read-only viewer. Viewers can see every module but cannot create, edit, delete, reset data, save rates, or place orders.

## Module Workflow

Build one module at a time:

1. Auth and profile setup
2. Gold rate API and admin rate management
3. Catalogue and product detail
4. Cart and checkout
5. Orders and invoices
6. Saving schemes
7. Wishlist and price alerts
8. Showrooms and appointments
9. Loyalty program
10. AR try-on and after-sales services

## Current Status

Scaffold is complete:

- Expo app shell with bottom tabs
- Admin panel shell with management modules
- Express API shell with health, catalogue and gold-rate routes
- PostgreSQL schema draft
- Shared dynamic price calculator
