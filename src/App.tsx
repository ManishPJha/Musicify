import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { AuthProvider } from "@/contexts/AuthContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import PlaylistDetail from "@/pages/PlaylistDetail";
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <MusicPlayer />
          </div>
          <Toaster />
        </BrowserRouter>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}

export default App;