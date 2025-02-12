import { Play } from "lucide-react";
import { Link } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";
import { useMusicPlayer } from "@/hooks/use-musicPlayer";

import { Playlist } from "@/lib/data";

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: () => void;
}

export function PlaylistCard({ playlist, onPlay }: PlaylistCardProps) {
  const { setCurrentSong } = useMusicPlayer();
  const { toast } = useToast();

  const handlePlay = () => {
    if (playlist.songs.length === 0) {
      toast({
        title: "No songs in playlist",
        description: "Add some songs to this playlist first",
        variant: "destructive",
      });
      return;
    }

    setCurrentSong(playlist.songs[0]);
    onPlay?.();
  };

  return (
    <Link to={`/playlist/${playlist.id}`}>
      <div className="group bg-muted p-4 rounded-lg transition-all hover:bg-muted/80">
        <div className="relative">
          <img
            src={playlist.cover}
            alt={playlist.title}
            className="w-full aspect-square object-cover rounded-md mb-4"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePlay();
            }}
            className="absolute bottom-6 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play size={20} className="text-white" />
          </button>
        </div>
        <h3 className="font-semibold mb-1">{playlist.title}</h3>
        <p className="text-sm text-gray-400">{playlist.description}</p>
      </div>
    </Link>
  );
}
