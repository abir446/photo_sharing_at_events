"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
      setErrorMessage("Could not connect to the server.");
    }
  };

  return (
    <footer className="w-full bg-[#f8fafc] border-t border-slate-100 font-sans">
      {/* Top light section */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Brand Info & Features */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <Link href="/" className="flex items-center space-x-2.5">
            <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span className="text-[#0f172a] text-2xl font-extrabold tracking-tight">
              Drop<span className="text-indigo-600">Cast</span>
            </span>
          </Link>
          
          <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
            Create beautiful event pages, share moments and generate QR codes instantly.
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2.5 text-slate-700 text-sm font-semibold">
              <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Private & Secure</span>
            </div>
            
            <div className="flex items-center space-x-2.5 text-slate-700 text-sm font-semibold">
              <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Instant QR</span>
            </div>
            
            <div className="flex items-center space-x-2.5 text-slate-700 text-sm font-semibold">
              <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Easy Sharing</span>
            </div>
          </div>
        </div>

        {/* Product Links */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div>
            <h3 className="text-slate-900 font-extrabold text-base relative pb-2 inline-block">
              Product
              <span className="absolute bottom-0 left-0 w-6 h-[2.5px] bg-indigo-600 rounded-full"></span>
            </h3>
          </div>
          <ul className="space-y-3">
            <li>
              <Link href="/dashboard/create" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                Create Event
              </Link>
            </li>
            <li>
              <Link href="/#features" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#examples" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                Event Examples
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div>
            <h3 className="text-slate-900 font-extrabold text-base relative pb-2 inline-block">
              Company
              <span className="absolute bottom-0 left-0 w-6 h-[2.5px] bg-indigo-600 rounded-full"></span>
            </h3>
          </div>
          <ul className="space-y-3">
            <li>
              <Link href="/about" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Stay in the Loop (Newsletter) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div>
            <h3 className="text-slate-900 font-extrabold text-base relative pb-2 inline-block">
              Stay in the loop
              <span className="absolute bottom-0 left-0 w-6 h-[2.5px] bg-indigo-600 rounded-full"></span>
            </h3>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
            Subscribe to get updates, tips and inspiration for your next event.
          </p>
          
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center min-w-[100px]"
              >
                {status === "loading" ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
            
            {status === "success" && (
              <p className="text-emerald-600 text-xs mt-2 font-semibold flex items-center gap-1.5 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Thank you for subscribing!
              </p>
            )}

            {status === "error" && (
              <p className="text-rose-600 text-xs mt-2 font-semibold flex items-center gap-1.5 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </p>
            )}

            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-3 font-medium">
              <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span>No spam. Unsubscribe anytime.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom dark banner */}
      <div className="bg-[#070d1e] text-slate-400 text-sm py-6 md:py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright */}
          <div className="text-center md:text-left text-slate-400">
            <span>© 2025 </span>
            <span className="font-bold text-indigo-400">DropCast</span>
            <span>. All rights reserved.</span>
          </div>

          {/* Heart indicator */}
          <div className="flex items-center text-center text-slate-300">
            <svg className="w-5 h-5 text-indigo-400 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Made with love for your special moments.</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Follow us</span>
            <div className="flex items-center space-x-2.5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-slate-700 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:scale-110 transition-all duration-200" aria-label="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-slate-700 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:scale-110 transition-all duration-200" aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-slate-700 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:scale-110 transition-all duration-200" aria-label="Twitter">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-slate-700 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:scale-110 transition-all duration-200" aria-label="LinkedIn">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
