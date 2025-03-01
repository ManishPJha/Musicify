import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";

import PreviewComponent from "@/components/PreviewComponent";

import { Song, ChildrenProps } from "@/lib/data";
import { cn } from "@/lib/utils";

interface QueueCardProps {
  song: Song;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  btnGroup?: Array<ChildrenProps>;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const QueueCard: React.FC<QueueCardProps> = ({
  song,
  btnGroup,
  index,
  moveCard,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const id = song.id;

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer",
        isDragging ? "opacity-0" : "opacity-100"
      )}
      data-handler-id={handlerId}
    >
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
