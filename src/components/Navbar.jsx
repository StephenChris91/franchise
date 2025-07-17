'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

export default function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const mainLinks = ['Home', 'About Us', 'Sermons', 'Give']
  const ministries = ['Worship', 'Teens', 'Kids']
  const resources = [
    'Membership classes',
    'Celebrations',
    'Counselling',
    'Pre Marital Counselling',
    'Post Marital Counselling',
    'Welfare Request',
    'New Campus Volunteers',
  ]
  const connect = ['Become a member', 'Visit Franchise']
  const media = ['Watch online']

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-black text-white py-4 px-6 flex justify-between items-center relative z-50">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wider">
          <span className="text-white">FRANCHISE CHURCH</span>{' '}
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-2xl text-white cursor-pointer"
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      </nav>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black text-white z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-start p-6">
              {/* Logo */}
              <span className="text-3xl font-bold text-white">∞</span>

              {/* Close Icon */}
              <button onClick={() => setIsOpen(false)} className="text-3xl">
                <FiX />
              </button>
            </div>

            <div className="flex flex-col md:flex-row p-6 gap-12 max-w-7xl mx-auto">
              {/* Left: Stacked Nav Links */}
              <div className="flex-1">
                {mainLinks.map((link) => {
  const path = link.toLowerCase().replace(/\s+/g, '-')
  const href = path === 'home' ? '/' : `/pages/${path}`
  return (
    <Link
      key={link}
      href={href}
      className={`block text-4xl font-extrabold uppercase mb-4 cursor-pointer${
        link === 'Give' ? 'text-gold' : 'text-white'
      }`}
      onClick={() => setIsOpen(false)}
    >
      {link}
    </Link>
  )
})}
              </div>

              {/* Right: Columns */}
              <div className="flex flex-1 flex-col md:flex-row gap-12">
                <div>
                  <h4 className="text-sm uppercase text-gray-400 mb-2">Ministries</h4>
                  {ministries.map((item) => (
                    <p key={item} className="text-sm mb-1">
                      {item}
                    </p>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm uppercase text-gray-400 mb-2">Resources</h4>
                  {resources.map((item) => (
                    <p key={item} className="text-sm mb-1">
                      {item}
                    </p>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm uppercase text-gray-400 mb-2">Connect</h4>
                  {connect.map((item) => (
                    <p key={item} className="text-sm mb-1">
                      {item}
                    </p>
                  ))}
                  <h4 className="text-sm uppercase text-gray-400 mt-4 mb-2">Media</h4>
                  {media.map((item) => (
                    <p key={item} className="text-sm mb-1">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Social Icons (optional) */}
            <div className="mt-10 text-center text-sm text-gray-500 pb-6">
              &copy; {new Date().getFullYear()} Franchise Church. All rights reserved.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
