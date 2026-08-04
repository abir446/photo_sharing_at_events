import React from "react";
import Image from "next/image";
import { MediaItem } from "@/utils/typescript/types";

export interface MediaCardProps {
  item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  return (
    <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-md flex flex-col justify-between">
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {item.resourceType === "video" ? (
          <div className="relative w-full h-full">
            <video
              src={item.url}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
              playsInline
            />
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-indigo-300 border border-white/5 pointer-events-none flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              VIDEO
            </span>
          </div>
        ) : (
          <div className="relative w-full h-full group-hover:scale-102 transition-transform duration-500">
            <Image
              src={item.url}
              alt="Event memory"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          </div>
        )}
      </div>

      {/* Footer Info of Media Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Uploaded{" "}
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
        >
          View HD
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
