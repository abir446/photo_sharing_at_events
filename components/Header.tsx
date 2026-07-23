"use client"
import React, { useState, useEffect } from 'react'
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from 'next/link';
import { showToast } from "nextjs-toast-notify";

const Header = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const prevAuth = localStorage.getItem("last_auth_state");
    if (prevAuth === "false" && isAuthenticated) {
      showToast.success("Logged in successfully!", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
      });
    } else if (prevAuth === "true" && !isAuthenticated) {
      showToast.success("Logged out successfully!", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
      });
    }

    localStorage.setItem("last_auth_state", isAuthenticated ? "true" : "false");
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <header className="bg-[#050814] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-bold text-xl">
            <svg className="w-8 h-8 text-indigo-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent font-extrabold tracking-tight">DropCast</span>
          </div>
          <div className="animate-pulse flex space-x-6">
            <div className="h-5 w-20 bg-slate-800 rounded"></div>
            <div className="h-5 w-20 bg-slate-800 rounded"></div>
            <div className="h-8 w-20 bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#050814]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2.5">
          <svg className="w-8 h-8 text-indigo-500 group-hover:text-indigo-400 group-hover:scale-105 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-100 bg-clip-text text-transparent text-xl font-extrabold tracking-tight group-hover:from-white group-hover:to-indigo-300 transition-all duration-300">
            DropCast
          </span>
        </Link>

        {/* Desktop Menu (hidden on mobile/tablet) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/#about" className="group flex items-center text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200">
            <svg className="w-5 h-5 mr-1.5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            About
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/create" className="group flex items-center text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200">
                <svg className="w-5 h-5 mr-1.5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
                </svg>
                New Event
              </Link>
              <Link href="/dashboard" className="group flex items-center text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200">
                <svg className="w-5 h-5 mr-1.5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" />
                </svg>
                My Events
              </Link>
              <LogoutLink 
                className="px-5 py-1.5 rounded-full border border-white/20 text-slate-200 font-medium hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-200 text-sm" 
                postLogoutRedirectURL="http://localhost:3000/"
              >
                Sign out
              </LogoutLink>
            </>
          ) : (
            <>
              <LoginLink className="text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200">
                Sign in
              </LoginLink>
              <RegisterLink className="px-5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-900/20 hover:shadow-indigo-500/30 transition-all duration-200 text-sm">
                Sign up
              </RegisterLink>
            </>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

      </div>

      {/* Mobile Drawer (visible on click on mobile/tablet) */}
      {isOpen && (
        <div className="md:hidden bg-[#050814]/98 border-t border-white/5 px-6 py-4 flex flex-col space-y-4 animate-fadeIn">
          <Link 
            href="/#about" 
            onClick={() => setIsOpen(false)}
            className="group flex items-center text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200 py-1"
          >
            <svg className="w-5 h-5 mr-2.5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            About
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard/create" 
                onClick={() => setIsOpen(false)}
                className="group flex items-center text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200 py-1"
              >
                <svg className="w-5 h-5 mr-2.5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
                </svg>
                New Event
              </Link>
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="group flex items-center text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200 py-1"
              >
                <svg className="w-5 h-5 mr-2.5 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" />
                </svg>
                My Events
              </Link>
              <div className="pt-2 border-t border-white/5">
                <LogoutLink 
                  className="flex justify-center w-full px-5 py-2 rounded-full border border-white/20 text-slate-200 font-medium hover:bg-white/10 hover:border-white/40 hover:text-white text-center transition-all duration-200 text-sm" 
                  postLogoutRedirectURL="http://localhost:3000/"
                >
                  Sign out
                </LogoutLink>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2.5 pt-2 border-t border-white/5">
              <LoginLink className="flex justify-center w-full text-slate-300 hover:text-white font-medium text-sm py-2 text-center transition-colors duration-200">
                Sign in
              </LoginLink>
              <RegisterLink className="flex justify-center w-full px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center shadow-md shadow-indigo-900/20 hover:shadow-indigo-500/30 transition-all duration-200 text-sm">
                Sign up
              </RegisterLink>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
