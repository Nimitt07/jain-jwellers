import {
  calculateProductPrice,
  currentDemoRate,
  seedProducts,
  type Product
} from "@jain-jewellers/shared";

export async function listProducts(): Promise<Array<Product & { price: number }>> {
  return seedProducts.map((product) => ({
    ...product,
    price: calculateProductPrice(product, currentDemoRate).total
  }));
}

export async function getProduct(id: string): Promise<(Product & { priceBreakdown: ReturnType<typeof calculateProductPrice> }) | undefined> {
  const product = seedProducts.find((item) => item.id === id);
  if (!product) return undefined;
  return {
    ...product,
    priceBreakdown: calculateProductPrice(product, currentDemoRate)
  };
}
