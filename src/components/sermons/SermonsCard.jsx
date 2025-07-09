'use client'

import React, { useEffect, useState } from 'react'
import { HiDownload } from 'react-icons/hi'

export default function SermonCard({ sermon, onPlay }) {
  const [durationText, setDurationText] = useState('')

  useEffect(() => {
    if (sermon.duration) {
      const totalSeconds = Math.floor(sermon.duration)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      setDurationText(`${hours}Hr ${minutes} Mins`)
    }
  }, [sermon.duration])

  const handlePlay = () => {
    onPlay(sermon)
  }

  return (
    <div
      onClick={handlePlay}
      className="bg-white rounded-md shadow hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <div className="relative">
        <img
          src={sermon.thumbnail}
          alt={sermon.title}
          className="w-full h-64 object-cover rounded-t-md"
        />
        {durationText && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            {durationText}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold leading-tight">{sermon.title}</h3>
        <p className="text-xs text-gray-600">{sermon.speaker || 'Landmarks'}</p>
        <p className="text-xs text-gray-500">{sermon.date}</p>

        <a
          href={sermon.audioUrl}
          download
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-sm mt-2 text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
        >
          <HiDownload className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  )
}
