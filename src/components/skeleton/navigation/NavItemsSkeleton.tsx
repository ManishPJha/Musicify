import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

export const NavItemsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center space-x-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
};
