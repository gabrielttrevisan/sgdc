import express, { Router } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import notFoundHandler from "./routes/404.route.js";
import beneficiariesRouter from "./routes/beneficiaries.route.js";
import citiesRouter from "./routes/cities.route.js";
import salasRouter from "./routes/sala.route.js";
import allocationTypesRouter from "./routes/allocationTypes.route.js";
import measuringUnitsRouter from "./routes/measuringUnits.route.js";
import familyRouter from "./routes/family.route.js";
import volunteersRouter from "./routes/volunteers.route.js";
import router from "./routes/donors.js";
import productsRouter from "./routes/products.route.js";
import userRouter from "./routes/user.route.js";
import auth from "./middlewares/auth.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import rolesRouter from "./routes/roles.route.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use("/auth", authRouter);

const protectedRoutes = Router();

protectedRoutes.use("/", auth);
protectedRoutes.use("/beneficiaries", beneficiariesRouter);
protectedRoutes.use("/cities", citiesRouter);
protectedRoutes.use("/salas", salasRouter);
protectedRoutes.use("/allocation-types", allocationTypesRouter);
protectedRoutes.use("/measuring-units", measuringUnitsRouter);
protectedRoutes.use("/families", familyRouter);
protectedRoutes.use("/volunteers", volunteersRouter);
protectedRoutes.use("/donors", router);
protectedRoutes.use("/products", productsRouter);
protectedRoutes.use("/users", userRouter);
protectedRoutes.use("/roles", rolesRouter);

app.use("/", protectedRoutes);
app.use(notFoundHandler);

app.listen(env.PORT, () => {
  console.log(`🔥 Listening on PORT ${env.PORT}...`);
});
