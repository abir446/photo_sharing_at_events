import React from "react";
import Divider from "../ui/Divider";

export default function FormHeader() {
  return (
    <>
      {/* Top Icon Badge */}
      <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path
            d="M12 14.5c-.8-1-2.2-1.3-2.2-.2 0 1.2 2.2 2.7 2.2 2.7s2.2-1.5 2.2-2.7c0-1.1-1.4-.8-2.2.2z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Headers */}
      <h2 className="text-center text-2xl font-black text-slate-800 tracking-tight mb-1">
        Create a New Event
      </h2>
      <p className="text-center text-xs md:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
        Set up your event page and instantly generate guest QR codes.
      </p>

      {/* Horizontal Line with Heart using Divider primitive */}
      <Divider>
        <span className="text-indigo-400">💜</span>
      </Divider>
    </>
  );
}
