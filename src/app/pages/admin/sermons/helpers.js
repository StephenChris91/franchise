"use client";

import { supabase } from "@/utils/supabase";

export const handleSermonChange = (e, setForm, audioRef, setDuration) => {
  const { name, value, files } = e.target;

  if (name === "audioFile") {
    const file = files[0];
    setForm((prev) => ({ ...prev, audioFile: file }));
    const url = URL.createObjectURL(file);
    audioRef.current.src = url;
  } else if (name === "thumbnailFile") {
    setForm((prev) => ({ ...prev, thumbnailFile: files[0] }));
  } else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
};

export const handleSermonUpload = async (
  e,
  form,
  duration,
  setLoading,
  resetForm
) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { title, speaker, date, audioFile, thumbnailFile } = form;
    const audioFilename = audioFile.name;
    const thumbnailFilename = thumbnailFile?.name || null;

    if (!title || !date || !audioFile) {
      throw new Error("Missing required fields");
    }

    // Upload audio
    await supabase.storage
      .from("sermons-audio")
      .upload(audioFilename, audioFile, { upsert: true });

    // Upload thumbnail
    if (thumbnailFile) {
      await supabase.storage
        .from("sermons-thumbnail")
        .upload(thumbnailFilename, thumbnailFile, { upsert: true });
    }

    // Insert into DB
    await supabase.from("sermons").insert([
      {
        title,
        speaker,
        date,
        duration: Math.floor(duration),
        audio_url: audioFilename,
        thumbnail: thumbnailFilename,
        categories: form.categories
          ? form.categories.split(",").map((c) => c.trim().toLowerCase())
          : [],
      },
    ]);

    alert("✅ Sermon uploaded successfully.");
    resetForm();
  } catch (err) {
    console.error("Upload error:", err);
    alert("❌ Upload failed. Check console.");
  } finally {
    setLoading(false);
  }
};
