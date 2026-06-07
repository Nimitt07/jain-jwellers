import { Router } from "express";
import { z } from "zod";
import { loginUser, loginWithGoogle, registerUser } from "../modules/auth";

export const authRouter = Router();

authRouter.post("/register", async (request, response, next) => {
  try {
    const body = z.object({
      name: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email(),
      city: z.string().optional(),
      password: z.string().min(4)
    }).parse(request.body);

    response.status(201).json({ user: await registerUser(body) });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (request, response, next) => {
  try {
    const body = z.object({
      email: z.string().email(),
      password: z.string().min(4)
    }).parse(request.body);
    const user = await loginUser(body);
    if (!user) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }
    response.json({ user });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/google", async (request, response, next) => {
  try {
    const body = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      city: z.string().optional()
    }).parse(request.body);

    response.json({ user: await loginWithGoogle(body) });
  } catch (error) {
    next(error);
  }
});
