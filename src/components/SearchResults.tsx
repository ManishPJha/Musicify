import { Song } from "@/lib/data";
import { Play, MoreVertical, Heart, ListPlus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PreviewComponent from "./PreviewComponent";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";

interface SearchResultsProps {
  results: Song[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { setCurrentSong, addToQueue } = useMusicPlayer();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToFavorites = async (song: Song) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user?.id, song_id: song.id });

      if (error) throw error;

      toast({
        title: "Added to favorites",
        description: `${song.title} has been added to your favorites`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add song to favorites",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Searching...</div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {results.map((song) => (
          <div
            key={song.id}
            className="group relative aspect-square bg-card rounded-lg overflow-hidden hover:bg-accent transition-colors"
          >
            <PreviewComponent
              component="image"
              data={song.cover}
              quality="500x500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10"
                  onClick={() => setCurrentSong(song)}
                >
                  <Play className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => addToQueue(song)}>
                      <ListPlus className="mr-2 h-4 w-4" />
                      Add to Queue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddToFavorites(song)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <List className="mr-2 h-4 w-4" />
                      Add to Playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-semibold text-white truncate">
                  {song.title}
                </h3>
                <p className="text-sm text-gray-300 truncate">{song.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
