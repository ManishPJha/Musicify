import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  onResults: (songs: never[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SearchBar({
  onResults,
  isLoading,
  setIsLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    onResults([]);

    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jiosaavn", {
        body: { type: "search", query: query.trim() },
      });

      if (error) throw error;
      onResults(data.songs);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Failed to search for songs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl">
      <Input
        type="search"
        placeholder="Search for songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-muted"
      />
      <Button type="submit" disabled={isLoading}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
