"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import SermonCard from "@/components/sermons/SermonsCard";
import SermonFilters from "@/components/sermons/SermonFilters";
import AudioPlayerBar from "@/components/sermons/AudioPlayerBar";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [filteredSermons, setFilteredSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setAudio } = useAudioPlayer();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/sermons`);
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType?.includes("application/json")) {
          const text = await res.text();
          throw new Error(`❌ Invalid response: ${text.slice(0, 200)}`);
        }

        const data = await res.json();
        console.log("✅ Sermons data:", data);

        // const sermonList = Array.isArray(data) ? data : data.sermons;

        setSermons(data.sermons);
        setFilteredSermons(data.sermons);
      } catch (err) {
        console.error("❌ Failed to fetch sermons:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, [backendUrl]);

  const handlePlay = (sermon) => {
    setAudio(sermon);
  };

  return (
    <section className="px-6 py-24 bg-[#ededed]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 leading-tight">
              Life Giving <span className="text-[#af601a]">Messages</span>
            </h2>
            <p className="text-gray-600 mt-4 text-sm md:text-base max-w-lg">
              Listen to life-transforming messages from Pastor Tosin Martins and
              other anointed ministers
            </p>
          </div>
          <div className="w-full md:w-[500px] h-[300px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/zZedb_mXStc?t=695&autoplay=1&mute=1&controls=0&loop=1&playlist=zZedb_mXStc&modestbranding=1&rel=0"
              title="Sermon Preview"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {!loading && sermons.length > 0 && (
          <SermonFilters allSermons={sermons} onFilter={setFilteredSermons} />
        )}

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner size="xl" color="pink" />
          </div>
        ) : filteredSermons.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-16 max-w-7xl mx-auto">
            {filteredSermons.map((sermon) => (
              <SermonCard
                key={sermon.public_id || sermon.asset_id || sermon.audioUrl}
                sermon={sermon}
                onPlay={handlePlay}
              />
            ))}
          </section>
        ) : (
          <p className="text-center text-gray-500 mt-20">No sermons found.</p>
        )}

        <AudioPlayerBar />
      </div>
    </section>
  );
}
