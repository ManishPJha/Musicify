import React, { createContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Song } from "@/lib/data";
import { LRUCache } from "@/lib/cache";

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffle: boolean;
  queue: Song[];
  recentlyPlayed: Song[];
  volume: number;
  currentTime: number;
  duration: number;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

// Initialize LRU Cache with capacity of 10 songs
const recentlyPlayedCache = new LRUCache(10);

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSong, setCurrentSongState] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const filteredPlayingTrack =
      typeof currentSong.audio === "string"
        ? JSON.parse(currentSong.audio).find((t) => t.quality === "320kbps").url
        : currentSong.audio.find((t) => t.quality === "320kbps").url;

    audioRef.current.src = filteredPlayingTrack;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      playNext(); // Directly call playNext when the song ends
    };

    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  const setCurrentSong = async (song: Song) => {
    try {
      const { data: existingSong } = await supabase
        .from("songs")
        .select("*")
        .eq("id", song.id)
        .single();

      if (!existingSong) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jiosaavn`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              type: "details",
              id: song.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch song details");
        }

        const songData = await response.json();
        song = songData.song;
      } else {
        song = existingSong as unknown as Song;
      }

      setCurrentSongState(song);
      recentlyPlayedCache.put(song.id, song);
      setRecentlyPlayed(recentlyPlayedCache.getRecent());
      setIsPlaying(true);
    } catch (error) {
      console.error("Error setting current song:", error);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addToQueue = (song: Song) => {
    console.log(
      "%c [ adding song to queue ]-170",
      "font-size:13px; background:#f8dd13; color:#ffff57;",
      song
    );
    setQueue((prev) => [...prev, song]);
  };

  const removeFromQueue = (songId: string) => {
    setQueue((prev) => prev.filter((song) => song.id !== songId));
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSongIndex = isShuffle
        ? Math.floor(Math.random() * queue.length)
        : 0;
      const nextSong = queue[nextSongIndex];
      setQueue((prev) => prev.filter((_, index) => index !== nextSongIndex));
      setCurrentSong(nextSong);
    } else {
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };

  const playPrevious = () => {
    const recentSongs = recentlyPlayedCache.getRecent();
    if (recentSongs.length > 1) {
      setCurrentSong(recentSongs[1]);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isShuffle,
        queue,
        recentlyPlayed,
        volume,
        currentTime,
        duration,
        setCurrentSong,
        togglePlay,
        toggleShuffle,
        setVolume,
        seek,
        addToQueue,
        removeFromQueue,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export default MusicPlayerContext;
