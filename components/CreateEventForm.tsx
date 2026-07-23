"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEvent } from "@/app/actions/event"
import { showToast } from "nextjs-toast-notify"

export default function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const res = await createEvent(formData);
      if (res.success) {
        showToast.success("Event created successfully!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
        router.push("/dashboard");
      } else {
        showToast.error(res.error || "Failed to create event", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      showToast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-tr from-[#ebeefc] via-[#f5f6ff] to-[#faf8ff] text-slate-900 px-4 py-8 sm:px-6 sm:py-12 md:py-16 relative overflow-hidden">
      
      {/* Background patterns */}
      <div className="bg-grid-dots w-32 h-32 opacity-[0.05] absolute top-12 left-8 pointer-events-none"></div>
      <div className="bg-grid-dots w-40 h-40 opacity-[0.05] absolute bottom-40 right-8 pointer-events-none"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl absolute -top-40 -right-40 -z-10 pointer-events-none"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-200/25 blur-3xl absolute -bottom-40 -left-40 -z-10 pointer-events-none"></div>

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center z-10">
        
        {/* Left Column: Title & Graphic */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Create Moments.
            </h1>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 font-black text-4xl md:text-5xl tracking-tight leading-none pb-1">
              Share Happiness.
            </span>
          </div>
          
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xs">
            Create your event in just a few steps and invite your guests to share and relive moments together.
          </p>

          {/* SVG Illustration - 3D Box with Photo Prints & Leaves */}
          <div className="pt-4 hidden sm:block">
            <svg className="w-52 h-52 drop-shadow-xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Twig / Leaves 1 */}
              <path d="M140 130 C155 110 165 95 160 70" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M160 70 C165 65 175 60 172 52 C169 44 159 55 160 70 Z" fill="#86efac" />
              <path d="M148 105 C155 105 162 100 163 94 C164 88 152 95 148 105 Z" fill="#86efac" />
              
              {/* Twig / Leaves 2 */}
              <path d="M148 140 C165 130 180 120 185 105" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
              <path d="M185 105 C192 105 195 98 190 92 C185 86 182 98 185 105 Z" fill="#a7f3d0" />
              <path d="M164 127 C172 129 176 122 173 116 C170 110 162 120 164 127 Z" fill="#a7f3d0" />

              {/* Photo print back */}
              <g transform="rotate(8, 100, 85)">
                <rect x="70" y="35" width="55" height="65" rx="4" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
                <rect x="74" y="39" width="47" height="45" fill="#e0f2fe" />
                {/* Minimal mountain illustration */}
                <path d="M74 84 L90 64 L104 78 L112 70 L121 84 Z" fill="#bae6fd" />
                <circle cx="85" cy="50" r="4" fill="#fef08a" />
              </g>

              {/* Photo print front */}
              <g transform="rotate(-12, 85, 95)">
                <rect x="50" y="45" width="55" height="65" rx="4" fill="white" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.08))" />
                <rect x="54" y="49" width="47" height="45" fill="#f3e8ff" />
                {/* Minimal sunset illustration */}
                <path d="M54 94 C65 85 80 85 101 94 Z" fill="#c084fc" />
                <circle cx="82" cy="62" r="5" fill="#fbcfe8" />
              </g>

              {/* Polaroid box - Right face */}
              <path d="M100 135 L145 110 L145 145 L100 170 Z" fill="#a5b4fc" />
              {/* Polaroid box - Front face */}
              <path d="M45 115 L100 135 L100 170 L45 150 Z" fill="#c7d2fe" />
              {/* Polaroid box - Top inside face */}
              <path d="M45 115 L90 90 L145 110 L100 135 Z" fill="#e0e7ff" />
              {/* Overlay shadow for box depth */}
              <path d="M100 135 L145 110 L145 113 L100 138 Z" fill="#818cf8" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Middle Column: Form Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white border border-indigo-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-indigo-900/5 z-10">
            
            {/* Top Icon Badge */}
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M12 14.5c-.8-1-2.2-1.3-2.2-.2 0 1.2 2.2 2.7 2.2 2.7s2.2-1.5 2.2-2.7c0-1.1-1.4-.8-2.2.2z" fill="currentColor" />
              </svg>
            </div>

            {/* Headers */}
            <h2 className="text-center text-2xl font-black text-slate-800 tracking-tight mb-1">
              Create a New Event
            </h2>
            <p className="text-center text-xs md:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Set up your event page and instantly generate guest QR codes.
            </p>

            {/* Horizontal Line with Heart */}
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-indigo-400 text-xs">💜</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* The onSubmit handler handles validation, showing toast notifications, and client-side routing */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              
              {/* Event Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="eventName" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Event Name
                </label>
                <div className="relative flex items-center bg-indigo-50/20 border border-slate-200 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                  <div className="pl-3.5 pr-2.5 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    required
                    placeholder="e.g., Abir & Neha's Wedding Reception"
                    className="w-full bg-transparent py-3 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Event Date Field */}
              <div className="space-y-1.5">
                <label htmlFor="eventDate" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Event Date
                </label>
                <div className="relative flex items-center bg-indigo-50/20 border border-slate-200 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                  <div className="pl-3.5 pr-2.5 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    required
                    className="w-full bg-transparent py-3 pr-4 text-slate-800 focus:outline-none text-sm cursor-text"
                  />
                </div>
              </div>

              {/* Event Type (Optional) Dropdown Select */}
              <div className="space-y-1.5">
                <label htmlFor="eventType" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Event Type (Optional)
                </label>
                <div className="relative flex items-center bg-indigo-50/20 border border-slate-200 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                  <div className="pl-3.5 pr-2.5 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 0 0 2.037 0l4.318-4.318a1.44 1.44 0 0 0 0-2.037l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                  </div>
                  <select
                    id="eventType"
                    name="eventType"
                    className="w-full bg-transparent py-3 pr-10 text-slate-700 focus:outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="text-slate-400">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="concert">Concert</option>
                    <option value="corporate">Corporate</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-3.5 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Private & Secure Info Card */}
              <div className="flex gap-3 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl p-4 text-indigo-950 mt-1">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100/60 rounded-xl flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs md:text-sm text-indigo-900">Private & Secure</span>
                  <p className="text-[11px] md:text-xs text-indigo-700/80 leading-relaxed">
                    Only people with your event link or QR code can upload and view photos.
                  </p>
                </div>
              </div>

              {/* Submit Button with loading animation and disabled state */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold tracking-wide shadow-md shadow-indigo-900/10 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all duration-200 text-sm mt-2 cursor-pointer flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Event...</span>
                  </>
                ) : (
                  "Create Event & Generate QR"
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Graphic Collage */}
        <div className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center relative min-h-[400px] select-none">
          <div className="relative w-full h-[320px]">
            
            {/* Top Polaroid: Wedding Canopy */}
            <div className="absolute top-0 right-0 w-[180px] aspect-[4/3] bg-white p-2.5 rounded-2xl shadow-lg border border-slate-100/50 rotate-[9deg] hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-500 cursor-pointer overflow-hidden">
              <img 
                className="w-full h-full object-cover rounded-xl pointer-events-none"
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" 
                alt="Wedding decor stage" 
              />
            </div>

            {/* Middle Polaroid: Mehndi Hands */}
            <div className="absolute top-20 -left-6 w-[170px] aspect-[4/5] bg-white p-2.5 rounded-2xl shadow-lg border border-slate-100/50 rotate-[-8deg] hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-500 cursor-pointer overflow-hidden">
              <img 
                className="w-full h-full object-cover rounded-xl pointer-events-none"
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80" 
                alt="Mehndi hands wedding event" 
              />
            </div>

            {/* Bottom Polaroid: Dinner Table lights */}
            <div className="absolute top-44 right-2 w-[180px] aspect-[4/3] bg-white p-2.5 rounded-2xl shadow-lg border border-slate-100/50 rotate-[5deg] hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-500 cursor-pointer overflow-hidden">
              <img 
                className="w-full h-full object-cover rounded-xl pointer-events-none"
                src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Dinner table settings warm light" 
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
