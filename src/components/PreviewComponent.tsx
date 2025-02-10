import React, { useMemo } from "react";

import type { JioSaavnImage, JioSaavnDownloadUrl } from "@/lib/data";

type PreviewComponentProps =
  | {
      component: "image";
      data: Array<JioSaavnImage>;
      quality: string;
    }
  | {
      component: "audio";
      data?: Array<JioSaavnDownloadUrl>;
      quality?: string;
      audioRef: React.Ref<HTMLAudioElement> | null;
      repeat: boolean;
      muted: boolean;
      onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
      onLoadedData: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
      onEnded: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
    }
  | {
      component: "placeholder";
      data?: Array<JioSaavnImage | JioSaavnDownloadUrl>;
      quality?: string;
    };

interface PreviewAudioComponentProps {
  data: JioSaavnDownloadUrl;
  audioRef?: React.Ref<HTMLAudioElement> | null;
  repeat?: boolean;
  muted?: boolean;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  onLoadedData?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  onEnded?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
}

interface PreviewImageComponentProps {
  data: JioSaavnImage;
}

const PreviewAudioComponent = ({
  data,
  audioRef,
  repeat = false,
  muted = false,
  onTimeUpdate,
  onLoadedData,
  onEnded,
}: PreviewAudioComponentProps) => {
  if (!data) {
    return (
      <div className="w-full h-12 bg-muted animate-pulse rounded-md">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <audio
        playsInline
        src={data.url}
        loop={repeat}
        muted={muted}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        onEnded={onEnded}
        ref={audioRef}
      />
    </div>
  );
};

const PreviewImageComponent = ({ data }: PreviewImageComponentProps) => {
  if (!data) {
    return (
      <div className="w-full h-full bg-muted animate-pulse rounded-md">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <img
        src={data.url}
        alt={`cover_${data.quality}`}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );
};

const PreviewComponent: React.FC<PreviewComponentProps> = ({
  component,
  data,
  quality,
  ...props
}) => {
  const componentMapper = {
    audio: (props: PreviewAudioComponentProps) => (
      <PreviewAudioComponent {...props} />
    ),
    image: (props: PreviewImageComponentProps) => (
      <PreviewImageComponent {...props} />
    ),
    placeholder: () => (
      <div className="w-full h-full bg-muted animate-pulse rounded-md">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    ),
  };

  const selectedQualityData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // If quality is provided, attempt to find matching data; otherwise, use the first element.
    if (quality) {
      return data.find((d) => d.quality === quality) || null;
    }

    return data[0];
  }, [data, quality]);

  if (!selectedQualityData) {
    return componentMapper.placeholder();
  }

  return componentMapper[component]({ data: selectedQualityData, ...props });
};

export default PreviewComponent;
