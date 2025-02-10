export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: JioSaavnImage[];
  audio: JioSaavnDownloadUrl[];
  duration: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: Song[];
}

export interface JioSaavnImage {
  quality: string;
  url: string;
}

export interface JioSaavnDownloadUrl {
  quality: string;
  url: string;
}

export interface Genre {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
}
