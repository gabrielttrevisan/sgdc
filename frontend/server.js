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
  }),
);

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔥 Listening on PORT ${PORT}...`);
});
