import React from 'react'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 md:px-6 w-full py-20 md:py-28 border-t border-indigo-100/20 mt-16 z-10 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Text & Features */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-indigo-50/80 border border-indigo-100/50 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">About DropCast</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Collect Memories from <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Every Angle.
            </span>
          </h2>
          
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            DropCast is designed to bring people together through collaborative storytelling. Whether it&apos;s a wedding, concert, birthday party, or corporate retreat, our platform lets hosts and guests share photos instantly without the hassle of downloads, social media tags, or complex group chats.
          </p>

          {/* Quick Value Props */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">No Apps or Sign-ups for Guests</h4>
                <p className="text-slate-500 text-xs mt-0.5">Guests scan a unique QR code and upload photos directly from their phone browser.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Original Quality & Free Control</h4>
                <p className="text-slate-500 text-xs mt-0.5">Keep high-resolution original files without the aggressive compression of messaging apps.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Secure Privacy Vault</h4>
                <p className="text-slate-500 text-xs mt-0.5">Your event, your rules. Easily control gallery visibility and download settings at any time.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-950/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Learn Our Story</span>
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link 
              href="/dashboard/create" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold text-sm hover:bg-indigo-100/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Create an Event
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Visual Collage Mockup */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-8">
          {/* Decorative Glowing Radial Backgrounds */}
          <div className="absolute w-72 h-72 rounded-full bg-indigo-200/50 blur-3xl -top-10 -left-10 -z-10 animate-float-slow"></div>
          <div className="absolute w-72 h-72 rounded-full bg-purple-200/50 blur-3xl -bottom-10 -right-10 -z-10 animate-float-delayed"></div>

          {/* Collage Wrap */}
          <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
            
            {/* Card 1: Bottom Left */}
            <div className="absolute w-[180px] sm:w-[200px] p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] -rotate-6 -translate-x-20 -translate-y-8 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 group">
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span className="block font-extrabold text-slate-800 text-xs sm:text-sm">Sarah &amp; Leo&apos;s Wedding</span>
              <span className="block text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">348 photos • 12 contributors</span>
            </div>

            {/* Card 2: Bottom Right */}
            <div className="absolute w-[180px] sm:w-[200px] p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rotate-8 translate-x-20 translate-y-8 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 group">
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2Zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2ZM9 10l12-3" />
                </svg>
              </div>
              <span className="block font-extrabold text-slate-800 text-xs sm:text-sm">Neon Beats Festival</span>
              <span className="block text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">1.2k photos • 840 contributors</span>
            </div>

            {/* Card 3: Top Center Front */}
            <div className="absolute w-[200px] sm:w-[220px] p-4 bg-white rounded-2xl border border-indigo-50/50 shadow-[0_15px_40px_rgba(99,102,241,0.12)] rotate-2 -translate-y-4 z-10 hover:rotate-0 hover:scale-105 transition-all duration-300 group">
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
              <span className="block font-extrabold text-slate-800 text-xs sm:text-sm">Summer Escape 2026</span>
              <span className="block text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">86 photos • 6 contributors</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

