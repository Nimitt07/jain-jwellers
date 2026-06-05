import { seedProducts, type Product } from "@jain-jewellers/shared";
import { pool } from "../db/pool";

let initialized = false;

async function ensureProductsTable() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      metal TEXT NOT NULL,
      purity_kt INTEGER NOT NULL,
      gross_weight NUMERIC(10, 3) NOT NULL,
      net_weight NUMERIC(10, 3) NOT NULL,
      making_charge_pct NUMERIC(8, 2) NOT NULL,
      labour_charge NUMERIC(12, 2) NOT NULL DEFAULT 0,
      stone_details TEXT,
      images TEXT[] NOT NULL DEFAULT '{}',
      stock_qty INTEGER NOT NULL DEFAULT 0,
      hallmark_id TEXT NOT NULL,
      collection_name TEXT NOT NULL,
      occasion TEXT NOT NULL,
      rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
      popularity INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const count = await pool.query<{ count: string }>("SELECT COUNT(*) FROM admin_products");
  initialized = true;

  if (Number(count.rows[0]?.count || 0) === 0) {
    for (const product of seedProducts) {
      await upsertProduct(product);
    }
  }
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    category: row.category as Product["category"],
    subCategory: row.sub_category as Product["subCategory"],
    metal: row.metal as Product["metal"],
    purityKt: Number(row.purity_kt) as Product["purityKt"],
    grossWeight: Number(row.gross_weight),
    netWeight: Number(row.net_weight),
    makingChargePct: Number(row.making_charge_pct),
    labourCharge: Number(row.labour_charge || 0),
    stoneDetails: row.stone_details ? String(row.stone_details) : undefined,
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    stockQty: Number(row.stock_qty),
    hallmarkId: String(row.hallmark_id),
    collectionName: String(row.collection_name),
    occasion: row.occasion as Product["occasion"],
    rating: Number(row.rating),
    popularity: Number(row.popularity),
    description: String(row.description || ""),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
  };
}

export async function listProductsFromDb(): Promise<Product[]> {
  await ensureProductsTable();
  const result = await pool.query("SELECT * FROM admin_products ORDER BY created_at DESC, name ASC");
  return result.rows.map(rowToProduct);
}

export async function getProductFromDb(id: string): Promise<Product | undefined> {
  await ensureProductsTable();
  const result = await pool.query("SELECT * FROM admin_products WHERE id = $1", [id]);
  return result.rows[0] ? rowToProduct(result.rows[0]) : undefined;
}

export async function upsertProduct(product: Product): Promise<Product> {
  await ensureProductsTable();
  const result = await pool.query(
    `
      INSERT INTO admin_products (
        id, name, category, sub_category, metal, purity_kt, gross_weight, net_weight,
        making_charge_pct, labour_charge, stone_details, images, stock_qty, hallmark_id,
        collection_name, occasion, rating, popularity, description, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, now()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        metal = EXCLUDED.metal,
        purity_kt = EXCLUDED.purity_kt,
        gross_weight = EXCLUDED.gross_weight,
        net_weight = EXCLUDED.net_weight,
        making_charge_pct = EXCLUDED.making_charge_pct,
        labour_charge = EXCLUDED.labour_charge,
        stone_details = EXCLUDED.stone_details,
        images = EXCLUDED.images,
        stock_qty = EXCLUDED.stock_qty,
        hallmark_id = EXCLUDED.hallmark_id,
        collection_name = EXCLUDED.collection_name,
        occasion = EXCLUDED.occasion,
        rating = EXCLUDED.rating,
        popularity = EXCLUDED.popularity,
        description = EXCLUDED.description,
        updated_at = now()
      RETURNING *
    `,
    [
      product.id,
      product.name,
      product.category,
      product.subCategory,
      product.metal,
      product.purityKt,
      product.grossWeight,
      product.netWeight,
      product.makingChargePct,
      product.labourCharge || 0,
      product.stoneDetails || null,
      product.images,
      product.stockQty,
      product.hallmarkId,
      product.collectionName,
      product.occasion,
      product.rating,
      product.popularity,
      product.description,
      product.createdAt
    ]
  );

  return rowToProduct(result.rows[0]);
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  await ensureProductsTable();
  const result = await pool.query("DELETE FROM admin_products WHERE id = $1", [id]);
  return (result.rowCount || 0) > 0;
}
