// src/app/api/sermons/route.js

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const { resources } = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "sermons",
      resource_type: "video", // audio files are under "video"
      max_results: 100,
    });

    const sermons = await Promise.all(
      resources.map(async (item) => {
        const baseId = item.public_id;

        let thumbnail = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${baseId}.jpg`;

        // Check if thumbnail image exists
        try {
          await cloudinary.v2.api.resource(baseId, {
            resource_type: "image",
          });
        } catch (err) {
          thumbnail = "/assets/sermon-fallback.jpg";
        }

        return {
          public_id: item.public_id,
          title: item.public_id.split("/").pop().replace(/[-_]/g, " "),
          audioUrl: item.secure_url,
          duration: item.duration,
          date: new Date(item.created_at).toLocaleDateString("en-GB"),
          thumbnail,
        };
      })
    );

    return new Response(JSON.stringify(sermons), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching sermons:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch sermons" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
