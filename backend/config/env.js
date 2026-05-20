import * as v from "valibot";
import { config } from "dotenv";

const EnvironmentSchema = v.object({
  PORT: v.pipe(v.optional(v.string(), 3004), v.toNumber(), v.number()),
  FRONTEND_URL: v.pipe(v.string()),
});

export const env = v.parse(EnvironmentSchema, config().parsed);
