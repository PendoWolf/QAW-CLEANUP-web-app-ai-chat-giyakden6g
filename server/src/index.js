// Serves the built Tripwise frontend (web/dist). This is not the Tripwise API:
// the app calls the separate backend service at VITE_API_URL.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDist = path.resolve(__dirname, "../../web/dist");

app.use(express.static(webDist));
app.get("*", (_req, res) => res.sendFile(path.join(webDist, "index.html")));

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Tripwise frontend on port ${PORT}`);
});
