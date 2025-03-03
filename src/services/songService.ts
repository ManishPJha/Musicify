import { supabase } from "@/integrations/supabase/client";

export const fetchGenres = async () => {
  const { data, error } = await supabase.from("genres").select("*");
  if (error) throw error;
  return data;
};

export const fetchSongsFromJioSaavanApi = async (query: string) => {
  const { data, error } = await supabase.functions.invoke("jiosaavn", {
    body: { type: "search", query: query.trim() },
  });
  if (error) throw error;
  return data.songs;
};

export const addSongToFavorite = async (data: {
  userId: string;
  songId: string;
}) => {
  // skip insert operation if song is already in favorites
  const { data: existingFavorite, error: existingFavoriteError } =
    await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", data?.userId)
      .eq("song_id", data?.songId)
      .maybeSingle();

  if (existingFavoriteError) throw existingFavoriteError;

  if (existingFavorite) {
    return existingFavorite;
  }

  const { data: favorites, error } = await supabase
    .from("favorites")
    .insert({ user_id: data?.userId, song_id: data?.songId })
    .select()
    .single();

  if (error) throw error;
  return favorites;
};

export const fetchFavoriteSongs = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("song_id")
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((f) => f.song_id);
};
