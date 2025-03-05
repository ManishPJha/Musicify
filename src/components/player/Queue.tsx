import React, { useCallback } from "react";
import { List } from "lucide-react";
import update from "immutability-helper";
import { useRecoilState } from "recoil";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/Typography";
import QueueCard from "@/components/cards/QueueCard";

import { Song } from "@/lib/data";
import { queueState } from "@recoil/musicPlayerState";

interface QueueProps {
  queue: Song[];
  removeFromQueue: (id: string) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, removeFromQueue }) => {
  const [_, setSongsInQueue] = useRecoilState(queueState);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setSongsInQueue((prevSong: Song[]) =>
      update(prevSong, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevSong[dragIndex] as Song],
        ],
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
            <Typography variant="p" className={["text-center py-4"]}>
              Queue is empty
            </Typography>
          ) : (
            <div className="space-y-4">
              {queue.map((song, i) => (
                <QueueCard
                  key={song.id}
                  index={i}
                  song={song}
                  btnGroup={[
                    {
                      component: Button,
                      componentProps: {
                        onClick: () => removeFromQueue(song.id),
                        btnLabel: "Remove",
                        variant: "ghost",
                        size: "sm",
                      },
                    },
                  ]}
                  moveCard={moveCard}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Queue;
