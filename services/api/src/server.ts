import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ZodError } from "zod";
import { env } from "./config/env";
import { catalogueRouter } from "./routes/catalogue";
import { goldRatesRouter } from "./routes/goldRates";
import { adminDataRouter } from "./routes/adminData";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { productsRouter } from "./routes/products";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/catalogue", catalogueRouter);
app.use("/gold-rates", goldRatesRouter);
app.use("/admin-data", adminDataRouter);
app.use("/products", productsRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: error.issues[0]?.message || "Invalid request" });
    return;
  }
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Jain Jewellers API running on port ${env.PORT}`);
});
