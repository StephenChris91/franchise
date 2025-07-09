"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { HiPause, HiPlay, HiX } from "react-icons/hi";

export default function AudioPlayerBar() {
  const { currentAudio, clearAudio } = useAudioPlayer();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (currentAudio && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!currentAudio) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-[1000] shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-2xl">
            {isPlaying ? <HiPause /> : <HiPlay />}
          </button>
          <span className="text-sm md:text-base line-clamp-1">
            {currentAudio.title}
          </span>
        </div>
        <button onClick={clearAudio} className="text-xl">
          <HiX />
        </button>
      </div>

      <audio ref={audioRef} src={currentAudio.audioUrl} autoPlay />
    </div>
  );
}
