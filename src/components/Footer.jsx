'use client'

import { Footer } from 'flowbite-react'
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin } from 'react-icons/bs'
import Link from 'next/link'
import GiveBanner from './GiveBanner'

export default function SiteFooter() {
  return (
    <>
    <GiveBanner />
    <Footer container className="bg-black text-white px-4 py-10 rounded-none border-t border-gray-700" id='footer'>
      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-gold mb-3">Franchise Church</h2>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Franchise Church. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-white font-semibold">Explore</p>
          <Link href="/" className="text-gray-300 hover:text-gold">Home</Link>
          <Link href="/about" className="text-gray-300 hover:text-gold">About Us</Link>
          <Link href="/gallery" className="text-gray-300 hover:text-gold">Gallery</Link>
          <Link href="/connect" className="text-gray-300 hover:text-gold">Connect</Link>
        </div>

        {/* Contact & Socials */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-white font-semibold">Contact</p>
          <p className="text-gray-300">info@franchisechurch.org</p>
          <p className="text-gray-300">+44 123 456 7890</p>
          <div className="flex gap-4 mt-2 text-lg text-gold">
            <a href="https://facebook.com" target="_blank"><BsFacebook /></a>
            <a href="https://twitter.com" target="_blank"><BsTwitter /></a>
            <a href="https://instagram.com" target="_blank"><BsInstagram /></a>
            <a href="https://linkedin.com" target="_blank"><BsLinkedin /></a>
          </div>
        </div>
      </div>
    </Footer>
    </>
  )
}
