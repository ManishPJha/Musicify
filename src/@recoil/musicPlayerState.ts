import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

import { Song } from "@/lib/data";

const { persistAtom } = recoilPersist({
  key: "musicPlayerState",
  storage: localStorage,
});

// Atom for the current track
export const currentTrackState = atom<Song | null>({
  key: "currentTrackState",
  default: null,
  effects_UNSTABLE: [persistAtom], // Persist this state
});

// Atom for the playback state (playing/paused)
export const isPlayingState = atom<boolean>({
  key: "isPlayingState",
  default: false,
});

// Selector for the last played track
export const lastPlayedTrackState = selector<Song | null>({
  key: "lastPlayedTrackState",
  get: ({ get }) => {
    const currentTrack = get(currentTrackState);
    return currentTrack;
  },
});
