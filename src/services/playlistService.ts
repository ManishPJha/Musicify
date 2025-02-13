import { supabase } from "@/integrations/supabase/client";

import appConfigs from "@/config";

/**
 * Fetches all playlists for a specific user from the database.
 * The playlists are sorted by their creation date in descending order (newest first).
 *
 * @param {string} userId - The ID of the authorized user.
 * @returns {Promise<Array>} - A promise that resolves to an array of playlists.
 * @throws {Error} - Throws an error if the query fails.
 */
export const fetchPlaylists = async (userId: string) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Creates a new playlist in the database and optionally uploads a cover image to storage.
 * If a cover image is provided, it is uploaded to the configured Supabase storage bucket,
 * and the public URL of the image is saved in the playlist record.
 *
 * @param {Object} data - The playlist data.
 * @param {string} data.name - The name of the playlist.
 * @param {string} data.description - The description of the playlist.
 * @param {string} data.userId - The ID of the user creating the playlist.
 * @param {File} [data.coverFile] - Optional. The cover image file for the playlist.
 * @returns {Promise<Object>} - A promise that resolves to the newly created playlist.
 * @throws {Error} - Throws an error if the playlist creation or file upload fails.
 */
export const createPlaylist = async (data: {
  name: string;
  description: string;
  userId: string;
  coverFile?: File;
}) => {
  let coverUrl: string | null = null;

  if (data.coverFile) {
    const fileExt = data.coverFile.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(appConfigs.bucketName)
      .upload(filePath, data.coverFile);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(appConfigs.bucketName).getPublicUrl(filePath);

    coverUrl = publicUrl;
  }

  const { data: playlist, error } = await supabase
    .from("playlists")
    .insert({
      name: data.name,
      description: data.description,
      user_id: data.userId,
      cover_image: coverUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return playlist;
};

/**
 * Fetches a playlist songs from the database by using playlist id parameter.
 *
 * @param {string} playlistId - The ID of the playlist.
 * @returns {Promise<object>} - A promise that resolves to an array of songs from it's playlist
 */
export const getPlaylistSongs = async (playlistId: string) => {
  const { data: playlist, error } = await supabase
    .from("playlists")
    .select("*, playlist_songs(*, songs(*))")
    .eq("id", playlistId)
    .single();

  if (error) throw error;
  return playlist;
};
