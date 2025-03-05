import React from "react";

import GenreSkeleton from "@/components/skeleton/GenreSkeleton";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/Typography";
import AlbumCard from "@/components/cards/AlbumCard";

import { Song, Genre } from "@/lib/data";

interface MusicGenreProps {
  genres: Genre[];
  songsByGenre: Record<string, Song[]>;
  isLoadingGenres: boolean;
  isLoadingSongs: boolean;
}

const MusicGenre: React.FC<MusicGenreProps> = ({
  genres,
  songsByGenre,
  isLoadingGenres,
  isLoadingSongs,
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
            <Typography variant="h3">{genre.name}</Typography>
            <Button variant="link">See all</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {songsByGenre?.[genre.id]?.map((song) => (
              <AlbumCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MusicGenre;
