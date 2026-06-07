import crypto from "crypto";
import { pool } from "../db/pool";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  provider: "password" | "google";
  role: "admin" | "viewer";
  createdAt: string;
};

let initialized = false;

async function ensureUsersTable() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      city TEXT NOT NULL DEFAULT '',
      provider TEXT NOT NULL DEFAULT 'password',
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'viewer',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  initialized = true;
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string | null) {
  if (!storedHash) return false;
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const checkHash = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(checkHash, "hex"));
}

function rowToUser(row: Record<string, unknown>): AuthUser {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    email: String(row.email),
    city: String(row.city || ""),
    provider: row.provider as AuthUser["provider"],
    role: row.role as AuthUser["role"],
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
  };
}

export async function registerUser(input: { name: string; phone: string; email: string; city?: string; password: string }) {
  await ensureUsersTable();
  const id = `USR-${Date.now().toString(36).toUpperCase()}`;
  const result = await pool.query(
    `
      INSERT INTO app_users (id, name, phone, email, city, provider, password_hash, role, updated_at)
      VALUES ($1, $2, $3, lower($4), $5, 'password', $6, 'viewer', now())
      ON CONFLICT (email)
      DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, city = EXCLUDED.city, updated_at = now()
      RETURNING *
    `,
    [id, input.name, input.phone, input.email, input.city || "", hashPassword(input.password)]
  );
  return rowToUser(result.rows[0]);
}

export async function loginUser(input: { email: string; password: string }) {
  await ensureUsersTable();
  const result = await pool.query("SELECT * FROM app_users WHERE email = lower($1)", [input.email]);
  const row = result.rows[0];
  if (!row || !verifyPassword(input.password, row.password_hash)) return null;
  return rowToUser(row);
}

export async function loginWithGoogle(input: { name: string; email: string; phone?: string; city?: string }) {
  await ensureUsersTable();
  const id = `USR-${Date.now().toString(36).toUpperCase()}`;
  const result = await pool.query(
    `
      INSERT INTO app_users (id, name, phone, email, city, provider, role, updated_at)
      VALUES ($1, $2, $3, lower($4), $5, 'google', 'viewer', now())
      ON CONFLICT (email)
      DO UPDATE SET name = EXCLUDED.name, provider = 'google', updated_at = now()
      RETURNING *
    `,
    [id, input.name, input.phone || "", input.email, input.city || ""]
  );
  return rowToUser(result.rows[0]);
}
