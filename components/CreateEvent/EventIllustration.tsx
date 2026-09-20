import React from "react";

export default function EventIllustration() {
  return (
    <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          Create Moments.
        </h1>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-600 font-extrabold text-4xl md:text-5xl tracking-tight leading-none pb-1">
          Share Happiness.
        </span>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-xs">
        Create your event in just a few steps and invite your guests to share and relive memories together.
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
  );
}
