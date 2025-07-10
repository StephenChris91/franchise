"use client";

import React, { useRef, useState } from "react";
import {
  FileInput,
  Label,
  Button,
  TextInput,
  Datepicker,
  Spinner,
} from "flowbite-react";
import { handleSermonChange, handleSermonUpload } from "./helpers";

export default function SermonsUploadPage() {
  const audioRef = useRef();
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    speaker: "",
    date: "",
    audioFile: null,
    thumbnailFile: null,
  });

  const resetForm = () => {
    setForm({
      title: "",
      speaker: "",
      date: "",
      audioFile: null,
      thumbnailFile: null,
    });
    setDuration(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Upload New Sermon</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          try {
            const formPayload = new FormData();
            formPayload.append("title", form.title);
            formPayload.append("speaker", form.speaker);
            formPayload.append("date", form.date);
            formPayload.append("duration", duration);
            formPayload.append("audioFile", form.audioFile);
            if (form.thumbnailFile) {
              formPayload.append("thumbnailFile", form.thumbnailFile);
            }

            const res = await fetch("/api/sermons/upload", {
              method: "POST",
              body: formPayload,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            alert("Sermon uploaded successfully");
            resetForm();
          } catch (err) {
            alert(err.message || "Upload failed");
          } finally {
            setLoading(false);
          }
        }}
        className="flex flex-col gap-6"
      >
        <div>
          <Label
            htmlFor="title"
            value="Sermon Title"
            className="text-sm font-medium text-gray-700"
          />
          <TextInput
            id="title"
            name="title"
            placeholder="Enter sermon title"
            value={form.title}
            onChange={(e) =>
              handleSermonChange(e, setForm, audioRef, setDuration)
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="speaker" value="Speaker" />
          <TextInput
            id="speaker"
            name="speaker"
            placeholder="Speaker"
            value={form.speaker}
            onChange={(e) =>
              handleSermonChange(e, setForm, audioRef, setDuration)
            }
          />
        </div>

        <div>
          <Label htmlFor="date" value="Date" />
          <Datepicker
            id="date"
            name="date"
            placeholder="Select sermon date"
            onChange={(val) => {
              const formattedDate = val?.toISOString().split("T")[0]; // YYYY-MM-DD
              handleSermonChange(
                {
                  target: {
                    name: "date",
                    value: formattedDate,
                  },
                },
                setForm,
                audioRef,
                setDuration
              );
            }}
          />
        </div>

        <div>
          <Label htmlFor="audioFile" value="MP3 File" />
          <FileInput
            id="audioFile"
            name="audioFile"
            accept=".mp3"
            required
            onChange={(e) =>
              handleSermonChange(e, setForm, audioRef, setDuration)
            }
          />
        </div>

        <div>
          <Label htmlFor="thumbnailFile" value="Thumbnail Image (optional)" />
          <FileInput
            id="thumbnailFile"
            name="thumbnailFile"
            accept="image/*"
            onChange={(e) =>
              handleSermonChange(e, setForm, audioRef, setDuration)
            }
          />
        </div>

        {duration && (
          <p className="text-sm text-gray-600">
            Duration: <strong>{Math.floor(duration / 60)} mins</strong>
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !duration}
          className="cursor-pointer rounded-sm"
        >
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
