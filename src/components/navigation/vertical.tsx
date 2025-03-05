import { Link } from "react-router-dom";
import { Home, Library, Search } from "lucide-react";

import { renderVerticalNavigationItems } from "@/view/renderVerticalNavItems";

import { usePlaylists } from "@/hooks/use-playlists";
import { useAuth } from "@/contexts/AuthContext";
import { Typography } from "../Typography";

const VerticalNavItems = () => {
  const { user } = useAuth();

  const { data: playlists, isLoading: isLoadingPlaylists } = usePlaylists(
    user?.id
  );

  const navItems = [
    { label: "Home", path: "/", icon: <Home /> },
    { label: "search", path: "/search", icon: <Search /> },
    { label: "Your Library", path: "/library", icon: <Library /> },
  ];

  return (
    <>
      <nav className="space-y-4 mb-6">
        {renderVerticalNavigationItems(navItems)}
      </nav>
      <div className="space-y-4">
        <Typography variant="span">PLAYLISTS</Typography>
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
    </>
  );
};

export default VerticalNavItems;
