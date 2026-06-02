CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  city TEXT,
  dob DATE,
  anniversary DATE,
  loyalty_tier TEXT NOT NULL DEFAULT 'Silver',
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  metal TEXT NOT NULL,
  purity_kt INTEGER NOT NULL,
  gross_weight NUMERIC(10, 3) NOT NULL,
  net_weight NUMERIC(10, 3) NOT NULL,
  making_charge_pct NUMERIC(6, 2) NOT NULL,
  stone_details TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  stock_qty INTEGER NOT NULL DEFAULT 0,
  hallmark_id TEXT NOT NULL,
  collection_name TEXT,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  popularity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'placed',
  address_id UUID,
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_type TEXT NOT NULL,
  monthly_amount NUMERIC(12, 2) NOT NULL,
  installments_paid INTEGER NOT NULL DEFAULT 0,
  maturity_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE showrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gold_rates (
  city TEXT NOT NULL,
  date DATE NOT NULL,
  rate_22k NUMERIC(12, 2) NOT NULL,
  rate_24k NUMERIC(12, 2) NOT NULL,
  rate_20k NUMERIC(12, 2) NOT NULL,
  rate_18k NUMERIC(12, 2) NOT NULL,
  silver_rate NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (city, date)
);

CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  transaction_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
