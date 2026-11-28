
import "dotenv/config";
import * as v from "valibot";

const DEFAULT_EXPIRES_IN = "43200000";

const EnvironmentSchema = v.object({
  PORT: v.pipe(
    v.optional(v.string(), "3004"),
    v.toNumber()
  ),

  FRONTEND_URL: v.pipe(
    v.string(),
    v.transform((raw) =>
      raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    ),
    v.array(v.string())
  ),

  DB_HOST: v.string(),

  DB_PORT: v.pipe(
    v.optional(v.string(), "3306"),
    v.toNumber()
  ),

  DB_NAME: v.string(),

  DB_USER: v.string(),

  DB_PASSWORD: v.string(),

  JWT_SECRET: v.pipe(
    v.string(),
    v.minLength(32)
  ),

  JWT_EXPIRES_IN: v.pipe(
    v.optional(v.string(), DEFAULT_EXPIRES_IN),
    v.toNumber()
  ),
  EMAIL_USER: v.optional(v.pipe(v.string(), v.email())),
  EMAIL_PASS: v.optional(v.pipe(v.string(), v.length(16))),
  EMAIL_SERVICE: v.pipe(v.optional(v.string(), "gmail")),
});

const environment = v.safeParse(EnvironmentSchema, process.env);

if (!environment.success) {
  const invalidVariables = [
    ...new Set(
      environment.issues.map((issue) =>
        String(issue.path?.[0]?.key ?? "configuração de ambiente"),
      ),
    ),
  ];
  throw new Error(
    `Variáveis de ambiente ausentes ou inválidas: ${invalidVariables.join(", ")}`,
  );
}

export const env = environment.output;
