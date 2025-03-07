import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Heart, List, ListPlus, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useMusicPlayer } from "@/hooks/use-musicPlayer";
import { useAddSongToFavorite } from "@/hooks/use-songs";
import { useAuth } from "@/contexts/AuthContext";
import { useAddSongToPlaylist } from "@/hooks/use-playlists";

import { Song } from "@/lib/data";
import { userPlayLists } from "@recoil/playlistState";
import PlaylistModal from "../playlist/PlaylistModal";

const PlayerDropdown: React.FC<{ song: Song }> = ({ song }) => {
  const playlists = useRecoilValue(userPlayLists);

  const { addToQueue } = useMusicPlayer();
  const { mutate: addSongToPlaylist } = useAddSongToPlaylist();
  const { mutate: addSongToFavorite } = useAddSongToFavorite();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitEnable, setIsSubmitEnable] = useState(false);

  const handleAddToFavorites = (song: Song) => {
    addSongToFavorite({ userId: user.id, songId: song.id });
  };

  const addSongToNewPlaylist = () => {
    setIsOpen(true);
    setIsSubmitEnable(true);
  };

  return (
    <>
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <List className="mr-2 h-4 w-4" />
              Add to Playlist
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-muted">
              <DropdownMenuSeparator />
              {playlists?.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() =>
                    addSongToPlaylist({ playlistId: p.id, songId: song.id })
                  }
                >
                  {p.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addSongToNewPlaylist()}>
                Add To New Playlist
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen && (
        <PlaylistModal
          addSongIdToCreatedPlaylist={isSubmitEnable}
          songId={song.id}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
};

export default PlayerDropdown;
