import { Home, Library, Search, LogOut, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildrenWithRedirect } from "./ChildrenWithRedirect";

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const { data: playlists } = useQuery({
    queryKey: ["playlists", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 w-64 h-screen bg-secondary">
      <div className="flex items-center gap-2 p-6">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Music className="w-4 h-4 text-white" />
        </div>
        <ChildrenWithRedirect redirectTo="/">
          <span className="text-xl font-bold">Musicify</span>
        </ChildrenWithRedirect>
      </div>

      <ScrollArea className="flex-1 px-6">
        <nav className="space-y-4 mb-6">
          <Link
            to="/"
            className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors"
          >
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors"
          >
            <Search size={24} />
            <span>Search</span>
          </Link>
          <Link
            to="/library"
            className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors"
          >
            <Library size={24} />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-400">
            YOUR PLAYLISTS
          </h2>
          <div className="space-y-2">
            {playlists?.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="block text-sm text-gray-300 hover:text-white transition-colors py-1"
              >
                {playlist.name}
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
