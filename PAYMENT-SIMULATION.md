# Payment simulation for the portfolio

This project demonstrates authenticated checkout, database price snapshots, a signed server-side payment notification, and an order confirmation page. It does not connect to a bank or an external payment processor and cannot charge a card. No card information is collected.

The original course specified Stripe Checkout. For this portfolio version, payment is simulated because a Saudi-based Stripe merchant account was unavailable during setup. This implements the order/payment workflow concepts; it is **not** a claim that Stripe Checkout or an external provider webhook has been tested.

## Try it

Sign up or sign in, select dish quantities, and click **Order now**. The simulation page lets you choose approval or decline. A declined simulation leaves the order pending and can be retried. Approval returns to a confirmation page labeled **Paid (simulation)**. Cancel returns to the menu without marking the order paid.

## Local setup

Install Node 22 or later and run `npm install` from the repository root. Configure the existing `server/.env` database and Better Auth variables using `server/.env.example`. No payment account, payment API keys, or CLI are required.

```text
npm run db:setup --workspace server
npm run db:seed --workspace server
npm run dev:server
npm run dev
```

Run the last two commands in separate terminals. `CLIENT_ORIGIN` and `BETTER_AUTH_URL` should both be `http://localhost:5173` locally.

## How it works

1. `POST /api/checkout` requires a real Better Auth session and the correct origin. It accepts dish IDs and quantities, reads prices from PostgreSQL, then writes `orders` and `"orderItems"` together in a transaction. The order stays pending. A random checkout session ID is saved in the order.
2. The local `/checkout/simulation` page loads only the signed-in user's order. It does not ask for a card.
3. `POST /api/payments/simulate` requires the same authentication, origin, and ownership checks. It reads the saved amount/session from PostgreSQL. Approval produces an HMAC-signed event and sends an actual HTTP POST from the server to `/api/payments/webhook`. The signing key is derived from the existing server-only auth secret with a separate payment-specific context.
4. Only `POST /api/payments/webhook` can mark an order paid. It verifies the raw body signature and a five-minute timestamp window, then matches the order, session, owner, amount, currency, and simulation provider. Duplicate delivery preserves the first confirmation timestamp and event ID.
5. `GET /api/orders/:id` is owner-only and read-only. The success page polls it for up to 30 seconds and offers **Check again** if confirmation is delayed. URL parameters cannot grant paid status.

If HTTP delivery or PostgreSQL is unavailable, the simulation reports a retryable error and cannot invent a successful confirmation. The visitor can retry approval. There is no durable external delivery queue, automatic processor retry system, settlement, refund processing, or actual financial verification.

## Database

`orders` stores one purchase, linked to Better Auth's `"user"`, with status, total, currency, simulation session/event references and timestamps. `"orderItems"` stores dish IDs, name/price snapshots, and quantities. Amounts are integer halalas for SAR; existing historical USD amounts remain cents. Existing order records are preserved when the schema is upgraded; legacy provider values are accepted only for that historical data.

```sql
SELECT id, user_id, status, total_cents, currency, payment_provider, paid_at
FROM orders ORDER BY created_at DESC;
SELECT * FROM "orderItems" ORDER BY id DESC;
```

## Verification and deployment

Run `npm test --workspace server` and `npm run build`. Tests cover real PostgreSQL order/item creation and real HTTP webhook delivery, including forged/expired signatures, price tampering, ownership, declined payments and duplicate events.

Render uses the existing `render.yaml`, database URL, and auth secret. It serves React and Express from the same public origin. No Stripe/Moyasar variables are read. Run database setup before deployment. A standalone static host cannot run the Express routes or database connection.
