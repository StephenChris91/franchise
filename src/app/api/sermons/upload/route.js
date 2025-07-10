// app/api/sermons/upload/route.js
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req) {
  const formData = await req.formData();

  const title = formData.get("title");
  const speaker = formData.get("speaker");
  const date = formData.get("date");
  const duration = formData.get("duration");
  const audioFile = formData.get("audioFile");
  const thumbnailFile = formData.get("thumbnailFile");

  if (!audioFile || !title || !date || !duration) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Upload audio
  const { error: audioError } = await supabaseAdmin.storage
    .from("sermons-audio")
    .upload(audioFile.name, audioFile, {
      contentType: audioFile.type,
      upsert: true,
    });

  if (audioError) {
    return new Response(
      JSON.stringify({ error: "Audio upload failed", audioError }),
      {
        status: 500,
      }
    );
  }

  let thumbnailName = "";
  if (thumbnailFile && thumbnailFile.name) {
    const { error: thumbError } = await supabaseAdmin.storage
      .from("sermons-thumbnail")
      .upload(thumbnailFile.name, thumbnailFile, {
        contentType: thumbnailFile.type,
        upsert: true,
      });

    if (thumbError) {
      return new Response(
        JSON.stringify({ error: "Thumbnail upload failed", thumbError }),
        { status: 500 }
      );
    }

    thumbnailName = thumbnailFile.name;
  }

  // Insert metadata
  const { error: dbError } = await supabaseAdmin.from("sermons").insert([
    {
      title,
      speaker,
      date,
      duration,
      audio_url: audioFile.name,
      thumbnail: thumbnailName || "/assets/sermon-fallback.jpg",
    },
  ]);

  if (dbError) {
    return new Response(
      JSON.stringify({ error: "DB insert failed", dbError }),
      {
        status: 500,
      }
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
