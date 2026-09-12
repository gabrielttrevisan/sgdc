import * as v from "valibot";
import { config } from "dotenv";

const DEFAULT_EXPIRES_IN = 43200000;

const EnvironmentSchema = v.object({
  PORT: v.pipe(v.optional(v.string(), 3004), v.toNumber()),
  FRONTEND_URL: v.pipe(v.string()),
  DB_HOST: v.pipe(v.string()),
  DB_PORT: v.pipe(v.optional(v.string(), 3306), v.toNumber()),
  DB_NAME: v.pipe(v.string()),
  DB_USER: v.pipe(v.string()),
  DB_PASSWORD: v.pipe(v.string()),
  JWT_SECRET: v.pipe(v.string(), v.minLength(32)),
  JWT_EXPIRES_IN: v.pipe(
    v.optional(v.string(), DEFAULT_EXPIRES_IN),
    v.toNumber(),
  ),
});

export const env = v.parse(EnvironmentSchema, config().parsed, {
  message(issue) {
    if (!issue.path?.[0].key) return issue.message;

    return `Variável de ambiente "${issue.path?.[0]?.key}" não encontrada ou com valor inexperado`;
  },
});
