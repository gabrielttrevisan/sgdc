/**
 * Example Route
 * @param {import("express").Request} _
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */
export default function notFoundHandler(_, res, _next) {
  res.status(404).send({
    data: null,
    error: {
      code: "NOT_FOUND",
      message: "Resource not found",
    },
  });
}
