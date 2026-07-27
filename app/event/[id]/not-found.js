"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EventNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-tr from-[#ebeefc] via-[#f5f6ff] to-[#faf8ff] text-slate-900 px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Decorative Floating Background Blobs */}
      <div className="w-[400px] h-[400px] rounded-full bg-indigo-200/40 blur-3xl absolute -top-20 -right-20 -z-10 animate-float-slow pointer-events-none"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl absolute -bottom-20 -left-20 -z-10 animate-float-delayed pointer-events-none"></div>
      <div className="bg-grid-dots w-48 h-48 opacity-[0.06] absolute top-12 left-12 pointer-events-none"></div>
      <div className="bg-grid-dots w-48 h-48 opacity-[0.06] absolute bottom-12 right-12 pointer-events-none"></div>

      {/* Glassmorphic Container Card */}
      <div className="relative max-w-lg w-full bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 flex flex-col items-center text-center transition-all duration-300 hover:shadow-indigo-500/5">
        
        {/* Animated Custom Illustration Container */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          
          {/* Pulsing/spinning outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-300 animate-spin" style={{ animationDuration: '30s' }}></div>
          <div className="absolute inset-2 rounded-full border border-indigo-100/50 animate-ping" style={{ animationDuration: '3s' }}></div>
          
          {/* Main Camera / Polaroid SVG Illustration */}
          <svg className="w-28 h-28 text-indigo-600 relative z-10 animate-float-fast" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* The Polaroid / Picture Frame */}
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" className="stroke-indigo-600 fill-indigo-50/20" />
            
            {/* Inner frame cutout */}
            <rect x="5" y="5" width="14" height="11" rx="1" ry="1" className="stroke-indigo-400 fill-white" />
            
            {/* Mountain scene indicating a photo, but with a question mark overlay */}
            <path d="M5 14l3.5-3.5a1 1 0 0 1 1.4 0l4.2 4.2" className="stroke-indigo-300" />
            <path d="M11 13l1.5-1.5a1 1 0 0 1 1.4 0L19 16" className="stroke-indigo-300" />
            
            {/* Floating particles/crosses for broken link feel */}
            <line x1="17" y1="7" x2="17.01" y2="7" strokeWidth="3" className="stroke-indigo-500" />
          </svg>

          {/* Glowing Question Mark Badge */}
          <div className="absolute bottom-6 right-6 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow-md border-2 border-white animate-bounce">
            ?
          </div>

          {/* Sparkles */}
          <div className="absolute top-4 right-8 text-indigo-400 animate-pulse delay-75">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="absolute bottom-8 left-4 text-indigo-300 animate-pulse delay-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wider uppercase">
          404 - Event Not Found
        </span>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Moment Not Found
        </h1>
        
        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-10 max-w-sm">
          The photo sharing event you&apos;re looking for doesn&apos;t exist, has been removed, or has a typo in its link.
        </p>

        {/* Actions Section */}
        <div className="w-full flex flex-col sm:flex-row gap-3 justify-center items-center">
          
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go Back
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            My Events
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-8 border-t border-slate-100 pt-6 w-full text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-indigo-600 font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to DropCast Home
          </Link>
        </div>

      </div>
    </div>
  );
}
