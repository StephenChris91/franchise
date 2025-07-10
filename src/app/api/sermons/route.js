import { createClient } from "@supabase/supabase-js";

// IMPORTANT: service role key used only on the server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase.from("sermons").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify([]), { status: 500 });
    }

    const signed = await Promise.all(
      data.map(async (sermon) => {
        const { data: audioSigned, error: audioError } = await supabase.storage
          .from("sermons-audio")
          .createSignedUrl(sermon.audio_url, 60 * 60); // audio_url = Discipline.mp3

        const { data: thumbSigned } = await supabase.storage
          .from("sermons-thumbnails")
          .createSignedUrl(sermon.thumbnail, 60 * 60);

        return {
          ...sermon,
          audioUrl: audioSigned?.signedUrl || null,
          thumbnail: thumbSigned?.signedUrl || "/assets/sermon-fallback.jpg",
        };
      })
    );

    return new Response(JSON.stringify(signed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
