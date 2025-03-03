import { Playlist } from "@/lib/data";
import { atom, selector } from "recoil";

// Atom for the playlists
export const playlistsState = atom<Playlist[]>({
  key: "playlistsState",
  default: [],
});

// Selector for the playlists
export const userPlayLists = selector({
  key: "userPlaylistsState",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    return playlists;
  },
});
