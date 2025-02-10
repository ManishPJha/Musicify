import { Card, CardContent } from "@/components/ui/card";

const GenreSkeleton = () => (
  <section className="mb-8 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-8 w-48 bg-muted rounded"></div>
      <div className="h-8 w-16 bg-muted rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="group">
          <CardContent className="p-4">
            <div className="relative aspect-square mb-4 bg-muted rounded-md"></div>
            <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default GenreSkeleton;
