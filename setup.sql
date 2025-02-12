-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.playlist_songs CASCADE;
DROP TABLE IF EXISTS public.playlists CASCADE;
DROP TABLE IF EXISTS public.songs CASCADE;
DROP TABLE IF EXISTS public.genres CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create tables with proper relationships
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    duration TEXT NOT NULL,
    cover JSONB NOT NULL,
    audio JSONB NOT NULL,
    genre_id UUID REFERENCES public.genres(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.playlist_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS playlists_user_id_idx ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS playlist_songs_playlist_id_idx ON public.playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS songs_genre_id_idx ON public.songs(genre_id);

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$function$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Users can view their own playlists"
ON public.playlists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists"
ON public.playlists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
ON public.playlists FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
ON public.playlists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Playlist songs policies
CREATE POLICY "Users can view songs in their playlists"
ON public.playlist_songs FOR SELECT
TO authenticated
USING (
    playlist_id IN (
        SELECT id FROM public.playlists WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can add songs to their playlists"
ON public.playlist_songs FOR INSERT
TO authenticated
WITH CHECK (
    playlist_id IN (
        SELECT id FROM public.playlists WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can remove songs from their playlists"
ON public.playlist_songs FOR DELETE
TO authenticated
USING (
    playlist_id IN (
        SELECT id FROM public.playlists WHERE user_id = auth.uid()
    )
);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites"
ON public.favorites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favorites"
ON public.favorites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Songs and Genres policies (public read access)
CREATE POLICY "Anyone can view songs"
ON public.songs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can view genres"
ON public.genres FOR SELECT
TO authenticated
USING (true);

-- Insert some initial genres values so that the genre-based search works.
INSERT INTO public.genres (name, description) VALUES
('Pop', 'Popular music genre with catchy melodies and rhythms'),
('Rock', 'Guitar-driven music with strong beats and powerful vocals'),
('Hip Hop', 'Urban music characterized by rhythmic vocals and beats'),
('Electronic', 'Music produced using electronic technology and instruments'),
('Classical', 'Traditional Western music from the classical period'),
('Jazz', 'Complex rhythm patterns with improvisation');


-- Create a new storage bucket for playlist covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('playlist-covers', 'playlist-covers', true);

-- Create a policy to allow authenticated users to upload files
CREATE POLICY "Anyone can read playlist covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'playlist-covers');

CREATE POLICY "Authenticated users can upload playlist covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'playlist-covers');

CREATE POLICY "Users can update their own playlist covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'playlist-covers');

CREATE POLICY "Users can delete their own playlist covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'playlist-covers');
