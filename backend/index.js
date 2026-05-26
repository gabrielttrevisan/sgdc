import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import notFoundHandler from "./routes/404.route.js";
import beneficiariesRouter from "./routes/beneficiaries.route.js";
import citiesRouter from "./routes/cities.route.js";
import salasRouter from "./routes/sala.route.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL }));

app.use("/beneficiaries", beneficiariesRouter);
app.use("/cities", citiesRouter);
app.use("/salas", salasRouter);

app.use(notFoundHandler);

app.listen(env.PORT, () => {
  console.log(`🔥 Listening on PORT ${env.PORT}...`);
});
