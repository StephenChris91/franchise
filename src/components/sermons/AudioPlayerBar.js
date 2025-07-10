"use client";

import React, { useRef, useEffect, useState } from "react";
import WaveSurferPlayer from "@wavesurfer/react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { HiPause, HiPlay, HiX, HiVolumeUp, HiVolumeOff } from "react-icons/hi";

export default function AudioPlayerBar() {
  const { currentAudio, clearAudio } = useAudioPlayer();
  const wavesurferRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Destroy instance when audio changes
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
    const ws = wavesurferRef.current;
    if (!ws || !isReady) return;

    if (isPlaying) {
      ws.pause();
      console.log("Audio player paused:", currentAudio.title);
    } else {
      ws.play();
      console.log("Audio player playing:", currentAudio.title);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReady = (ws) => {
    if (wavesurferRef.current && wavesurferRef.current !== ws) {
      wavesurferRef.current.destroy();
      console.log("Destroying old instance before setting new one");
    }

    wavesurferRef.current = ws;
    ws.setVolume(volume);
    setIsReady(true);
    setIsPlaying(false);
    console.log("Audio player ready:", currentAudio.title);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    wavesurferRef.current?.setVolume(newVolume);
  };

  const toggleMute = () => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    if (isMuted) {
      ws.setVolume(volume || 1);
      setIsMuted(false);
    } else {
      ws.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleClose = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
      console.log("WaveSurfer instance destroyed on close");
    }
    clearAudio();
    setIsReady(false);
    setIsPlaying(false);
    setVolume(1);
    setIsMuted(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-[1000] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          {/* LEFT: Thumbnail + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentAudio.thumbnail}
              alt={currentAudio.title}
              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
            />
            <div className="truncate">
              <div className="font-semibold text-sm truncate">
                {currentAudio.title}
              </div>
              {currentAudio.speaker && (
                <div className="text-xs text-gray-500 truncate">
                  {currentAudio.speaker}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Waveform + Controls */}
          <div className="flex flex-1 items-center gap-3 max-w-full">
            <button
              onClick={handlePlayPause}
              className="text-gray-300 text-2xl focus:outline-none shrink-0"
              disabled={!isReady}
            >
              {isPlaying ? <HiPause /> : <HiPlay />}
            </button>

            <div className="flex-1 min-w-0">
              <WaveSurferPlayer
                key={currentAudio.audioUrl}
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

            <div className="hidden sm:flex items-center gap-2 ml-2">
              <button
                onClick={toggleMute}
                className="text-white text-xl focus:outline-none"
              >
                {isMuted || volume === 0 ? <HiVolumeOff /> : <HiVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 "
              />
            </div>
          </div>

          {/* RIGHT: Close button */}
          <div className="shrink-0">
            <button
              onClick={handleClose}
              className="text-white hover:text-red-500 text-lg"
            >
              <HiX />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
