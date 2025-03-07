import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import {
  fetchGenres,
  addSongToFavorite,
  fetchFavoriteSongs,
} from "@/services/songService";

import { useToast } from "./use-toast";

export const useGenres = (user: User) => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    enabled: !!user,
  });
};

export const useAddSongToFavorite = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: addSongToFavorite,
    onSuccess: () =>
      toast({
        title: "Success",
        description: "Song has been added to your favorites",
      }),
    onError: (error) =>
      toast({
        title: "Error",
        description: "Failed to add song to favorites",
        variant: "destructive",
      }),
  });
};

export const useGetFavoritesSongs = (userId: string) => {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => fetchFavoriteSongs(userId),
    enabled: !!userId,
  });
};
