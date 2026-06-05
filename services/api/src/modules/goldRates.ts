import { currentDemoRate, type GoldRate } from "@jain-jewellers/shared";
import { pool } from "../db/pool";

let cachedRate: GoldRate = currentDemoRate;
let initialized = false;

async function ensureGoldRatesTable() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_gold_rates (
      city TEXT PRIMARY KEY,
      rate_date TEXT NOT NULL,
      rate_22k NUMERIC(12, 2) NOT NULL,
      rate_24k NUMERIC(12, 2) NOT NULL,
      rate_20k NUMERIC(12, 2) NOT NULL,
      rate_18k NUMERIC(12, 2) NOT NULL,
      silver_rate NUMERIC(12, 2) NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  initialized = true;
}

function rowToGoldRate(row: Record<string, unknown>): GoldRate {
  return {
    city: String(row.city),
    date: String(row.rate_date),
    rate22k: Number(row.rate_22k),
    rate24k: Number(row.rate_24k),
    rate20k: Number(row.rate_20k),
    rate18k: Number(row.rate_18k),
    silverRate: Number(row.silver_rate)
  };
}

export async function getCurrentGoldRate(city = "Mumbai"): Promise<GoldRate> {
  await ensureGoldRatesTable();
  const result = await pool.query("SELECT * FROM admin_gold_rates WHERE city = $1", [city]);
  if (result.rows[0]) {
    cachedRate = rowToGoldRate(result.rows[0]);
    return cachedRate;
  }

  return {
    ...cachedRate,
    city
  };
}

export async function overrideGoldRate(rate: GoldRate): Promise<GoldRate> {
  await ensureGoldRatesTable();
  const result = await pool.query(
    `
      INSERT INTO admin_gold_rates (city, rate_date, rate_22k, rate_24k, rate_20k, rate_18k, silver_rate, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, now())
      ON CONFLICT (city)
      DO UPDATE SET
        rate_date = EXCLUDED.rate_date,
        rate_22k = EXCLUDED.rate_22k,
        rate_24k = EXCLUDED.rate_24k,
        rate_20k = EXCLUDED.rate_20k,
        rate_18k = EXCLUDED.rate_18k,
        silver_rate = EXCLUDED.silver_rate,
        updated_at = now()
      RETURNING *
    `,
    [rate.city, rate.date, rate.rate22k, rate.rate24k, rate.rate20k, rate.rate18k, rate.silverRate]
  );

  cachedRate = rowToGoldRate(result.rows[0]);
  return cachedRate;
}
