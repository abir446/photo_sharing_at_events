"use client"

import React from 'react'
import Link from 'next/link'
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"

export default function Hero() {
  const { isAuthenticated } = useKindeBrowserClient();

  return (
    <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 z-10">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center self-center lg:self-start bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 text-brand-400 font-semibold text-sm shadow-sm hover:scale-[1.03] transition-transform duration-300 cursor-default select-none">
        Welcome to DropCast 🎉
      </div>

      {/* Heading */}
      <h1 className="flex flex-col space-y-2">
        <span className="text-white font-black tracking-tight text-5xl md:text-6xl leading-[1.1]">
          Share Moments.
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600 font-black tracking-tight text-5xl md:text-6xl leading-[1.1] pb-1">
          Create Memories.
        </span>
      </h1>

      {/* Description */}
      <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
        DropCast makes it easy to collect and share photos from any event. Upload, view and relive every special moment in one place.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
        {isAuthenticated ? (
          <>
            <Link 
              href="/dashboard/create" 
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 transition-colors w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2 text-indigo-100" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Event
            </Link>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 transition-colors w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" />
              </svg>
              My Events
            </Link>
          </>
        ) : (
          <>
            <LoginLink 
              postLoginRedirectURL="/dashboard/create"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 transition-colors w-full sm:w-auto cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2 text-indigo-100" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Event
            </LoginLink>
            <LoginLink 
              postLoginRedirectURL="/dashboard"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 transition-colors w-full sm:w-auto cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" />
              </svg>
              My Events
            </LoginLink>
          </>
        )}
      </div>

      {/* Social Proof */}
      <div className="flex flex-col sm:flex-row items-center space-y-2.5 sm:space-y-0 sm:space-x-3.5 pt-4">
        <div className="flex -space-x-3 overflow-hidden">
          <img 
            className="inline-block h-10 w-10 rounded-full ring-2 ring-ink-900 object-cover transform hover:-translate-y-1 hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" 
            alt="User avatar 1" 
          />
          <img 
            className="inline-block h-10 w-10 rounded-full ring-2 ring-ink-900 object-cover transform hover:-translate-y-1 hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
            alt="User avatar 2" 
          />
          <img 
            className="inline-block h-10 w-10 rounded-full ring-2 ring-ink-900 object-cover transform hover:-translate-y-1 hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80" 
            alt="User avatar 3" 
          />
          <img 
            className="inline-block h-10 w-10 rounded-full ring-2 ring-ink-900 object-cover transform hover:-translate-y-1 hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" 
            alt="User avatar 4" 
          />
          <img 
            className="inline-block h-10 w-10 rounded-full ring-2 ring-ink-900 object-cover transform hover:-translate-y-1 hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80" 
            alt="User avatar 5" 
          />
        </div>
        <p className="text-sm font-semibold text-slate-400 flex items-center">
          Trusted by 1,000+ users <span className="ml-1.5 text-brand-400">💜</span>
        </p>
      </div>

    </div>
  )
}
