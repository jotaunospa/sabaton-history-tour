// Vercel serverless function for the Deezer preview lookup.
// Intentionally self-contained (no relative imports crossing outside /api)
// to rule out any cross-directory dependency-tracing issue in Vercel's
// Node.js function bundler. server.ts has its own equivalent copy of this
// logic for local dev / non-Vercel deploys.
export default async function handler(req: any, res: any) {
  try {
    const song = req.query?.song as string | undefined;
    if (!song) {
      return res.status(400).json({ error: "El parametro de consulta 'song' es requerido." });
    }

    const query = `sabaton ${song}`;
    const searchUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      return res.status(502).json({ error: `Deezer search failed with status ${response.status}` });
    }

    const data: any = await response.json();

    if (data && data.data && data.data.length > 0) {
      let track = data.data.find((t: any) =>
        t.title?.toLowerCase().includes(song.toLowerCase()) &&
        t.artist?.name?.toLowerCase().includes("sabaton")
      );

      if (!track) {
        track = data.data.find((t: any) => t.title?.toLowerCase().includes(song.toLowerCase()));
      }
      if (!track) {
        track = data.data.find((t: any) => t.artist?.name?.toLowerCase().includes("sabaton"));
      }
      if (!track) {
        track = data.data[0];
      }

      return res.status(200).json({
        previewUrl: track.preview,
        title: track.title,
        album: track.album?.title,
        coverUrl: track.album?.cover_medium,
        duration: track.duration,
        artist: track.artist?.name
      });
    }

    return res.status(200).json({ error: "No se encontro cancion de Sabaton para esa busqueda." });
  } catch (err: any) {
    console.error("Error retrieving preview from Deezer:", err);
    return res.status(500).json({
      error: "Error al recuperar preview de musica",
      details: err?.message || String(err)
    });
  }
}
