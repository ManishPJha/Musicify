import { Skeleton } from "@/components/ui/skeleton";
export const PlaylistsSkeleton = ({
  loaderCount,
}: {
  loaderCount?: number;
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: loaderCount }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
};
