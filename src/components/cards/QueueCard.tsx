import React from "react";

import PreviewComponent from "@/components/PreviewComponent";

import { Song, ChildrenProps } from "@/lib/data";

interface QueueCardProps {
  song: Song;
  btnGroup?: Array<ChildrenProps>;
}

const QueueCard: React.FC<QueueCardProps> = ({ song, btnGroup }) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary">
      <PreviewComponent component="image" data={song.cover} quality="50x50" />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{song.title}</h4>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
      <div className="flex gap-2">
        {btnGroup?.map(
          (
            { component: Component, componentProps: { btnLabel, ...rest } },
            index
          ) => (
            <Component key={`${btnLabel}-${index}`} {...rest}>
              {btnLabel}
            </Component>
          )
        )}
      </div>
    </div>
  );
};

export default QueueCard;
