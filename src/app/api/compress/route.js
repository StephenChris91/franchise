import { NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

// Resolve platform-specific FFmpeg binary
const ffmpegBinaryPath = (() => {
  const basePath = path.resolve("node_modules", "ffmpeg-static");
  const isWindows = process.platform === "win32";
  const filename = isWindows ? "ffmpeg.exe" : "ffmpeg";
  const fullPath = path.join(basePath, filename);

  if (!existsSync(fullPath)) {
    console.error("❌ FFmpeg binary not found:", fullPath);
    throw new Error("FFmpeg binary not found. Please install ffmpeg-static.");
  }

  return fullPath;
})();

ffmpeg.setFfmpegPath(ffmpegBinaryPath);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    // Extract fields
    const audioFile = formData.get("audio");
    const title = formData.get("title");
    const speaker = formData.get("speaker");
    const date = formData.get("date");
    const duration = formData.get("duration");
    const categoriesRaw = formData.get("categories") || "";
    const thumbnailFile = formData.get("thumbnailFile");

    if (
      !audioFile ||
      typeof audioFile === "string" ||
      !title ||
      !date ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const categories = categoriesRaw
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const originalName = audioFile.name || "uploaded.mp3";
    const compressedName = originalName.replace(/\.mp3$/, "-compressed.mp3");

    const inputPath = path.join(os.tmpdir(), originalName);
    const outputPath = path.join(os.tmpdir(), compressedName);

    // Save uploaded file to disk
    await writeFile(inputPath, buffer);

    // Compress using FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioBitrate("96k")
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Read compressed file
    const uploadBuffer = await readFile(outputPath);

    // Upload audio to Supabase
    const audioUpload = await supabaseAdmin.storage
      .from("sermons-audio")
      .upload(compressedName, uploadBuffer, {
        upsert: true,
        contentType: "audio/mpeg",
      });

    if (audioUpload.error) {
      return NextResponse.json(
        { error: "Audio upload failed" },
        { status: 500 }
      );
    }

    // Upload thumbnail if provided
    let thumbnailName = "";
    if (thumbnailFile && thumbnailFile.name) {
      const thumbUpload = await supabaseAdmin.storage
        .from("sermons-thumbnail")
        .upload(thumbnailFile.name, thumbnailFile, {
          upsert: true,
          contentType: thumbnailFile.type,
        });

      if (thumbUpload.error) {
        return NextResponse.json(
          {
            error: "Thumbnail upload failed",
            detail: thumbUpload.error.message,
          },
          { status: 500 }
        );
      }

      thumbnailName = thumbnailFile.name;
    }

    // Insert sermon into DB
    const { error: dbError } = await supabaseAdmin.from("sermons").insert([
      {
        title,
        speaker,
        date,
        duration,
        audio_url: compressedName,
        thumbnail: thumbnailName || "/assets/sermon-fallback.jpg",
        categories,
      },
    ]);

    // Clean up local temp files
    await unlink(inputPath);
    await unlink(outputPath);

    if (dbError) {
      return NextResponse.json(
        { error: "DB insert failed", detail: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Upload and insert successful",
      filename: compressedName,
    });
  } catch (err) {
    console.error("Compression Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", detail: err.message },
      { status: 500 }
    );
  }
}
