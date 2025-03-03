import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import {
  fetchGenres,
  addSongToFavorite,
  fetchFavoriteSongs,
} from "@/services/songService";

export const useGenres = (user: User) => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    enabled: !!user,
  });
};

export const useAddSongToFavorite = () => {
  return useMutation({
    mutationFn: addSongToFavorite,
  });
};

export const useGetFavoritesSongs = (userId: string) => {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => fetchFavoriteSongs(userId),
    enabled: !!userId,
  });
};
