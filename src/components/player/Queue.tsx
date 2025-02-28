import React from "react";
import { List } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import QueueCard from "@/components/cards/QueueCard";

import { Song } from "@/lib/data";

interface QueueProps {
  queue: Song[];
  removeFromQueue: (id: string) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, removeFromQueue }) => {
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
            <p className="text-center text-muted-foreground py-4">
              Queue is empty
            </p>
          ) : (
            <div className="space-y-4">
              {queue.map((song) => (
                <QueueCard
                  key={song.id}
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
