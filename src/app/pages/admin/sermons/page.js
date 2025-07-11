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
    categories: "",
  });

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
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 bg-white rounded shadow pb-44">
      <h2 className="text-2xl font-bold mb-6">Upload New Sermon</h2>

      <form
        onSubmit={(e) =>
          handleSermonUpload(e, form, duration, setLoading, resetForm)
        }
        className="flex flex-col gap-6"
      >
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

        <TextInput
          id="speaker"
          name="speaker"
          placeholder="Speaker"
          value={form.speaker}
          onChange={(e) =>
            handleSermonChange(e, setForm, audioRef, setDuration)
          }
        />

        <TextInput
          id="categories"
          name="categories"
          placeholder="e.g. Faith, Leadership, Healing"
          value={form.categories}
          onChange={(e) =>
            handleSermonChange(e, setForm, audioRef, setDuration)
          }
        />

        <Datepicker
          id="date"
          name="date"
          onChange={(date) => {
            const formattedDate = date?.toISOString().split("T")[0];
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

        <FileInput
          id="audioFile"
          name="audioFile"
          accept=".mp3"
          required
          onChange={(e) =>
            handleSermonChange(e, setForm, audioRef, setDuration)
          }
        />

        <FileInput
          id="thumbnailFile"
          name="thumbnailFile"
          accept="image/*"
          onChange={(e) =>
            handleSermonChange(e, setForm, audioRef, setDuration)
          }
        />

        {duration && (
          <p className="text-sm text-gray-600">
            Duration: <strong>{Math.floor(duration / 60)} mins</strong>
          </p>
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
