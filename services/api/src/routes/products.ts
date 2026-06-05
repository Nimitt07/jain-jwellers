import { Router } from "express";
import { z } from "zod";
import { deleteProductFromDb, getProductFromDb, listProductsFromDb, upsertProduct } from "../modules/products";

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(["Gold", "Diamond", "Silver", "Platinum", "Gemstone", "Coins & Bars"]),
  subCategory: z.enum(["Necklaces", "Rings", "Earrings", "Bangles", "Pendants", "Chains", "Nose Pins", "Anklets", "Bracelets", "Mangalsutra", "Men's Jewellery", "Kids' Collection"]),
  metal: z.enum(["gold", "diamond", "silver", "platinum", "gemstone"]),
  purityKt: z.union([z.literal(18), z.literal(20), z.literal(22), z.literal(24), z.literal(925), z.literal(950)]),
  grossWeight: z.number(),
  netWeight: z.number(),
  makingChargePct: z.number(),
  labourCharge: z.number().optional(),
  stoneDetails: z.string().optional(),
  images: z.array(z.string()),
  stockQty: z.number(),
  hallmarkId: z.string().min(1),
  collectionName: z.string().min(1),
  occasion: z.enum(["Wedding", "Daily wear", "Festive", "Office", "Gifting"]),
  rating: z.number(),
  popularity: z.number(),
  description: z.string(),
  createdAt: z.string()
});

export const productsRouter = Router();

productsRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ products: await listProductsFromDb() });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (request, response, next) => {
  try {
    const product = await getProductFromDb(request.params.id);
    if (!product) {
      response.status(404).json({ error: "Product not found" });
      return;
    }
    response.json({ product });
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/", async (request, response, next) => {
  try {
    const product = productSchema.parse(request.body);
    response.status(201).json({ product: await upsertProduct(product) });
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", async (request, response, next) => {
  try {
    const product = productSchema.parse({ ...request.body, id: request.params.id });
    response.json({ product: await upsertProduct(product) });
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", async (request, response, next) => {
  try {
    const deleted = await deleteProductFromDb(request.params.id);
    response.status(deleted ? 204 : 404).send();
  } catch (error) {
    next(error);
  }
});
