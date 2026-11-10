CREATE TABLE IF NOT EXISTS dishes (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('starters', 'main-dishes', 'desserts')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL,
  alt TEXT NOT NULL,
  width INTEGER NOT NULL CHECK (width > 0),
  height INTEGER NOT NULL CHECK (height > 0)
);

-- Snapshot amounts use minor units: halalas for SAR, cents for historical USD.
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  total_cents INTEGER NOT NULL CHECK (total_cents BETWEEN 50 AND 99999999),
  currency TEXT NOT NULL DEFAULT 'sar' CHECK (currency IN ('sar', 'usd')),
  payment_provider TEXT NOT NULL DEFAULT 'simulation',
  checkout_session_id UUID UNIQUE,
  payment_event_id UUID UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  CHECK ((status = 'paid') = (paid_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

CREATE TABLE IF NOT EXISTS "orderItems" (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id INTEGER NOT NULL REFERENCES dishes(id),
  dish_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  UNIQUE (order_id, dish_id)
);

-- Upgrade an existing deployment without deleting its earlier orders.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_session_id UUID UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_event_id UUID UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'simulation';
ALTER TABLE orders ALTER COLUMN payment_provider SET DEFAULT 'simulation';
ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'sar';
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_provider_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_provider_check CHECK (payment_provider IN ('simulation', 'stripe', 'moyasar'));
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_currency_check;
ALTER TABLE orders ADD CONSTRAINT orders_currency_check CHECK (currency IN ('sar', 'usd'));
