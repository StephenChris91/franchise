'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Modal, Spinner } from 'flowbite-react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'

export default function MovementSection() {
  const [openModal, setOpenModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!openModal) return

    setLoading(true)
    fetch('/api/mux/latest')
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setVideoUrl(data.url)
        } else {
          console.error('Mux API error:', data)
        }
      })
      .finally(() => setLoading(false))
  }, [openModal])

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play()
        })
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoUrl
        videoRef.current.play()
      }
    }
  }, [videoUrl])

  return (
    <>
      <section className="bg-black text-white text-center py-24 px-4">
        <div className="mb-4">
          <span className="inline-block bg-white/10 text-xs font-semibold px-4 py-1 rounded-full tracking-widest">
            🔵 Global Reach
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl mb-4 leading-snug">
          Igniting a Global Awakening <br />
          From City Streets to Nations’ Hearts
        </h2>

        <button
          onClick={() => setOpenModal(true)}
          className="mt-4 px-6 py-2 rounded-full border border-white text-white font-bold uppercase text-sm hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          Declare With Us
        </button>
      </section>

      <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl" popup>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-black p-4 rounded-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner color="pink" size="xl" />
            </div>
          ) : (
            <video
              ref={videoRef}
              controls={false}
              playsInline
                onEnded={() => setOpenModal(false)}
                
              className="w-full aspect-[9/16] rounded-sm"
            />
          )}
        </motion.div>
      </Modal>
    </>
  )
}
