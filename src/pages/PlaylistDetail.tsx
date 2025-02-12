import { useParams } from "react-router-dom";
import { Heart, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PreviewComponent from "@/components/PreviewComponent";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useGetPlaylistSongs } from "@/hooks/use-playlists";

import { supabase } from "@/integrations/supabase/client";

import { JioSaavnImage } from "@/lib/data";
import { useGetFavoritesSongs } from "@/hooks/use-songs";

export default function PlaylistDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: playlist, isLoading: playlistLoading } =
    useGetPlaylistSongs(id);

  const { data: favorites } = useGetFavoritesSongs(user?.id);

  const handleToggleFavorite = async (songId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add songs to favorites",
        variant: "destructive",
      });
      return;
    }

    const isFavorite = favorites?.includes(songId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) throw error;

      toast({
        title: "Removed from favorites",
        description: "Song has been removed from your favorites",
      });
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, song_id: songId });

      if (error) throw error;

      toast({
        title: "Added to favorites",
        description: "Song has been added to your favorites",
      });
    }
  };

  if (playlistLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!playlist) {
    return <div className="p-6">Playlist not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-start gap-6 mb-8">
        <img
          src={playlist.cover_image || "/placeholder.svg"}
          alt={playlist.name}
          className="w-48 h-48 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-gray-400 mb-4">{playlist.description}</p>
          <Button>
            <Plus className="mr-2" />
            Add Songs
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-24rem)]">
        <div className="space-y-2">
          {playlist.playlist_songs?.map((playlistSong) => (
            <div
              key={playlistSong.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-4">
                <PreviewComponent
                  component="image"
                  data={playlistSong.songs.cover as unknown as JioSaavnImage[]}
                  quality="150x150"
                />
                <div>
                  <h3 className="font-medium">{playlistSong.songs.title}</h3>
                  <p className="text-sm text-gray-400">
                    {playlistSong.songs.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(playlistSong.songs.id)}
                  className={
                    favorites?.includes(playlistSong.songs.id)
                      ? "text-primary"
                      : "text-gray-400"
                  }
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
