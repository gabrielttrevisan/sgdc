import APIResponse from "../lib/APIResponse.js";
import { AuthSingleton } from "../lib/Auth.singleton.js";

/**
 * @typedef {import("express").Handler} PermissionMiddleware
 */

/**
 * @callback ForActionCallback
 * @param {import("../global.js").ResourceAction}
 * @return {PermissionMiddleware}
 */

/**
 * @typedef {Object} ForActionMiddlewareBuilder
 * @prop {ForActionCallback} withAction
 */

/**
 * @callback ForResourceMiddlewareBuilder
 * @param {import("../global.js").Resource} resource
 * @returns {ForActionMiddlewareBuilder}
 */

/**
 * @typedef {Object} PermissionMiddlewareBuilder
 * @prop {ForResourceMiddlewareBuilder} forResource
 */

/** @type {PermissionMiddlewareBuilder}  */
const requiresPermission = Object.freeze({
  /**
   * @param {import("../global.js").Resource} resource
   */
  forResource(resource) {
    return {
      /**
       * @param {import("../global.js").ResourceAction} action
       * @returns {import("express").Handler}
       */
      withAction(action) {
        return async (req, res, next) => {
          const response = APIResponse.from(res);

          if (!req.auth.user.roleId)
            return response
              .error("UNAUTHORIZED", "Credenciais inválidas")
              .send(401);

          if (
            await AuthSingleton.instance.can(
              req.auth.user.roleId,
              resource,
              action,
            )
          )
            return next();

          return response
            .error("FORBIDDEN", "Usuário sem nível de acesso esperado")
            .send(403);
        };
      },
    };
  },
});

export default requiresPermission;
