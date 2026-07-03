import { getSabatonPreview } from "../lib/deezerPreview";

// Vercel serverless function equivalent of the /api/sabaton-preview
// Express route in server.ts (used for local dev / non-Vercel deploys).
export default async function handler(req: any, res: any) {
  const song = req.query.song as string;
  if (!song) {
    return res.status(400).json({ error: "El parámetro de consulta 'song' es requerido." });
  }

  try {
    const result = await getSabatonPreview(song);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Error retrieving preview from Deezer:", err);
    return res.status(500).json({ error: "Error al recuperar preview de música", details: err?.message });
  }
}
