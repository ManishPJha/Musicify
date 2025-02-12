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
import { useMusicPlayer } from "@/hooks/use-musicPlayer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { Song } from "@/lib/data";
import PreviewComponent from "./PreviewComponent";
import Seekbar from "@/components/player/SeekBar";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    queue,
    volume,
    setVolume,
    togglePlay,
    playNext,
    playPrevious,
    removeFromQueue,
    toggleShuffle,
    isShuffle,
    currentTime,
    duration,
    seek,
  } = useMusicPlayer();

  const [playingTrack, setPlayingTrack] = useState<Song>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  // Ensure the track data is correctly parsed and has audio & cover data as arrays
  useEffect(() => {
    if (currentSong) {
      setPlayingTrack({
        ...currentSong,
        cover:
          typeof currentSong.cover === "string"
            ? JSON.parse(currentSong.cover)
            : currentSong.cover,
        audio:
          typeof currentSong.audio === "string"
            ? JSON.parse(currentSong.audio)
            : currentSong.audio,
      });
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (values: number[]) => {
    seek(values[0]);
  };

  if (!playingTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary p-4 border-t border-muted animate-slide-up">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Seek bar */}
        <Seekbar
          appTime={currentTime}
          duration={duration}
          handleSeek={handleSeek}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PreviewComponent
              component="image"
              data={playingTrack.cover}
              quality="50x50"
            />
            <div>
              <h4 className="font-medium">{currentSong.title}</h4>
              <p className="text-sm text-muted-foreground">
                {currentSong.artist}
              </p>
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Queue</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  {queue.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Queue is empty
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {queue.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary"
                        >
                          <PreviewComponent
                            component="image"
                            data={song.cover}
                            quality="50x50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {song.title}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {song.artist}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromQueue(song.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
