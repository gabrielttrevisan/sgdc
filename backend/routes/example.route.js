/**
 * Example Route
 * @param {import("express").Request} _
 * @param {import("express").Response} res
 */
export default function exampleRoute(_, res) {
  res.status(200).send({
    data: { status: true },
    error: null,
  });
}
