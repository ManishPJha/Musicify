import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchPlaylists,
  createPlaylist,
  getPlaylistSongs,
  addSongToPlaylist,
} from "@/services/playlistService";

import { useToast } from "./use-toast";

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

export const useAddSongToPlalist = (songId: string, playlistId: string) => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: addSongToPlaylist,
    onSuccess: () =>
      toast({ title: "Success", description: "Song is added to playlist." }),
    onError: (error) =>
      toast({
        title: "Error",
        description: `Failed to add song to playlist: ${error.message}`,
        variant: "destructive",
      }),
  });
};
