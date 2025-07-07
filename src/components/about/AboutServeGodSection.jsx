// components/about/AboutServeGodSection.js
import React from 'react'

export default function AboutServeGodSection() {
  return (
    <section className="bg-white py-24 px-4 w-full pb-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start justify-between">
        {/* Left Heading */}
        <div className="w-full md:w-1/4">
          <h2 className="lg:text-5xl text-3xl md:text-4xl font-extrabold uppercase text-black leading-tight">
            We Serve God
            <br />
            <span className="text-[#af601a]">By His Spirit</span>
          </h2>
        </div>

        {/* Right Text Columns */}
        <div className="w-full md:w-3/4 grid md:grid-cols-3 gap-6 text-sm text-gray-800 leading-relaxed">
          <p className='text-justify'>
            Franchise Church is a mission-minded teaching ministry founded in 2018 by Pastor Tosin Martins. Our vision is to see all people celebrate endless life in Christ Jesus
            and fully embrace the power of His death, burial, and resurrection.
          </p>
          <p className='text-justify'>
            At Franchise, we are committed to knowing Christ deeply and making Him known across the
            world. We nurture spiritual growth through in-depth teaching services, powerful prayer
            sessions, and outreach programs, empowering believers to live out their faith boldly. Our
            services are marked by the gifts of the Spirit, where prayer, prophecies, and spiritual
            songs flow freely in an atmosphere of worship.
          </p>
          <p className='text-justify'>
            We hold firmly to the Word of God as the ultimate standard for doctrine, and we believe
            that the greatest demonstration of God&apos;s love is found in the redemptive work of
            Christ. Through His grace, we are blessed and righteous in His sight.
          </p>
        </div>
      </div>
    </section>
  )
}
