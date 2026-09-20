import React from "react";
import Image from "next/image";
import { MediaItem } from "@/utils/typescript/types";

export interface MediaCardProps {
  item: MediaItem;
  showModeration?: boolean;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export default function MediaCard({
  item,
  showModeration = false,
  onApprove,
  onDecline,
}: MediaCardProps) {
  const isPending = item.state === "pending";

  return (
    <div className="group relative bg-white dark:bg-slate-900/60 border border-indigo-150/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:border-brand-300 dark:hover:border-slate-700/80 transition-all duration-300 shadow-sm dark:shadow-md flex flex-col justify-between">
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
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
              <svg className="w-3 3-3" fill="currentColor" viewBox="0 0 24 24">
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

        {/* Status Pill for Host View */}
        {showModeration && (
          <span
            className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
              isPending
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40"
            }`}
          >
            {isPending ? "Pending Review" : "Approved"}
          </span>
        )}
      </div>

      {/* Footer Info of Media Card */}
      <div className="p-3 border-t border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
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
            className="text-brand-600 dark:text-indigo-400 hover:text-brand-700 dark:hover:text-indigo-300 font-medium flex items-center gap-0.5"
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

        {/* Host Moderation Controls */}
        {showModeration && (
          <div className="pt-2 border-t border-indigo-100 dark:border-slate-800/80 flex items-center gap-2">
            {isPending ? (
              <>
                <button
                  type="button"
                  onClick={() => onApprove?.(item._id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onDecline?.(item._id)}
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Decline
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onDecline?.(item._id)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-300 dark:bg-slate-800/80 dark:hover:bg-rose-500/20 dark:text-slate-300 dark:hover:text-rose-300 dark:border-slate-700 dark:hover:border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                Hide from Guests
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
