"use client"

import React from 'react'
import Hero from "@/components/Hero/Hero"
import Collage from "@/components/Collage/Collage"
import About from "@/components/About/About"
import Features from "@/components/Features/Features"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-tr from-[#ebeefc] via-[#f5f6ff] to-[#faf8ff] text-slate-900 relative overflow-hidden px-6 py-6 md:py-10">
      
      {/* Decorative Grid Patterns */}
      <div className="bg-grid-dots w-32 h-32 opacity-[0.08] absolute top-12 left-8 pointer-events-none"></div>
      <div className="bg-grid-dots w-40 h-40 opacity-[0.08] absolute bottom-64 right-8 pointer-events-none"></div>
      
      {/* Radial Glows */}
      <div className="w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl absolute -top-40 -right-40 -z-10 pointer-events-none"></div>
      <div className="w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-3xl absolute -bottom-40 -left-40 -z-10 pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8 pb-12">
        <Hero />
        <Collage />
      </div>

      {/* About Section */}
      <About />

      {/* Bottom Features Block */}
      <Features />

    </div>
  )
}
