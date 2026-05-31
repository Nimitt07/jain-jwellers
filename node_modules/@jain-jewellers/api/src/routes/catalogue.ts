import { Router } from "express";
import { getProduct, listProducts } from "../modules/catalogue";

export const catalogueRouter = Router();

catalogueRouter.get("/", async (_request, response) => {
  response.json({ products: await listProducts() });
});

catalogueRouter.get("/:id", async (request, response) => {
  const product = await getProduct(request.params.id);
  if (!product) {
    response.status(404).json({ error: "Product not found" });
    return;
  }

  response.json({ product });
});
