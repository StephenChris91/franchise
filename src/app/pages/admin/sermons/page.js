"use client";

import React, { useRef, useState } from "react";
import {
  FileInput,
  Button,
  TextInput,
  Datepicker,
  Spinner,
  Progress,
} from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";

export default function SermonsUploadPage() {
  const audioRef = useRef();
  const formRef = useRef();

  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressColor, setProgressColor] = useState("blue");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    speaker: "",
    date: "",
    audioFile: null,
    thumbnailFile: null,
    categories: "",
  });

  const handleChange = (e) => {
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

  const resetForm = () => {
    setForm({
      title: "",
      speaker: "",
      date: "",
      audioFile: null,
      thumbnailFile: null,
      categories: "",
    });
    setDuration(null);
    setUploadProgress(0);
    setProgressColor("blue");

    // Trigger fade animation on form clear
    if (formRef.current) {
      formRef.current.classList.add("animate-fadeOut");
      setTimeout(() => {
        formRef.current.classList.remove("animate-fadeOut");
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    setProgressColor("blue");

    try {
      const { title, speaker, date, audioFile, thumbnailFile, categories } =
        form;

      if (!title?.trim() || !date?.trim() || !audioFile || !duration) {
        toast.error("Please complete all required fields.");
        setLoading(false);
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

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/sermons",
        true
      );
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setLoading(false);

        if (xhr.status === 200) {
          setProgressColor("green");
          setUploadProgress(100);
          toast.success("Sermon uploaded successfully!");
          setTimeout(resetForm, 1500); // let progress bar sit at 100%
        } else {
          setProgressColor("red");
          const error = JSON.parse(xhr.responseText);
          toast.error(`Upload failed: ${error?.error || "Unknown error"}`);
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        setProgressColor("red");
        toast.error("Network error. Please try again.");
      };

      xhr.send(formData);
    } catch (err) {
      setLoading(false);
      setProgressColor("red");
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 bg-white rounded shadow pb-44 relative">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-6">Upload New Sermon</h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 transition-opacity duration-500"
      >
        <TextInput
          id="title"
          name="title"
          placeholder="Enter sermon title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <TextInput
          id="speaker"
          name="speaker"
          placeholder="Speaker"
          value={form.speaker}
          onChange={handleChange}
        />

        <TextInput
          id="categories"
          name="categories"
          placeholder="e.g. Faith, Leadership, Healing"
          value={form.categories}
          onChange={handleChange}
        />

        <Datepicker
          id="date"
          name="date"
          onChange={(date) => {
            const formattedDate = date?.toISOString().split("T")[0];
            handleChange({
              target: {
                name: "date",
                value: formattedDate,
              },
            });
          }}
        />

        <FileInput
          id="audioFile"
          name="audioFile"
          accept=".mp3"
          required
          onChange={handleChange}
        />

        <FileInput
          id="thumbnailFile"
          name="thumbnailFile"
          accept="image/*"
          onChange={handleChange}
        />

        {duration && (
          <p className="text-sm text-gray-600">
            Duration: <strong>{Math.floor(duration / 60)} mins</strong>
          </p>
        )}

        {uploadProgress > 0 && (
          <Progress
            progress={uploadProgress}
            label={`${uploadProgress}%`}
            color={progressColor}
            size="md"
          />
        )}

        <Button type="submit" disabled={loading || !duration}>
          {loading ? <Spinner size="sm" className="mr-2" /> : null}
          Upload Sermon
        </Button>
      </form>

      <audio
        ref={audioRef}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        hidden
      />
    </div>
  );
}
