// components/about/AboutBelieveSection.js
import React from 'react'

export default function AboutBelieveSection() {
  return (
    <section
      className="relative bg-cover bg-center py-24 px-4 mb-24"
      
    >
      <div className="max-w-6xl mx-auto flex justify-end px-4 md:px-8 p-24 rounded-md"
      style={{
        backgroundImage: "url('/assets/pastor-tosin.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      >
        <div className="bg-white bg-opacity-95 rounded-md p-8 md:p-10 max-w-xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-4">
            <span className="text-black">We </span>
            <span className="text-gold">Believe</span>
          </h2>

          <ul className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed list-disc pl-5">
            <li>
              The gifts of the Spirit are at work in the life of the believer, so our services are an experience
              of the uninhibited flow of the Spirit through prayer, prophecies, and spiritual songs.
            </li>
            <li>
              That the Word of God is the ultimate standard for doctrine.
            </li>
            <li>
              That the Father&apos;s biggest display of affection towards us is in the redemptive work of Christ.
            </li>
            <li>
              That we are blessed because righteousness is credited to us through the grace of our Lord Jesus Christ.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
