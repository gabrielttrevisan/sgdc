import "dotenv/config";
import * as v from "valibot";

const DEFAULT_EXPIRES_IN = "43200000";

const EnvironmentSchema = v.object({
<<<<<<< HEAD
  PORT: v.pipe(
    v.optional(v.string(), "3004"),
    v.toNumber()
  ),
=======
  PORT: v.pipe(v.optional(v.string(), "3004"), v.toNumber()),
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d

  FRONTEND_URL: v.pipe(
    v.string(),
    v.transform((raw) =>
      raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
    v.array(v.string()),
  ),

  DB_HOST: v.string(),

  DB_PORT: v.pipe(v.optional(v.string(), "3306"), v.toNumber()),

  DB_NAME: v.string(),

  DB_USER: v.string(),

  DB_PASSWORD: v.string(),

  JWT_SECRET: v.pipe(v.string(), v.minLength(32)),

  JWT_EXPIRES_IN: v.pipe(
    v.optional(v.string(), DEFAULT_EXPIRES_IN),
    v.toNumber(),
  ),
<<<<<<< HEAD
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
=======
  EMAIL_USER: v.pipe(v.string(), v.email()),
  EMAIL_PASS: v.pipe(v.string(), v.length(16)),
  EMAIL_SERVICE: v.pipe(v.optional(v.string(), "gmail")),
});

export const env = v.parse(EnvironmentSchema, process.env, {
  message(issue) {
    if (!issue.path?.[0].key) return issue.message;

    return `Variável de ambiente "${issue.path[0].key}" não encontrada ou com valor inesperado`;
  },
});
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
