import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import exampleRoute from "./routes/example.route.js";
import notFoundHandler from "./routes/404.route.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL }));

app.get("/test", exampleRoute);

app.use(notFoundHandler);

app.listen(env.PORT, () => {
  console.log(`🔥 Listening on PORT ${env.PORT}...`);
});
