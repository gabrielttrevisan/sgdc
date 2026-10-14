import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const app = express();

app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: 2048 * 1000,
    cacheControl: true,
    setHeaders(res, path) {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Permissions-Policy", "geolocation=()");
      res.setHeader("X-Frame-Options", "DENY");

      if (["", "/"].includes(path)) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
      }

      res.setHeader(
        "Cache-Control",
        `private, max-age=${process.env.CACHE_MAX_AGE ?? 31536000}`,
      );
    },
  }),
);

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🔥 Listening on PORT ${PORT}...`);
});
