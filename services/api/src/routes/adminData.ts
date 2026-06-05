import { Router } from "express";
import { z } from "zod";
import { adminDataModules, getAdminData, setAdminData } from "../modules/adminData";

const moduleSchema = z.enum(adminDataModules);
const itemsSchema = z.object({
  items: z.array(z.record(z.unknown()))
});

export const adminDataRouter = Router();

adminDataRouter.get("/:module", async (request, response, next) => {
  try {
    const module = moduleSchema.parse(request.params.module);
    response.json({ items: await getAdminData(module) });
  } catch (error) {
    next(error);
  }
});

adminDataRouter.put("/:module", async (request, response, next) => {
  try {
    const module = moduleSchema.parse(request.params.module);
    const body = itemsSchema.parse(request.body);
    response.json({ items: await setAdminData(module, body.items) });
  } catch (error) {
    next(error);
  }
});
