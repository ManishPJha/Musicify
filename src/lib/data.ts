import { ButtonProps } from "@/components/ui/button";

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
  cover_image: string | null;
  cover_bucket_key: string | null;
  created_at: string;
  description: string | null;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
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

type ButtonComponentProps = ButtonProps & {
  onClick: () => void;
  btnLabel: string;
};

export interface ChildrenProps {
  component: React.ElementType<ButtonProps>;
  componentProps: ButtonComponentProps;
}
