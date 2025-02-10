import React from "react";

import { Heart, List, ListPlus, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useMusicPlayer } from "@/hooks/useMusicPlayer";

import { Song } from "@/lib/data";

const PlayerDropdown = ({ song }: { song: Song }) => {
  const { addToQueue } = useMusicPlayer();

  const handleAddToFavorites = (song: Song) => {
    // Add song to favorites
    console.log(`Adding ${song.title} to favorites`);
    // addToFavorites(song);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        asChild
      >
        <Button size="icon" variant="secondary" className="h-10 w-10">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-muted">
        <DropdownMenuItem onClick={() => addToQueue(song)}>
          <ListPlus className="mr-2 h-4 w-4" />
          Add to Queue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToFavorites(song)}>
          <Heart className="mr-2 h-4 w-4" />
          Add to Favorites
        </DropdownMenuItem>
        <DropdownMenuItem>
          <List className="mr-2 h-4 w-4" />
          Add to Playlist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlayerDropdown;
