import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/jain_jewellers"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  GOLD_API_KEY: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional()
});

export const env = schema.parse(process.env);
