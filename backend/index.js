import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthCheckRoute from "./routes/heanthcheck.route.js";
import notFoundHandler from "./routes/404.route.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL }));

app.get("/healthcheck", healthCheckRoute);

app.use(notFoundHandler);

app.listen(env.PORT, () => {
  console.log(`🔥 Listening on PORT ${env.PORT}...`);
});
