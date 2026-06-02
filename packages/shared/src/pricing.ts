import type { GoldRate, PriceBreakdown, Product } from "./types";

export const GST_RATE = 0.03;

export function getRatePerGram(product: Product, rate: GoldRate): number {
  if (product.metal === "silver") return rate.silverRate;
  if (product.purityKt === 24) return rate.rate24k;
  if (product.purityKt === 20) return rate.rate20k;
  if (product.purityKt === 18) return rate.rate18k;
  return rate.rate22k;
}

export function calculateProductPrice(product: Product, rate: GoldRate): PriceBreakdown {
  const ratePerGram = getRatePerGram(product, rate);
  const metalValue = product.netWeight * ratePerGram;
  const makingCharges = metalValue * (product.makingChargePct / 100);
  const labourCharge = product.labourCharge ?? 0;
  const taxableAmount = metalValue + makingCharges + labourCharge;
  const gst = taxableAmount * GST_RATE;

  return {
    metalValue,
    makingCharges,
    labourCharge,
    taxableAmount,
    gst,
    total: taxableAmount + gst,
    ratePerGram
  };
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Math.round(value));
}
