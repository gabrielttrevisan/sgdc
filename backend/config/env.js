import * as v from "valibot";
import { config } from "dotenv";

const EnvironmentSchema = v.object({
  PORT: v.pipe(v.optional(v.string(), 3004), v.toNumber()),
  FRONTEND_URL: v.pipe(v.string()),
  DB_HOST: v.pipe(v.string()),
  DB_PORT: v.pipe(v.optional(v.string(), 3306), v.toNumber()),
  DB_NAME: v.pipe(v.string()),
  DB_USER: v.pipe(v.string()),
  DB_PASSWORD: v.pipe(v.string()),
});

export const env = v.parse(EnvironmentSchema, config().parsed);
