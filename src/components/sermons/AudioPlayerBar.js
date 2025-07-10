"use client";

import React, { useRef, useEffect, useState } from "react";
import WaveSurferPlayer from "@wavesurfer/react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { HiPause, HiPlay, HiX } from "react-icons/hi";

export default function AudioPlayerBar() {
  const { currentAudio, clearAudio } = useAudioPlayer();
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Cleanup when audio changes or component unmounts
  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
        console.log("WaveSurfer instance destroyed");
      }
    };
  }, [currentAudio?.audioUrl]);

  if (!currentAudio?.audioUrl) return null;

  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
    console.log(
      `Audio player ${isPlaying ? "paused" : "playing"}:`,
      currentAudio.title
    );
    setIsPlaying((prev) => !prev);
  };

  const handleReady = (ws) => {
    if (wavesurferRef.current && wavesurferRef.current !== ws) {
      wavesurferRef.current.destroy();
      console.log("Destroying old instance before setting new one");
    }
    wavesurferRef.current = ws;
    ws.setVolume(1);
    ws.play();
    console.log("Audio player ready:", currentAudio.title);
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-[1000] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center text-sm mb-2">
          <div className="truncate font-semibold">{currentAudio.title}</div>
          <button
            onClick={() => {
              wavesurferRef.current?.stop();
              clearAudio();
              setIsPlaying(false);
            }}
            className="text-white hover:text-red-500 text-lg"
          >
            <HiX />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="text-white text-2xl focus:outline-none"
          >
            {isPlaying ? <HiPause /> : <HiPlay />}
          </button>

          <div className="w-full">
            <WaveSurferPlayer
              key={currentAudio.audioUrl} // 🔑 Forces remount per new audio
              height={48}
              waveColor="#999"
              preload="none"
              progressColor="#FFD700"
              cursorColor="#fff"
              url={currentAudio.audioUrl}
              onReady={handleReady}
              barWidth={2}
              barGap={1}
              barRadius={2}
              responsive
            />
          </div>
        </div>
      </div>
    </div>
  );
}
