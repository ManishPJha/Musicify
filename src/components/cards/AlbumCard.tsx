import React from "react";
import { Play } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import PreviewComponent from "@/components/PreviewComponent";
import PlayerDropdown from "@/components/player/PlayerDropdown";
import { Button } from "@/components/ui/button";

import { useMusicPlayer } from "@/hooks/use-musicPlayer";

import { Song } from "@/lib/data";

interface AlbumCardProps {
  song: Song;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ song }) => {
  const { setCurrentSong, setIsPlaying } = useMusicPlayer();

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <Card key={song.id} className="group hover:bg-accent transition-colors">
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
            onClick={() => playSong(song)}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="font-semibold truncate">{song.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
