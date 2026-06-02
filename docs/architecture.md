# Jain Jewellers Architecture

## Workspace

- `apps/mobile`: Expo React Native customer app.
- `apps/admin`: React web admin panel.
- `services/api`: Node.js and Express REST API.
- `packages/shared`: Shared brand constants, types, seed data and price calculation.
- `apps/prototype`: Original static prototype.

## Pricing Rule

All surfaces must call the shared pricing function:

```ts
Price = (Net Weight * Today's metal rate per gram) + Making Charges + Labour + 3% GST
```

For gold:

- 24K products use `rate24k`
- 22K products use `rate22k`
- 20K products use `rate20k`
- 18K products use `rate18k`

For silver:

- 925 silver products use `silverRate`

## Production Integrations

- Firebase Auth: OTP, Google and Apple login.
- PostgreSQL: transactional source of truth.
- Redis: gold-rate cache and short-lived session workflow data.
- Razorpay: UPI, card, net banking, EMI and payment webhooks.
- Google Maps: showroom locator and directions.
- FCM: push notifications.
- Cloudinary or S3: product, exchange and try-on images.
- Gold API: bullion feed with manual admin override.
- AR try-on: Expo Camera first, third-party SDK such as Banuba when ready.

## Suggested Build Order

1. Auth and profile setup.
2. Gold rate API and admin rate management.
3. Catalogue and product detail.
4. Cart and checkout.
5. Orders and invoices.
6. Saving schemes.
7. Wishlist and price alerts.
8. Showrooms and appointments.
9. Loyalty.
10. AR try-on and after-sales services.
