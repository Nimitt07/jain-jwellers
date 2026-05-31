import { Router } from "express";
import { z } from "zod";
import { getCurrentGoldRate, overrideGoldRate } from "../modules/goldRates";

export const goldRatesRouter = Router();

goldRatesRouter.get("/current", async (request, response) => {
  const city = typeof request.query.city === "string" ? request.query.city : "Mumbai";
  response.json({ rate: await getCurrentGoldRate(city) });
});

goldRatesRouter.post("/override", async (request, response) => {
  const body = z.object({
    city: z.string(),
    date: z.string(),
    rate22k: z.number(),
    rate24k: z.number(),
    rate18k: z.number(),
    silverRate: z.number()
  }).parse(request.body);

  response.json({ rate: await overrideGoldRate(body) });
});
