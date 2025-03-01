import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Sidebar } from "@/components/Sidebar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Toaster } from "@/components/ui/toaster";

import { AuthProvider } from "@/contexts/AuthContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";

import Index from "@/pages/Index";
import PlaylistDetail from "@/pages/PlaylistDetail";
import Library from "@/pages/Library";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <BrowserRouter>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 min-h-screen pb-24 bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/playlist/:id" element={<PlaylistDetail />} />
                <Route path="/library" element={<Library />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <MusicPlayer />
          </div>
          <Toaster />
          <ReactQueryDevtools position="bottom" />
        </BrowserRouter>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}

export default App;
