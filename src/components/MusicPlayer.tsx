import { useEffect, useRef, useState } from "react";

import { useMusicPlayer } from "@/hooks/use-musicPlayer";

import Seekbar from "@/components/player/SeekBar";
import Controls from "@/components/player/Controls";

import { Song } from "@/lib/data";

export function MusicPlayer() {
  const { currentSong, volume, currentTime, duration, seek, setVolume } =
    useMusicPlayer();

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

        {/* Controls */}
        <Controls
          playingTrack={playingTrack}
          isMuted={isMuted}
          toggleMute={toggleMute}
          handleVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
