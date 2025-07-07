// components/about/AboutLeadPastorSection.js
import React from 'react'
import Image from 'next/image'

export default function AboutLeadPastorSection() {
  return (
    <section className="w-full bg-white py-24 px-6 pb-44">
      <div className="max-w-7xl mx-auto bg-black rounded-md overflow-hidden flex flex-col md:flex-row">
        {/* Left Image */}
        <div className="md:w-1/2 w-full">
          <Image
            src="/assets/lead-pastor.jpg"
            alt="Pastor Tosin Martins"
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 w-full p-8 md:p-12 text-white flex flex-col justify-center space-y-6">
          {/* Logo */}
          <Image src="/assets/logo.png" alt="Franchise Global Logo" width={100} height={50} />

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">Our Lead Pastor</h2>

          {/* Paragraphs */}
          <p className="text-sm leading-relaxed">
            Pastor Tosin Martins is the visionary founder and Lead Pastor of Franchise Church,
            a fast-growing global ministry in Nigeria. He is renowned for his dynamic preaching, teaching, and music ministry.
            His mission is to help people discover and confidently live out their God-given purpose through
            the transformative power of the Gospel.
          </p>

          <p className="text-sm leading-relaxed">
            Pastor Tosin's ministry began during his time as at This Present House in Lagos, Nigeria,
            where he grew under the ministry of Pastor Tony Rapu. This fellowship evolved into what is now Franchise Church,
            a global church with a strong emphasis on teaching, missions, and empowering believers to fully express their faith in all aspects of life.
          </p>

          {/* Read More Button */}
          <button className="w-fit border border-white text-white px-6 py-2 mt-2 text-sm uppercase tracking-widest hover:bg-[#af601a] hover:text-white transition rounded-sm cursor-pointer">
            Read More
          </button>
        </div>
      </div>
    </section>
  )
}
