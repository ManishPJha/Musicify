import { Link } from "react-router-dom";
import { Home, Library, Search } from "lucide-react";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

import { renderVerticalNavigationItems } from "@/view/renderVerticalNavItems";
import { Typography } from "@/components/Typography";
import { VerticalNavItemsSkeleton } from "../skeleton/navigation/VerticalNavItemsSkeleton";

import { usePlaylists } from "@/hooks/use-playlists";
import { useAuth } from "@/contexts/AuthContext";

import { playlistsState } from "@recoil/playlistState";

const VerticalNavItems = () => {
  const { user } = useAuth();
  const [playlists, savePlaylists] = useRecoilState(playlistsState);

  const { data, isLoading: isLoadingPlaylists } = usePlaylists(user?.id);

  const navItems = [
    { label: "Home", path: "/", icon: <Home /> },
    { label: "search", path: "/search", icon: <Search /> },
    { label: "Your Library", path: "/library", icon: <Library /> },
  ];

  useEffect(() => {
    if (!isLoadingPlaylists && data.length > 0) {
      savePlaylists(data);
    }
  }, [data, isLoadingPlaylists, savePlaylists]);

  function renderPlaylists() {
    return (
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
    );
  }

  if (isLoadingPlaylists) {
    return <VerticalNavItemsSkeleton />;
  }

  return (
    <>
      <nav className="space-y-4 mb-6">
        {renderVerticalNavigationItems(navItems)}
      </nav>
      <div className="space-y-4">
        <Typography variant="span">PLAYLISTS</Typography>
        {renderPlaylists()}
      </div>
    </>
  );
};

export default VerticalNavItems;
