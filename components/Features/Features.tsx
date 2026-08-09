import React from 'react'

export default function Features() {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl mt-auto mb-2 z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-white/5">
        
        {/* Feature 1 */}
        <div className="flex items-start gap-4 lg:px-6 py-4 lg:py-2 hover:scale-[1.01] transition-transform duration-300 group">
          <div className="flex-shrink-0 w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-white font-bold text-sm md:text-base">Create Events</span>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Create events in seconds and invite people to join.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start gap-4 lg:px-6 py-4 lg:py-2 hover:scale-[1.01] transition-transform duration-300 group pt-6 sm:pt-0">
          <div className="flex-shrink-0 w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-white font-bold text-sm md:text-base">Upload Photos</span>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Upload your photos and videos from any device.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start gap-4 lg:px-6 py-4 lg:py-2 hover:scale-[1.01] transition-transform duration-300 group pt-6 lg:pt-0">
          <div className="flex-shrink-0 w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-white font-bold text-sm md:text-base">Shared Gallery</span>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              All event photos in one place, organized and easy to view.
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-start gap-4 lg:px-6 py-4 lg:py-2 hover:scale-[1.01] transition-transform duration-300 group pt-6 lg:pt-0">
          <div className="flex-shrink-0 w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-white font-bold text-sm md:text-base">Download & Save</span>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Download your favorite memories in high quality.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
