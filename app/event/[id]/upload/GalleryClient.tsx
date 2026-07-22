"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { uploadMedia } from "@/app/actions/media";

interface MediaItem {
  _id: string;
  eventId: string;
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  createdAt: string;
}

interface GalleryClientProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  initialMedia: MediaItem[];
}

export default function GalleryClient({
  eventId,
  eventName,
  eventDate,
  initialMedia,
}: GalleryClientProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sseStatus, setSseStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Establish SSE Connection for real-time updates
  useEffect(() => {
    let sse: EventSource;
    let retryTimeout: NodeJS.Timeout;

    function connect() {
      setSseStatus("connecting");
      sse = new EventSource(`/api/event/${eventId}/sse`);

      sse.onopen = () => {
        setSseStatus("connected");
      };

      sse.onmessage = (event) => {
        if (event.data === ":keep-alive") return;
        try {
          const newMedia = JSON.parse(event.data);
          setMediaList((prev) => {
            // Avoid duplicate items
            if (prev.some((item) => item._id === newMedia._id)) {
              return prev;
            }
            return [newMedia, ...prev];
          });
        } catch (e) {
          console.error("Error parsing realtime SSE payload:", e);
        }
      };

      sse.onerror = (e) => {
        console.error("SSE connection lost. Reconnecting...", e);
        setSseStatus("disconnected");
        sse.close();
        retryTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      if (sse) sse.close();
      clearTimeout(retryTimeout);
    };
  }, [eventId]);

  // 2. File Upload Handler
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB limit

    // Validate that no single file is too large
    const oversizedFile = fileList.find((file) => file.size > maxSizeBytes);
    if (oversizedFile) {
      setErrorMsg(`File "${oversizedFile.name}" is too large. Maximum file size is 50MB.`);
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setUploadStatus(`Uploading ${fileList.length} memory${fileList.length > 1 ? "ies" : "y"}...`);

    try {
      // Execute all uploads in parallel
      const uploadPromises = fileList.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return uploadMedia(eventId, formData);
      });

      await Promise.all(uploadPromises);
      setUploadStatus(`Successfully uploaded ${fileList.length} file${fileList.length > 1 ? "s" : ""}!`);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to upload one or more files. Please try again.";
      setErrorMsg(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0b0f19] via-[#111827] to-[#1e1b4b] text-slate-100 px-4 py-8 md:py-12 relative overflow-hidden flex flex-col justify-between">
      {/* Background glow animations */}
      <div className="w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl absolute -top-40 -right-40 -z-10"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl absolute -bottom-40 -left-40 -z-10"></div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full space-y-8 flex-grow">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Live Guest Upload & Gallery
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{eventName}</h1>
            <p className="text-sm text-slate-400">{eventDate}</p>
          </div>

          {/* Connection Indicator */}
          <div className="flex items-center">
            {sseStatus === "connected" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Feed Connected
              </span>
            ) : sseStatus === "connecting" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Connecting...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Disconnected (Retrying)
              </span>
            )}
          </div>
        </div>

        {/* Dropzone Card */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center space-y-4 group ${
            isDragOver
              ? "border-indigo-400 bg-indigo-500/10 scale-[1.01] shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              : "border-slate-700/80 hover:border-slate-600 hover:bg-slate-900/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleUpload(e.target.files)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
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
              <p className="text-[10px] text-slate-500">
                Supports Images & Videos up to 50MB
              </p>
            </>
          )}

          {/* Glowing border element */}
          <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors"></div>
        </div>

        {/* Status Alerts */}
        {uploadStatus && !isUploading && (
          <div className="p-4 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center animate-fade-in">
            {uploadStatus}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl text-sm font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Live Gallery Title */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📸 Live Media Stream
            <span className="inline-flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </h2>
          <span className="text-xs text-slate-400">
            {mediaList.length} shared moment{mediaList.length !== 1 && "s"}
          </span>
        </div>

        {/* Photo/Video Gallery Grid */}
        {mediaList.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto text-slate-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-slate-300 font-semibold text-base">No media shared yet</p>
              <p className="text-slate-500 text-xs max-w-xs mx-auto">
                Scan the QR code, select a photo or video, and share your perspective of the event!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-md flex flex-col justify-between"
              >
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="max-w-5xl mx-auto w-full pt-12 text-center text-xs text-slate-600">
        <p>DropCast Live Console &bull; Secured with Kinde & Cloudinary &bull; MongoDB Cloud</p>
      </footer>
    </div>
  );
}
