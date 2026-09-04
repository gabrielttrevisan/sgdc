import { env } from "../config/env.js";
import APIResponse from "../lib/APIResponse.js";
import jwt from "jsonwebtoken";

/** @type {import("express").Handler} */
const auth = (req, res, next) => {
  const response = APIResponse.from(res);
  const authHeader = req.header("authorization");

  if (!authHeader)
    return response.error("UNAUTHORIZED", "Credenciais inválidas").send(401);

  const match = authHeader.match(/Bearer\s(.+)/);

  if (!match)
    return response.error("UNAUTHORIZED", "Credenciais inválidas").send(401);

  const [, token] = match;

  if (!token)
    return response.error("UNAUTHORIZED", "Credenciais inválidas").send(401);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === "string")
      return response.error("UNAUTHORIZED", "Credenciais inválidas").send(401);

    req.auth = Object.freeze({
      get user() {
        return {
          id: payload.user.id,
          name: payload.user.name,
        };
      },
    });

    next();
  } catch (e) {
    return response.error("UNAUTHORIZED", "Credenciais inválidas").send(403);
  }
};

export default auth;
