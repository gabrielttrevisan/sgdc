/**
 * Example Route
 * @param {import("express").Request} _
 * @param {import("express").Response} res
 */
export default function healthCheckRoute(_, res) {
  res.status(200).send({
    data: { status: "healthy" },
    error: null,
  });
}
