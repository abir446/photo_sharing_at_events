import React, { useRef } from "react";

export interface UploadDropzoneProps {
  isDragOver: boolean;
  isUploading: boolean;
  uploadStatus: string;
  onFileSelect: (files: FileList | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function UploadDropzone({
  isDragOver,
  isUploading,
  uploadStatus,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center space-y-4 group ${
        isDragOver
          ? "border-brand-500 bg-brand-500/10 scale-[1.01] shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          : "border-indigo-200 hover:border-brand-500 dark:border-white/20 dark:hover:border-white/30 hover:bg-indigo-50/30 dark:hover:bg-white/[0.04]"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileSelect(e.target.files)}
        accept="image/*,video/*"
        multiple
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center space-y-3">
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 animate-pulse">{uploadStatus}</p>
        </div>
      ) : (
        <>
          {/* Cloud Icon */}
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-brand-500/10 border border-indigo-200 dark:border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 flex items-center justify-center text-indigo-950 dark:text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-900 dark:text-white">
              Tap or Drag Photos & Videos
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              JPG, PNG, HEIC or MP4 · up to 50MB
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 max-w-sm w-full mx-auto pt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold !text-white text-white shadow-glow hover:bg-brand-600 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 !text-white text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Choose files
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-slate-800 shadow-xs dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:shadow-none px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.714 0-1.378.366-1.764.996l-.823 1.316Z" />
              </svg>
              Take photo
            </button>
          </div>
        </>
      )}

      {/* Glowing border element */}
      <div className="absolute inset-0 rounded-2xl border border-indigo-100/50 dark:border-white/5 pointer-events-none group-hover:border-brand-500/20 dark:group-hover:border-white/10 transition-colors"></div>
    </div>
  );
}
