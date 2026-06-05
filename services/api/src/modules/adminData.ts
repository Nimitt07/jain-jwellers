import { pool } from "../db/pool";

export const adminDataModules = ["orders", "dashboard", "schemes", "showrooms", "notifications", "users"] as const;

export type AdminDataModule = (typeof adminDataModules)[number];

let initialized = false;

async function ensureAdminDataTable() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_data (
      module TEXT PRIMARY KEY,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  initialized = true;
}

export async function getAdminData(module: AdminDataModule): Promise<unknown[] | null> {
  await ensureAdminDataTable();
  const result = await pool.query<{ items: unknown[] }>("SELECT items FROM admin_data WHERE module = $1", [module]);
  return result.rows[0]?.items ?? null;
}

export async function setAdminData(module: AdminDataModule, items: unknown[]): Promise<unknown[]> {
  await ensureAdminDataTable();
  const result = await pool.query<{ items: unknown[] }>(
    `
      INSERT INTO admin_data (module, items, updated_at)
      VALUES ($1, $2::jsonb, now())
      ON CONFLICT (module)
      DO UPDATE SET items = EXCLUDED.items, updated_at = now()
      RETURNING items
    `,
    [module, JSON.stringify(items)]
  );

  return result.rows[0]?.items ?? items;
}
