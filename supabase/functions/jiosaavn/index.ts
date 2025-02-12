import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function transformSong(song: any) {
  // Get the complete image array, or create a default one
  const imageArray = Array.isArray(song.image) ? song.image : [];

  // Get the complete download URL array, or create a default one
  const downloadUrlArray = Array.isArray(song.downloadUrl)
    ? song.downloadUrl
    : [];

  // Get primary artists names
  const artistNames =
    song.artists?.primary?.map((artist: any) => artist.name).join(", ") ||
    "Unknown Artist";

  return {
    id: song.id,
    title: song.name,
    artist: artistNames,
    album: song.album?.name || "Unknown Album",
    duration: song.duration ? Math.floor(song.duration).toString() : "0",
    cover: imageArray,
    audio: downloadUrlArray,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type, id, genre } = await req.json();

    if (type === "search") {
      console.log("Searching for:", query);

      const response = await fetch(
        `https://jiosaavn-api-snowy-nine.vercel.app/api/search/songs?query=${encodeURIComponent(
          query
        )}&page=1&limit=10`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Search failed");
      }

      const songs = await Promise.all(
        data.data.results.map(async (song: any) => {
          const transformedSong = transformSong(song);

          // Cache the song in Supabase
          const { error } = await supabase
            .from("songs")
            .upsert(transformedSong, { onConflict: "id" });

          if (error) {
            console.error("Error caching song:", error);
          }

          return transformedSong;
        })
      );

      return new Response(JSON.stringify({ songs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (type === "genre") {
      console.log("Fetching songs for genre:", genre);

      // Get genre-specific search terms
      const searchTerms: Record<string, string> = {
        Pop: "latest pop hits",
        Rock: "rock classics",
        "Hip Hop": "hip hop hits",
        Electronic: "electronic dance music",
        Classical: "classical masterpieces",
        Jazz: "jazz essentials",
      };

      const searchTerm = searchTerms[genre] || genre;

      const response = await fetch(
        `https://jiosaavn-api-snowy-nine.vercel.app/api/search/songs?query=${encodeURIComponent(
          searchTerm
        )}&page=1&limit=10`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Genre search failed");
      }

      // Get genre ID from Supabase
      const { data: genreData } = await supabase
        .from("genres")
        .select("id")
        .eq("name", genre)
        .single();

      const songs = await Promise.all(
        data.data.results.map(async (song: any) => {
          const transformedSong = {
            ...transformSong(song),
            genre_id: genreData?.id,
          };

          // Cache the song in Supabase
          const { error } = await supabase
            .from("songs")
            .upsert(transformedSong, { onConflict: "id" });

          if (error) {
            console.error("Error caching song:", error);
          }

          return transformedSong;
        })
      );

      return new Response(JSON.stringify({ songs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (type === "details") {
      console.log("Fetching details for song:", id);

      const response = await fetch(
        `https://jiosaavn-api-snowy-nine.vercel.app/api/songs/${id}`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch song details");
      }

      const transformedSong = transformSong(data.data);

      return new Response(JSON.stringify({ song: transformedSong }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type parameter" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
