import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicPlayer } from "@/hooks/use-musicPlayer";
import { useCreatePlaylist } from "@/hooks/use-playlists";
import { useGenres } from "@/hooks/use-songs";

import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { AuthForm } from "@/components/AuthForm";
import MusicGenre from "@/components/MusicGenre";
import PlaylistModal from "@/components/playlist/PlaylistModal";

import { fetchSongsForGenre } from "@/services/edgeService";

import type { Song } from "@/lib/data";

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { setCurrentSong, setIsPlaying } = useMusicPlayer();
  const { mutate: createPlaylist, isPending } = useCreatePlaylist();
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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreatePlaylist = (data: {
    name: string;
    description: string;
  }) => {
    if (!user) return;
    try {
      createPlaylist({
        ...data,
        userId: user.id,
        coverFile: coverFile,
      });

      setCoverFile(null);
      setCoverPreview(null);
      closePlaylistModal();

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
    }
  };

  const closePlaylistModal = () => setIsOpen(false);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

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
          open={isOpen}
          isCreatingPlaylist={isPending}
          previewImageDataURL={coverPreview}
          onSubmit={handleCreatePlaylist}
          onOpenChange={setIsOpen}
          setCoverFile={setCoverFile}
          setCoverPreview={setCoverPreview}
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
          setIsPlaying={(isPlayingState) => setIsPlaying(isPlayingState)}
        />
      )}
    </div>
  );
};

export default Index;
