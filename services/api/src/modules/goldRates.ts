import { currentDemoRate, type GoldRate } from "@jain-jewellers/shared";

let cachedRate: GoldRate = currentDemoRate;

export async function getCurrentGoldRate(city = "Mumbai"): Promise<GoldRate> {
  return {
    ...cachedRate,
    city
  };
}

export async function overrideGoldRate(rate: GoldRate): Promise<GoldRate> {
  cachedRate = rate;
  return cachedRate;
}
