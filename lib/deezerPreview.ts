// Shared Deezer preview-lookup logic, used by both:
// - server.ts (Express route, local dev / Cloud Run style deploys)
// - api/sabaton-preview.ts (Vercel serverless function)
export async function getSabatonPreview(song: string) {
  const query = `sabaton ${song}`;
  const searchUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;

  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`Deezer search failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data && data.data && data.data.length > 0) {
    // Find the track where title matches/contains song name AND artist is Sabaton
    let track = data.data.find((t: any) =>
      t.title?.toLowerCase().includes(song.toLowerCase()) &&
      t.artist?.name?.toLowerCase().includes("sabaton")
    );

    // Slower fallback 1: Match by title only
    if (!track) {
      track = data.data.find((t: any) =>
        t.title?.toLowerCase().includes(song.toLowerCase())
      );
    }

    // Slower fallback 2: Match by artist only
    if (!track) {
      track = data.data.find((t: any) =>
        t.artist?.name?.toLowerCase().includes("sabaton")
      );
    }

    // Fallback 3: Pick the first matched result
    if (!track) {
      track = data.data[0];
    }

    return {
      previewUrl: track.preview,
      title: track.title,
      album: track.album?.title,
      coverUrl: track.album?.cover_medium,
      duration: track.duration,
      artist: track.artist?.name
    };
  }

  return { error: "No se encontró traducción/canción de Sabaton para esa búsqueda." };
}
