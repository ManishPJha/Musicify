import { useState } from "react";
import { Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { fetchSongsFromJioSaavanApi } from "@/services/songService";

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

  const { mutate: mutateSearchSongQuery, isPending } = useMutation({
    mutationFn: async () => {
      const songs = await fetchSongsFromJioSaavanApi(query);
      return songs;
    },
    onSuccess: (songs) => {
      onResults(songs); // Pass the search results to the parent component
      setIsLoading(false); // Set loading state back to false
    },
    onError: (error) => {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Failed to search for songs. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    onResults([]);

    if (!query.trim()) return;

    setIsLoading(true);
    mutateSearchSongQuery();
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
      <Button type="submit" disabled={isPending || isLoading}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
