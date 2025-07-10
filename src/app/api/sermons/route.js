import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data: sermons, error } = await supabase.from("sermons").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify([]), { status: 500 });
    }

    const signedSermons = await Promise.all(
      sermons.map(async (sermon) => {
        const audioRes = await supabase.storage
          .from("sermons-audio")
          .createSignedUrl(sermon.audio_url, 60 * 60);

        let thumbnailRes = null;
        if (sermon.thumbnail) {
          thumbnailRes = await supabase.storage
            .from("sermons-thumbnail")
            .createSignedUrl(sermon.thumbnail, 60 * 60);
        }

        return {
          ...sermon,
          audioUrl: audioRes?.data?.signedUrl || null,
          thumbnail:
            thumbnailRes?.data?.signedUrl || "/assets/sermon-fallback.jpg",
        };
      })
    );

    return new Response(JSON.stringify(signedSermons), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
