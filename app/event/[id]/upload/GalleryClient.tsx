"use client";

import React, { useState, useEffect } from "react";
import { GalleryClientProps, MediaItem } from "@/utils/typescript/types";

import ConnectionStatus from "@/components/Gallery/ConnectionStatus";
import UploadDropzone from "@/components/Gallery/UploadDropzone";
import StatusAlerts from "@/components/Gallery/StatusAlerts";
import GalleryGrid from "@/components/Gallery/GalleryGrid";

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
        const res = await fetch(`/api/event/${eventId}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed with status ${res.status}`);
        }
        return res.json();
      });

      await Promise.all(uploadPromises);
      setUploadStatus(`Successfully uploaded ${fileList.length} file${fileList.length > 1 ? "s" : ""}!`);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload one or more files. Please try again.";
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

          {/* Connection status subcomponent */}
          <ConnectionStatus sseStatus={sseStatus} />
        </div>

        {/* Upload dropzone subcomponent */}
        <UploadDropzone
          isDragOver={isDragOver}
          isUploading={isUploading}
          uploadStatus={uploadStatus}
          onFileSelect={handleUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        {/* Status Alerts subcomponent */}
        <StatusAlerts
          uploadStatus={uploadStatus}
          isUploading={isUploading}
          errorMsg={errorMsg}
        />

        {/* Gallery grid subcomponent */}
        <GalleryGrid mediaList={mediaList} />
      </div>

      {/* Footer Branding */}
      <footer className="max-w-5xl mx-auto w-full pt-12 text-center text-xs text-slate-600">
        <p>DropCast Live Console &bull; Secured with Kinde & Cloudinary &bull; MongoDB Cloud</p>
      </footer>
    </div>
  );
}
