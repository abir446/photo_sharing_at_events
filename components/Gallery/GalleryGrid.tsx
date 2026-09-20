import React from "react";
import { MediaItem } from "@/utils/typescript/types";
import MediaCard from "./MediaCard";

export interface GalleryGridProps {
  mediaList: MediaItem[];
  showModeration?: boolean;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  title?: string;
  hideHeader?: boolean;
}

export default function GalleryGrid({
  mediaList,
  showModeration = false,
  onApprove,
  onDecline,
  emptyTitle = "No media shared yet",
  emptySubtitle = "Scan the QR code, select a photo or video, and share your perspective of the event!",
  title = "📸 Live Media Stream",
  hideHeader = false,
}: GalleryGridProps) {
  return (
    <div className="space-y-6">
      {/* Live Gallery Title */}
      {!hideHeader && (
        <div className="pt-4 flex items-center justify-between border-t border-indigo-100 dark:border-slate-800/80">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {title}
            <span className="inline-flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {mediaList.length} shared moment{mediaList.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Photo/Video Gallery Grid */}
      {mediaList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/20 border border-indigo-150/80 dark:border-slate-800/60 rounded-3xl py-16 text-center space-y-4 shadow-xs dark:shadow-none">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-slate-800/40 rounded-full flex items-center justify-center mx-auto text-brand-500 dark:text-slate-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.714 0-1.378.366-1.764.996l-.823 1.316Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 dark:text-slate-300 font-semibold text-sm">{emptyTitle}</p>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              {emptySubtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mediaList.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              showModeration={showModeration}
              onApprove={onApprove}
              onDecline={onDecline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
