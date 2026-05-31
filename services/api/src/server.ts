import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { catalogueRouter } from "./routes/catalogue";
import { goldRatesRouter } from "./routes/goldRates";
import { healthRouter } from "./routes/health";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/health", healthRouter);
app.use("/catalogue", catalogueRouter);
app.use("/gold-rates", goldRatesRouter);

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Jain Jewellers API running on port ${env.PORT}`);
});
