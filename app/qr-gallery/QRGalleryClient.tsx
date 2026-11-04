"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CastIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  EyeOffIcon,
  FlagIcon,
  ImageIcon,
  LinkIcon,
  QrCodeIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon
} from 'lucide-react';
import DownloadQRButton from '@/components/DownloadQRButton';

interface EventData {
  id: string;
  name: string;
  date: string;
  qrCodeUrl: string;
  uploadUrl: string;
}

interface MediaItem {
  _id: string;
  eventId: string;
  url: string;
  resourceType: string;
  createdAt: string;
  state?: "approved" | "pending" | "hidden" | "flagged";
}

interface QRGalleryClientProps {
  initialEvents: EventData[];
  initialMediaMap: Record<string, MediaItem[]>;
}

export default function QRGalleryClient({ initialEvents, initialMediaMap }: QRGalleryClientProps) {
  const [events] = useState<EventData[]>(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0]?.id || "");
  const [mediaMap, setMediaMap] = useState<Record<string, MediaItem[]>>(initialMediaMap);
  const [copied, setCopied] = useState(false);
  const [hiddenPhotoIds, setHiddenPhotoIds] = useState<Set<string>>(new Set());
  const [flaggedPhotoIds, setFlaggedPhotoIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId);
  }, [events, selectedEventId]);

  const approvedMedia = useMemo(() => {
    return (mediaMap[selectedEventId] || [])
      .filter((item) => !hiddenPhotoIds.has(item._id) && (item.state === "approved" || !item.state));
  }, [mediaMap, selectedEventId, hiddenPhotoIds]);

  const pendingMedia = useMemo(() => {
    return (mediaMap[selectedEventId] || [])
      .filter((item) => !hiddenPhotoIds.has(item._id) && item.state === "pending");
  }, [mediaMap, selectedEventId, hiddenPhotoIds]);

  const displayedMedia = activeTab === "pending" ? pendingMedia : approvedMedia;

  // Poll for real-time live uploads of selected event
  useEffect(() => {
    if (!selectedEventId) return;

    let timerId: NodeJS.Timeout;
    let isActive = true;

    async function poll() {
      if (!isActive) return;

      try {
        const res = await fetch(`/api/event/${selectedEventId}/media`);
        if (!res.ok) throw new Error("Failed to fetch media");
        const data = await res.json();

        if (isActive) {
          setMediaMap((prev) => ({
            ...prev,
            [selectedEventId]: data
          }));
        }
      } catch (err) {
        console.error("Error polling event media:", err);
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
  }, [selectedEventId]);

  const copy = () => {
    if (!currentEvent?.uploadUrl) return;
    navigator.clipboard.writeText(currentEvent.uploadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleApprove = async (photoId: string) => {
    // Optimistic update
    setMediaMap((prev) => ({
      ...prev,
      [selectedEventId]: (prev[selectedEventId] || []).map((item) =>
        item._id === photoId ? { ...item, state: "approved" } : item
      )
    }));

    try {
      const response = await fetch(`/api/media/${photoId}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "approved" }),
      });
      if (!response.ok) {
        console.error("Failed to approve photo:", await response.text());
      }
    } catch (err) {
      console.error("Error approving photo:", err);
    }
  };

  const handleApproveAll = async () => {
    const pendingIds = pendingMedia.map((p) => p._id);
    if (pendingIds.length === 0) return;

    // Optimistic update
    setMediaMap((prev) => ({
      ...prev,
      [selectedEventId]: (prev[selectedEventId] || []).map((item) =>
        pendingIds.includes(item._id) ? { ...item, state: "approved" } : item
      )
    }));

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

  const handleHide = async (photoId: string) => {
    // Optimistic update
    setHiddenPhotoIds((prev) => {
      const next = new Set(prev);
      next.add(photoId);
      return next;
    });

    try {
      const response = await fetch(`/api/media/${photoId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'hidden' }),
      });
      if (!response.ok) {
        console.error("Failed to hide photo:", await response.text());
      }
    } catch (err) {
      console.error("Error hiding photo:", err);
    }
  };

  const handleFlag = async (photoId: string) => {
    const isCurrentlyFlagged = flaggedPhotoIds.has(photoId);
    const targetState = isCurrentlyFlagged ? 'approved' : 'flagged';

    // Optimistic update
    setFlaggedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });

    try {
      const response = await fetch(`/api/media/${photoId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: targetState }),
      });
      if (!response.ok) {
        console.error("Failed to flag photo:", await response.text());
      }
    } catch (err) {
      console.error("Error flagging photo:", err);
    }
  };

  const activityFeed = [
    { initials: 'EL', guest: 'Elena Lowe', action: 'created the event', ago: '1d ago' },
    { initials: 'JS', guest: 'John Smith', action: 'joined as a guest', ago: '5h ago' },
    { initials: 'DC', guest: 'Guest User', action: 'uploaded 3 photos', ago: '15m ago' }
  ];

  if (events.length === 0) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-8 py-16 text-center">
        <ImageIcon className="h-12 w-12 text-slate-600 mx-auto" />
        <h2 className="mt-4 text-xl font-bold text-white">No events found</h2>
        <p className="mt-2 text-slate-400 max-w-sm mx-auto">
          Please create an event first on the dashboard.
        </p>
        <Link
          href="/dashboard/create"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Create Event
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-8">
      <header className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/[0.04] px-6 py-5 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex flex-wrap items-center gap-5">
          <span className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              aria-label="Select event gallery"
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-lg font-bold text-slate-900 shadow-sm transition-colors hover:border-slate-300 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white dark:shadow-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-zinc-900 dark:[&>option]:text-white"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id} className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">
                  {e.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400"
              aria-hidden="true"
            />
          </span>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {approvedMedia.length} Live to Guests
            </span>
            {pendingMedia.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-600 dark:text-amber-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                {pendingMedia.length} Pending Approval
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 px-3 py-1.5 text-sm font-medium">
              <UsersIcon className="h-4 w-4 text-brand-500 dark:text-brand-400" aria-hidden="true" />
              Connected Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer"
          >
            <CastIcon className="h-4 w-4" aria-hidden="true" />
            Cast Live Slideshow
          </button>
          <Link
            href={`/event/${selectedEventId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <SettingsIcon className="h-4 w-4" aria-hidden="true" />
            QR Settings
          </Link>
        </div>
      </header>

      <div className="mt-7 flex flex-col lg:flex-row items-start gap-7">
        <section aria-label="Live guest photo feed" className="min-w-0 flex-1 w-full">
          {/* Moderation Section Switcher Tabs */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("approved")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "approved"
                    ? "bg-brand-500 text-white shadow-glow"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                All Approved
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === "approved" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                }`}>
                  {approvedMedia.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "pending"
                    ? "bg-amber-500 text-ink-950 font-extrabold shadow-glow"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                Yet to be Approved
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === "pending"
                    ? "bg-ink-950/30 text-ink-950"
                    : pendingMedia.length > 0
                    ? "bg-amber-500 text-ink-950 font-bold"
                    : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                }`}>
                  {pendingMedia.length}
                </span>
              </button>
            </div>

            {activeTab === "pending" && pendingMedia.length > 0 && (
              <button
                type="button"
                onClick={handleApproveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Approve All ({pendingMedia.length})
              </button>
            )}
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ImageIcon className="h-4 w-4 text-brand-500 dark:text-brand-400" aria-hidden="true" />
            {activeTab === "pending"
              ? "Pending review queue — approve photos to make them visible to all guests in real-time."
              : "Live feed — photos currently visible to all guests. Hover a photo to moderate."}
          </div>

          {displayedMedia.length > 0 ? (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-5 [column-fill:_balance]">
              {displayedMedia.map((photo) => {
                const isPending = photo.state === "pending";
                const isFlagged = flaggedPhotoIds.has(photo._id);
                return (
                  <figure
                    key={photo._id}
                    className="group relative mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-ink-950/40"
                  >
                    <img
                      src={photo.url}
                      alt="Event memory"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] max-h-[400px]"
                    />

                    {isPending ? (
                      <span className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Pending Approval
                      </span>
                    ) : isFlagged ? (
                      <span className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Flagged
                      </span>
                    ) : (
                      <span className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Live
                      </span>
                    )}

                    <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                          G
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">
                            Guest User
                          </span>
                          <span className="block text-[11px] text-slate-400">
                            {new Date(photo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 pointer-events-auto">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(photo._id)}
                              className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-2 py-1.5 text-[11px] font-bold text-white transition-colors cursor-pointer shadow-sm"
                            >
                              <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHide(photo._id)}
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/20 hover:bg-rose-500/30 px-2 py-1.5 text-[11px] font-semibold text-rose-200 transition-colors cursor-pointer"
                            >
                              <EyeOffIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              Decline
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleHide(photo._id)}
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/20 cursor-pointer"
                            >
                              <EyeOffIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              Hide
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFlag(photo._id)}
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/20 px-2 py-1.5 text-[11px] font-semibold text-rose-200 transition-colors hover:bg-rose-500/30 cursor-pointer"
                            >
                              <FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              Flag
                            </button>
                          </>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-16 bg-white/50 dark:bg-white/[0.01]">
              <ImageIcon className="h-8 w-8 text-slate-400 dark:text-slate-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                {activeTab === "pending" ? "No photos waiting for approval" : "No approved photos yet"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {activeTab === "pending"
                  ? "When guests upload memories, they will appear here for review before going live to all guests."
                  : "Approved photos will instantly show up here and be visible to your guests."}
              </p>
            </div>
          )}
        </section>

        <aside className="sticky top-24 w-full lg:w-[320px] shrink-0 space-y-5 self-start">
          <section className="rounded-2xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/[0.04] p-5 backdrop-blur-xl shadow-sm dark:shadow-none">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <QrCodeIcon className="h-4 w-4 text-brand-500 dark:text-brand-400" aria-hidden="true" />
              Printable QR code
            </h2>
            <div className="mt-4 rounded-2xl bg-white p-5 text-center border border-slate-100 dark:border-none shadow-sm dark:shadow-none">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Share your photos
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">{currentEvent?.name}</p>
              
              {currentEvent?.qrCodeUrl ? (
                <div className="mt-3 flex justify-center">
                  <Image 
                    src={currentEvent.qrCodeUrl} 
                    alt="Event QR code" 
                    width={160} 
                    height={160} 
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="mt-3 w-[160px] h-[160px] bg-slate-100 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 mx-auto rounded-lg">
                  No QR Code
                </div>
              )}
              
              <p className="mt-3 text-[10px] font-medium text-slate-600">
                Scan with your camera — no app needed
              </p>
            </div>
            
            {currentEvent?.qrCodeUrl && (
              <div className="mt-4">
                <DownloadQRButton 
                  qrCodeUrl={currentEvent.qrCodeUrl} 
                  eventName={currentEvent.name} 
                />
              </div>
            )}
          </section>

          {currentEvent?.uploadUrl && (
            <section className="rounded-2xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/[0.04] p-5 backdrop-blur-xl shadow-sm dark:shadow-none">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <LinkIcon className="h-4 w-4 text-brand-500 dark:text-brand-400" aria-hidden="true" />
                Quick share link
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-ink-950/60 px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
                  {currentEvent.uploadUrl}
                </code>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
                >
                  {copied ? (
                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
              <Link
                href={`/event/${selectedEventId}/upload`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300"
              >
                <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Preview the guest experience
              </Link>
            </section>
          )}

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white">Recent activity</h2>
            <ol className="mt-3.5 space-y-3.5">
              {activityFeed.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-slate-200">
                    {item.initials}
                  </span>
                  <p className="text-xs leading-relaxed text-slate-400">
                    <span className="font-semibold text-white">{item.guest}</span>{' '}
                    {item.action}
                    <span className="block text-[11px] text-slate-500">
                      {item.ago}
                    </span>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </main>
  );
}
