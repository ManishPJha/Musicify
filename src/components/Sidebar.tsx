import { LogOut, Music } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChildrenWithRedirect } from "@/components/ChildrenWithRedirect";
import { Typography } from "@/components/Typography";
import VerticalNavItems from "@/components/navigation/vertical";

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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
          <Typography variant="h3">Musicify</Typography>
        </ChildrenWithRedirect>
      </div>

      <ScrollArea className="flex-1 px-6">
        {/* Navigation Items */}
        <VerticalNavItems />
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
