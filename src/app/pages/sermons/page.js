"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import SermonCard from "@/components/sermons/SermonsCard";
import AudioPlayerBar from "@/components/sermons/AudioPlayerBar";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setAudio } = useAudioPlayer();

  useEffect(() => {
    fetch("/api/sermons")
      .then((res) => res.json())
      .then((data) => setSermons(data))
      .finally(() => setLoading(false));
  }, []);

  const handlePlay = (sermon) => {
    setAudio(sermon);
  };

  return (
    <section className="px-6 py-24 bg-white pb-44">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Over <span className="text-gold">200+ sermons</span>
            </h2>
            <p className="text-gray-600 mt-4 text-sm md:text-base max-w-lg">
              Listen to life-transforming messages from Apostle Emmanuel Iren
              and other anointed ministers
            </p>
          </div>

          <div className="w-full md:w-[500px] h-[300px] bg-black rounded-xl overflow-hidden shadow-lg" />
        </div>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner size="xl" color="pink" />
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-16 max-w-7xl mx-auto">
              {sermons.map((sermon) => (
                <SermonCard
                  key={sermon.public_id || sermon.asset_id || sermon.audioUrl}
                  sermon={sermon}
                  onPlay={handlePlay}
                />
              ))}
            </section>

            <AudioPlayerBar />
          </>
        )}
      </div>
    </section>
  );
}
