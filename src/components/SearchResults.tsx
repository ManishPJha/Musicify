import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import PreviewComponent from "@/components/PreviewComponent";

import { useMusicPlayer } from "@/hooks/use-musicPlayer";
import PlayerDropdown from "./player/PlayerDropdown";

import { Song } from "@/lib/data";

interface SearchResultsProps {
  results: Song[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { setCurrentSong } = useMusicPlayer();

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
                <PlayerDropdown song={song} />
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
