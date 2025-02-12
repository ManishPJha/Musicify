export const fetchSongsForGenre = async (genreName: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jiosaavn`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: "genre",
          genre: genreName,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch songs");
    const data = await response.json();
    return data.songs;
  } catch (error) {
    console.error(`Error fetching songs for genre ${genreName}:`, error);
    return [];
  }
};
