import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import MusicGenre from "@/components/MusicGenre";
import PlaylistModal from "@/components/playlist/PlaylistModal";
import type { Song, Genre } from "@/lib/data";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { setCurrentSong } = useMusicPlayer();
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data, error } = await supabase.from("genres").select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const fetchSongsForGenre = async (genreName: string) => {
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

  const { data: songsByGenre, isLoading: isLoadingSongs } = useQuery({
    queryKey: ["songs-by-genre"],
    queryFn: async () => {
      if (!genres) return {};
      const songsByGenre: Record<string, Song[]> = {};
      for (const genre of genres) {
        const songs = await fetchSongsForGenre(genre.name);
        songsByGenre[genre.id] = songs;
      }
      return songsByGenre;
    },
    enabled: !!genres,
  });

  const handleCreatePlaylist = async (data: {
    name: string;
    description: string;
  }) => {
    if (!user) return;

    setIsCreatingPlaylist(true);
    try {
      const { data: playlist, error } = await supabase
        .from("playlists")
        .insert({
          name: data.name,
          description: data.description,
          user_id: user.id,
          cover_image: "/placeholder.svg",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Playlist created",
        description: "Your new playlist has been created successfully",
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        title: "Error",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <PlaylistModal
          isCreatingPlaylist={isCreatingPlaylist}
          onSubmit={handleCreatePlaylist}
        />
      </div>

      <div className="mb-8">
        <SearchBar
          onResults={setSearchResults}
          isLoading={isSearching}
          setIsLoading={setIsSearching}
        />
        <SearchResults results={searchResults} isLoading={isSearching} />
      </div>

      {!searchResults.length && (
        <MusicGenre
          genres={genres}
          songsByGenre={songsByGenre}
          isLoadingGenres={isLoadingGenres}
          isLoadingSongs={isLoadingSongs}
          setCurrentSong={setCurrentSong}
        />
      )}
    </div>
  );
};

export default Index;
