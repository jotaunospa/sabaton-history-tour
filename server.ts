import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getSabatonPreview } from "./lib/deezerPreview";

const app = express();
const PORT = 3000;

// Parse incoming JSON requests
app.use(express.json());

// 1. API: Sabaton music preview retriever via public Deezer catalog search
app.get("/api/sabaton-preview", async (req, res) => {
  const song = req.query.song as string;
  if (!song) {
    return res.status(400).json({ error: "El parámetro de consulta 'song' es requerido." });
  }

  try {
    const result = await getSabatonPreview(song);
    return res.json(result);
  } catch (err: any) {
    console.error("Error retrieving preview from Deezer:", err);
    return res.status(500).json({ error: "Error al recuperar preview de música", details: err?.message });
  }
});

// 2. Vite development middleware / Static production static assets
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static build assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error("Failed to start server:", err);
});
