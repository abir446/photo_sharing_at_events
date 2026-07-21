import React from 'react'

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 md:px-6 w-full py-16 md:py-20 border-t border-indigo-100/20 mt-12 z-10 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-5">
          <span className="inline-flex text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full">About DropCast</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Collect Memories from Every Angle</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            DropCast is designed to bring people together through visual storytelling. Whether it's a wedding, concert, birthday party, or corporate retreat, our platform lets hosts and guests share photos instantly without the hassle of social media tags or complex group chats.
          </p>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-50/50 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
            <span className="font-bold text-slate-800 text-sm md:text-base block mb-2">Our Mission</span>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              To preserve life's precious milestones by making event photography collaborative, instant, and accessible for everyone.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-50/50 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
            <span className="font-bold text-slate-800 text-sm md:text-base block mb-2">Privacy First</span>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              You control who views and contributes. Your memories are stored securely and shared only with the people you invite.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
