import { Skeleton } from "@/components/ui/skeleton";

import { NavItemsSkeleton } from "./NavItemsSkeleton";
import { PlaylistsSkeleton } from "./PlaylistsSkeleton";

export const VerticalNavItemsSkeleton = () => {
  return (
    <>
      <nav className="space-y-4 mb-6">
        <NavItemsSkeleton />
      </nav>
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" /> {/* Simulate the "PLAYLISTS" text */}
        <PlaylistsSkeleton loaderCount={4} />
      </div>
    </>
  );
};
