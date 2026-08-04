import React from "react";

export default function PolaroidCollage() {
  return (
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
  );
}
