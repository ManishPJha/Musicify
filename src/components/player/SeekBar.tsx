import React from "react";

import { Slider } from "@/components/ui/slider";

import { getTime } from "@/lib/utils";

interface SeekBarProps {
  appTime: number;
  duration: number;
  handleSeek: (value: number[]) => void;
}

const Seekbar = ({ appTime, duration, handleSeek }: SeekBarProps) => {
  return (
    <div className="flex items-center gap-2 px-2">
      <span className="text-xs text-muted-foreground w-12 text-right">
        {getTime(appTime)}
      </span>
      <Slider
        value={[appTime]}
        max={duration}
        step={1}
        className="flex-1"
        onValueChange={handleSeek}
      />
      <span className="text-xs text-muted-foreground w-12">
        {getTime(duration)}
      </span>
    </div>
  );
};

export default React.memo(Seekbar);
