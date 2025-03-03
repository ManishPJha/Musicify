import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  List,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import PreviewComponent from "@/components/PreviewComponent";
import Queue from "./Queue";

import { useMusicPlayer } from "@/hooks/use-musicPlayer";

import { cn } from "@/lib/utils";
import { Song } from "@/lib/data";

interface ControlsProps {
  playingTrack: Song;
  isMuted: boolean;
  toggleMute: () => void;
  handleVolumeChange: (values: number[]) => void;
}

const Controls: React.FC<ControlsProps> = ({
  playingTrack,
  isMuted,
  toggleMute,
  handleVolumeChange,
}) => {
  const {
    currentSong,
    isPlaying,
    isShuffle,
    volume,
    queue,
    togglePlay,
    toggleShuffle,
    playPrevious,
    playNext,
    removeFromQueue,
  } = useMusicPlayer();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <PreviewComponent
          component="image"
          data={playingTrack.cover}
          quality="50x50"
        />
        <div>
          <h4 className="font-medium">{currentSong.title}</h4>
          <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleShuffle}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            isShuffle && "text-primary hover:text-primary"
          )}
        >
          <Shuffle size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={playPrevious}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipBack size={20} />
        </Button>
        <Button
          onClick={togglePlay}
          size="icon"
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={playNext}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipForward size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={20} />
            ) : (
              <Volume2 size={20} />
            )}
          </Button>
          <Slider
            defaultValue={[volume * 100]}
            value={[volume * 100]}
            max={100}
            step={1}
            className="w-24"
            onValueChange={handleVolumeChange}
          />
        </div>

        {/* Queue */}
        <Queue queue={queue} removeFromQueue={removeFromQueue} />
      </div>
    </div>
  );
};

export default Controls;
