"use client";

import { supabase } from "@/utils/supabase";

const handleCompressedUpload = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await fetch("/api/compress", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Compression/upload failed");

  return data.filename;
};

// 🧠 Fix: Handle all input fields and update form state
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

// 📤 Upload to Supabase
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
    const { title, speaker, date, audioFile, thumbnailFile, categories } = form;

    if (!title?.trim() || !date?.trim() || !audioFile) {
      alert("Please complete all required fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("title", title);
    formData.append("speaker", speaker || "");
    formData.append("date", date);
    formData.append("duration", duration);
    formData.append("categories", categories || "");
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/sermons",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    alert("✅ Sermon uploaded successfully");
    resetForm();
  } catch (err) {
    console.error("Upload Error:", err);
    alert(`❌ Upload failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
