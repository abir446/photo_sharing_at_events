import React from "react";

export default function SecureBanner() {
  return (
    <div className="flex gap-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 text-slate-200 mt-1">
      <div className="flex-shrink-0 w-8 h-8 bg-brand-500/20 rounded-xl flex items-center justify-center text-brand-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-xs md:text-sm text-white">Private & Secure</span>
        <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
          Only people with your event link or QR code can upload and view photos.
        </p>
      </div>
    </div>
  );
}
