import React from 'react'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 md:px-6 w-full py-20 md:py-28 border-t border-slate-200 dark:border-white/5 mt-16 z-10 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Text & Features */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">About DropCast</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Collect Memories from <br />
            <span className="bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent">
              Every Angle.
            </span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            DropCast is designed to bring people together through collaborative storytelling. Whether it&apos;s a wedding, concert, birthday party, or corporate retreat, our platform lets hosts and guests share photos instantly without the hassle of downloads, social media tags, or complex group chats.
          </p>

          {/* Quick Value Props */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Apps or Sign-ups for Guests</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Guests scan a unique QR code and upload photos directly from their phone browser.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Original Quality & Free Control</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Keep high-resolution original files without the aggressive compression of messaging apps.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Secure Privacy Vault</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Your event, your rules. Easily control gallery visibility and download settings at any time.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-glow hover:bg-brand-600 transition-colors"
            >
              <span>Learn Our Story</span>
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link 
              href="/dashboard/create" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white font-semibold text-sm transition-colors shadow-sm dark:shadow-none"
            >
              Create an Event
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Visual Collage Mockup */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-8">
          {/* Decorative Glowing Radial Backgrounds */}
          <div className="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl -top-10 -left-10 -z-10 animate-float-slow"></div>
          <div className="absolute w-72 h-72 rounded-full bg-brand-500/5 blur-3xl -bottom-10 -right-10 -z-10 animate-float-delayed"></div>

          {/* Collage Wrap */}
          <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
            
            {/* Card 1: Bottom Left */}
            <div className="absolute w-[180px] sm:w-[200px] p-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl -rotate-6 -translate-x-20 -translate-y-8 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 group">
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-rose-500/80 to-pink-500/80 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span className="block font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Sarah &amp; Leo&apos;s Wedding</span>
              <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">348 photos • 12 contributors</span>
            </div>

            {/* Card 2: Bottom Right */}
            <div className="absolute w-[180px] sm:w-[200px] p-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl rotate-8 translate-x-20 translate-y-8 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 group">
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-500/80 to-indigo-600/80 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2Zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2ZM9 10l12-3" />
                </svg>
              </div>
              <span className="block font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Neon Beats Festival</span>
              <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">1.2k photos • 840 contributors</span>
            </div>

            {/* Card 3: Top Center Front */}
            <div className="absolute w-[200px] sm:w-[220px] p-4 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/15 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl rotate-2 -translate-y-4 z-10 hover:rotate-0 hover:scale-105 transition-all duration-300 group">
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 mb-3 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
              <span className="block font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Summer Escape 2026</span>
              <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">86 photos • 6 contributors</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
