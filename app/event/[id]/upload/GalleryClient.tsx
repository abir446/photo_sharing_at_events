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
  isHost = false,
  isAdmin = false,
}: GalleryClientProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sseStatus, setSseStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [isDragOver, setIsDragOver] = useState(false);

  const isModerator = isHost || isAdmin;
  const approvedMedia = mediaList.filter((m) => m.state === "approved" || !m.state);
  const pendingMedia = mediaList.filter((m) => m.state === "pending");

  const [activeTab, setActiveTab] = useState<"pending" | "approved">("approved");

  // Track eventId to detect changes and reset state during render
  const [prevEventId, setPrevEventId] = useState(eventId);
  if (eventId !== prevEventId) {
    setPrevEventId(eventId);
    setSseStatus("connecting");
    setMediaList(initialMedia);
    setIsUploading(false);
    setUploadStatus("");
    setErrorMsg("");
  }

  // 1. Poll for real-time updates
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    let isActive = true;

    async function poll() {
      if (!isActive) return;

      try {
        const res = await fetch(`/api/event/${eventId}/media`);
        if (!res.ok) throw new Error("Failed to fetch media");
        const data = await res.json();

        if (isActive) {
          setMediaList(data);
          setSseStatus("connected");
        }
      } catch (err) {
        console.error("Error polling media:", err);
        if (isActive) {
          setSseStatus("disconnected");
        }
      } finally {
        if (isActive) {
          timerId = setTimeout(poll, 5000);
        }
      }
    }

    poll();

    return () => {
      isActive = false;
      clearTimeout(timerId);
    };
  }, [eventId]);

  // Moderation handlers for hosts/admins
  const handleApprove = async (photoId: string) => {
    // Optimistic update
    setMediaList((prev) =>
      prev.map((item) =>
        item._id === photoId ? { ...item, state: "approved" } : item
      )
    );

    try {
      const res = await fetch(`/api/media/${photoId}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "approved" }),
      });
      if (!res.ok) {
        console.error("Failed to approve photo");
      }
    } catch (err) {
      console.error("Error approving photo:", err);
    }
  };

  const handleDecline = async (photoId: string) => {
    // Optimistic update
    setMediaList((prev) =>
      prev.map((item) =>
        item._id === photoId ? { ...item, state: "hidden" } : item
      )
    );

    try {
      const res = await fetch(`/api/media/${photoId}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "hidden" }),
      });
      if (!res.ok) {
        console.error("Failed to hide photo");
      }
    } catch (err) {
      console.error("Error hiding photo:", err);
    }
  };

  const handleApproveAll = async () => {
    const pendingIds = pendingMedia.map((m) => m._id);
    if (pendingIds.length === 0) return;

    // Optimistic update
    setMediaList((prev) =>
      prev.map((item) =>
        pendingIds.includes(item._id) ? { ...item, state: "approved" } : item
      )
    );

    try {
      await Promise.all(
        pendingIds.map((id) =>
          fetch(`/api/media/${id}/moderate`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "approved" }),
          })
        )
      );
    } catch (err) {
      console.error("Error approving all photos:", err);
    }
  };

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

      const results = await Promise.all(uploadPromises);
      // Immediately add uploaded items to local state
      setMediaList((prev) => [...results, ...prev]);

      const successNotice = isModerator
        ? `Successfully uploaded ${fileList.length} file${fileList.length > 1 ? "s" : ""} (sent to moderation queue)!`
        : `Successfully uploaded ${fileList.length} file${fileList.length > 1 ? "s" : ""}! They will be visible once approved by the host.`;

      setUploadStatus(successNotice);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload one or more files. Please try again.";
      setErrorMsg(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(""), 4000);
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
    <div className="min-h-screen bg-ink-900 text-slate-100 relative overflow-hidden flex flex-col justify-between pb-12">
      {/* Background glow animations */}
      <div className="w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl absolute -top-40 -right-40 -z-10"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl absolute -bottom-40 -left-40 -z-10"></div>

      {/* Header Invitation Block */}
      <header className="w-full px-6 pb-12 pt-12 text-center bg-brand-500 rounded-b-[2rem] shadow-glow relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
          You&apos;re invited to share
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          {eventName}
        </h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-white/85">
          <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {eventDate}
        </p>

        {/* Host/Admin Badge */}
        {isModerator && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950/40 border border-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAdmin ? "Admin Moderation Active" : "Event Host Console Active"}
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full px-4 space-y-6 flex-grow z-10 -mt-6">
        
        {/* Heart Greetings Card */}
        <section className="rounded-2xl border border-white/10 bg-ink-800/90 p-5 text-center backdrop-blur-xl shadow-2xl">
          <svg className="mx-auto h-5 w-5 text-brand-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            &ldquo;Help us capture the night — share every photo you take. No app,
            no sign-up, just tap below.&rdquo;
          </p>
        </section>

        {/* Real-time sync connection status */}
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5">
          <span className="text-xs text-slate-400">Live Status</span>
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

        {/* Gallery Section */}
        {isModerator ? (
          /* Host / Admin View with Dual Sections */
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("approved")}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "approved"
                      ? "bg-brand-500 text-white shadow-glow"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  All Approved
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === "approved" ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {approvedMedia.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pending")}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "pending"
                      ? "bg-amber-500 text-ink-950 font-extrabold shadow-glow"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Yet to be Approved
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      activeTab === "pending"
                        ? "bg-ink-950/30 text-ink-950"
                        : pendingMedia.length > 0
                        ? "bg-amber-500 text-ink-950 font-bold"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {pendingMedia.length}
                  </span>
                </button>
              </div>

              {activeTab === "pending" && pendingMedia.length > 0 && (
                <button
                  type="button"
                  onClick={handleApproveAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Approve All ({pendingMedia.length})
                </button>
              )}
            </div>

            {activeTab === "pending" ? (
              <GalleryGrid
                mediaList={pendingMedia}
                showModeration={true}
                onApprove={handleApprove}
                onDecline={handleDecline}
                hideHeader={true}
                emptyTitle="No photos waiting for approval"
                emptySubtitle="When guests upload memories, they will appear here for review before going live to all guests."
              />
            ) : (
              <GalleryGrid
                mediaList={approvedMedia}
                showModeration={true}
                onDecline={handleDecline}
                hideHeader={true}
                emptyTitle="No approved photos yet"
                emptySubtitle="Photos approved by you will appear here and become visible to all event guests."
              />
            )}
          </div>
        ) : (
          /* Guest View: ONLY the approved section, with no mention of 'approved' or moderation tabs */
          <div className="pt-4">
            <GalleryGrid
              mediaList={approvedMedia}
              title="📸 Live Media Stream"
              emptyTitle="No photos shared yet"
              emptySubtitle="Scan the QR code, upload a photo or video, and be the first to share a moment!"
            />
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="max-w-md mx-auto w-full pt-12 px-4 text-center text-xs text-slate-600">
        <p>DropCast &bull; Shared securely with this event only &bull; Powered by Cloudinary</p>
      </footer>
    </div>
  );
}
