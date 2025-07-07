// components/about/AboutApproachSection.js
import React from 'react'
import { FaBook, FaHeart, FaBullhorn } from 'react-icons/fa'

export default function AboutApproachSection() {
  return (
    <section className="bg-white py-24 px-6 pb-44">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-black uppercase">Our Approach</h2>
        <p className="text-sm md:text-base text-gray-600">Faith. Hope. Love. We believe in an intentional walk with God.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {/* Know it */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gold text-[#af601a] p-6 rounded-full text-3xl shadow-lg">
            <FaBook />
          </div>
          <h3 className="text-xl font-bold text-black uppercase">Know it</h3>
          <p className="text-sm text-gray-700 max-w-xs">
            We believe that to know Christ, you must be taught through sound doctrine, anchored in God’s word.
          </p>
        </div>

        {/* Live it */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gold text-[#af601a] p-6 rounded-full text-3xl shadow-lg">
            <FaHeart />
          </div>
          <h3 className="text-xl font-bold text-black uppercase">Live it</h3>
          <p className="text-sm text-gray-700 max-w-xs">
            We believe spiritual maturity is evident in your lifestyle. Christ must be seen in you.
          </p>
        </div>

        {/* Tell it */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gold text-[#af601a] p-6 rounded-full text-3xl shadow-lg">
            <FaBullhorn />
          </div>
          <h3 className="text-xl font-bold text-black uppercase">Tell it</h3>
          <p className="text-sm text-gray-700 max-w-xs">
            We believe that every believer must preach the gospel. Everyone is a minister.
          </p>
        </div>
      </div>
    </section>
  )
}
