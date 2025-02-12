import { Home, Library, Search, LogOut, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { usePlaylists } from "@/hooks/use-playlists";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChildrenWithRedirect } from "@/components/ChildrenWithRedirect";

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const { data: playlists, isLoading: isLoadingPlaylists } = usePlaylists(
    user?.id
  );

  const logoutMutation = useMutation({
    mutationFn: async () => await signOut(),
    onSuccess: () => {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignOut = () => logoutMutation.mutate();

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
