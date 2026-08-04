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
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center space-y-4 group ${
        isDragOver
          ? "border-indigo-400 bg-indigo-500/10 scale-[1.01] shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          : "border-slate-700/80 hover:border-slate-600 hover:bg-slate-900/60"
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
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-200 animate-pulse">{uploadStatus}</p>
        </div>
      ) : (
        <>
          {/* Cloud Icon */}
          <div className="w-12 h-12 rounded-full bg-slate-800/80 group-hover:bg-indigo-950/80 group-hover:text-indigo-400 transition-colors flex items-center justify-center text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-white">
              Drag & drop photos or videos here (bulk supported)
            </p>
            <p className="text-xs text-slate-400">
              Or <span className="text-indigo-400 font-semibold underline group-hover:text-indigo-300">tap to browse</span> from your device
            </p>
          </div>
          <p className="text-[10px] text-slate-500">Supports Images & Videos up to 50MB</p>
        </>
      )}

      {/* Glowing border element */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors"></div>
    </div>
  );
}
