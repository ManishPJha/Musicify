import React, { useEffect } from "react";

import { Heart, List, ListPlus, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useMusicPlayer } from "@/hooks/use-musicPlayer";
import { useAddSongToFavorite } from "@/hooks/use-songs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { Song } from "@/lib/data";

const PlayerDropdown: React.FC<{ song: Song }> = ({ song }) => {
  const { addToQueue } = useMusicPlayer();
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    mutate: addSongToFavorite,
    isError,
    error,
    isSuccess,
  } = useAddSongToFavorite();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: `${song.title} has been added to your favorites`,
      });
    }
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to add song to favorites",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, error]);

  const handleAddToFavorites = (song: Song) => {
    addSongToFavorite({ userId: user.id, songId: song.id });
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
