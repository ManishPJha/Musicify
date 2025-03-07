import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useGenres } from "@/hooks/use-songs";

import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { AuthForm } from "@/components/AuthForm";
import { Typography } from "@/components/Typography";
import MusicGenre from "@/components/MusicGenre";
import PlaylistModal from "@/components/playlist/PlaylistModal";
import { Button } from "@/components/ui/button";

import { fetchSongsForGenre } from "@/services/edgeService";

import type { Song } from "@/lib/data";

const Index = () => {
  const { user } = useAuth();

  const { data: genres, isLoading: isLoadingGenres } = useGenres(user);
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

  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openPlaylistModal = () => setIsOpen(true);

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
        <Typography variant="h1">Welcome Back!</Typography>
        <Button onClick={openPlaylistModal}>
          <Plus className="mr-2 h-4 w-4" /> Create Playlist
        </Button>
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
        />
      )}
      {isOpen && <PlaylistModal open={isOpen} onOpenChange={setIsOpen} />}
    </div>
  );
};

export default Index;
