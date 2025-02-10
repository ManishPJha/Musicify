import React from "react";
import { Play } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import GenreSkeleton from "@/components/skeleton/GenreSkeleton";
import { Button } from "@/components/ui/button";
import PreviewComponent from "@/components/PreviewComponent";
import PlayerDropdown from "@/components/player/PlayerDropdown";

import { Song, Genre } from "@/lib/data";

interface MusicGenreProps {
  genres: Genre[];
  songsByGenre: Record<string, Song[]>;
  isLoadingGenres: boolean;
  isLoadingSongs: boolean;
  setCurrentSong: (song: Song) => void;
}

const MusicGenre: React.FC<MusicGenreProps> = ({
  genres,
  songsByGenre,
  isLoadingGenres,
  isLoadingSongs,
  setCurrentSong,
}) => {
  if (isLoadingGenres || isLoadingSongs) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <GenreSkeleton key={index} />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {genres?.map((genre) => (
        <section key={genre.id} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{genre.name}</h2>
            <Button variant="link">See all</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {songsByGenre?.[genre.id]?.map((song) => (
              <Card
                key={song.id}
                className="group hover:bg-accent transition-colors"
              >
                <CardContent className="p-4">
                  <div className="relative aspect-square mb-4">
                    <PreviewComponent
                      component="image"
                      data={song.cover}
                      quality="500x500"
                    />
                    <PlayerDropdown song={song} />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCurrentSong(song)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MusicGenre;
