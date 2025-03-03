import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchPlaylists,
  createPlaylist,
  getPlaylistSongs,
} from "@/services/playlistService";

export const usePlaylists = (userId: string) => {
  return useQuery({
    queryKey: ["playlists", userId],
    queryFn: () => fetchPlaylists(userId),
    enabled: !!userId,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

export const useGetPlaylistSongs = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistSongs(playlistId),
    enabled: !!playlistId,
  });
};
