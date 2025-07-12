"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurferPlayer from "@wavesurfer/react";
import { Pause, Play, X } from "lucide-react";
import { Button } from "flowbite-react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

export default function AudioPlayerBar() {
  const { currentAudio, isPlaying, setIsPlaying, setCurrentAudio } =
    useAudioPlayer();

  const wavesurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [waveformData, setWaveformData] = useState(null);

  useEffect(() => {
    if (!currentAudio) return;

    const fetchWaveform = async () => {
      try {
        const res = await fetch(
          `https://ajxzmfrdbykxjqxybmar.supabase.co/storage/v1/object/public/sermons-waveforms/${currentAudio.waveform}`
        );
        const data = await res.json();
        setWaveformData(data);
      } catch (err) {
        console.error("Failed to load waveform JSON", err);
      }
    };

    fetchWaveform();
  }, [currentAudio]);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleTogglePlay = () => {
    if (!wavesurferRef.current) return;
    setIsPlaying((prev) => !prev);
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentAudio(null);
  };

  if (!currentAudio) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 z-50 px-4 py-3 border-t border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-white">
            {currentAudio.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentAudio.speaker} —{" "}
            {new Date(currentAudio.date).toDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleTogglePlay}
            size="icon"
            variant="outline"
            className="bg-white text-black hover:bg-white/90"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button onClick={handleClose} size="icon" variant="ghost">
            <X size={18} />
          </Button>
        </div>
      </div>
      {waveformData && (
        <WaveSurferPlayer
          ref={wavesurferRef}
          peaks={waveformData}
          height={48}
          waveColor="#888"
          progressColor="#FFD700"
          cursorColor="#fff"
          url={`https://YOUR_SUPABASE_PROJECT.supabase.co/storage/v1/object/public/sermons-audio/${currentAudio.audio_url}`}
          barWidth={2}
          barGap={1}
          barRadius={2}
          onReady={handleReady}
        />
      )}
    </div>
  );
}
