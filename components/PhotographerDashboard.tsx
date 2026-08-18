"use client";

import React, { useState } from "react";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  MessageSquareIcon,
  SparklesIcon,
  StarIcon,
  XCircleIcon,
  Loader2Icon,
  DollarSignIcon,
  UserIcon,
  CheckIcon,
  XIcon
} from "lucide-react";

interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  packagePrice: number;
  addOns: string[];
  totalAmount: number;
  dueToday: number;
  paymentId: string | null;
  eventDetails: {
    date: string;
    location: string;
    coverage: string;
    packageName: string;
  };
  status: string;
  createdAt: string;
}

interface PhotographerProfile {
  id: string;
  name: string;
  initials: string;
  accent: string;
  location: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  styles: string[];
  responseTime: string;
  email: string;
}

interface PhotographerDashboardProps {
  profile: PhotographerProfile | null;
  initialBookings: Booking[];
}

export default function PhotographerDashboard({
  profile,
  initialBookings
}: PhotographerDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // If photographer doesn't have a registered profile yet
  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-16 text-center min-h-[85vh] flex flex-col justify-center items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-6 animate-pulse">
          <SparklesIcon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Welcome to DropCast!
        </h1>
        <p className="mt-3 text-slate-400 text-sm max-w-md leading-relaxed">
          Your photographer account is active. To start appearing on our local marketplace and receiving booking requests from hosts, please set up your creator profile listing.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/photographer/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 text-sm transition-all shadow-glow"
          >
            Create Your Marketplace Profile
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-semibold px-6 py-3 text-sm transition-all"
          >
            Go Back Home
          </Link>
        </div>
      </main>
    );
  }

  const handleRespond = async (bookingId: string, action: "accept" | "reject") => {
    if (respondingId) return;
    setRespondingId(bookingId);

    try {
      const response = await fetch(`/api/booking/${bookingId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast.success(
          action === "accept"
            ? "Booking request accepted! Host has been notified to pay."
            : "Booking request rejected.",
          {
            duration: 4000,
            position: "top-right",
            transition: "bounceIn",
          }
        );

        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: data.status } : b))
        );
      } else {
        throw new Error(data.error || "Failed to update booking status");
      }
    } catch (err: unknown) {
      console.error(err);
      showToast.error(err instanceof Error ? err.message : "Failed to update booking.");
    } finally {
      setRespondingId(null);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeBookings = bookings.filter((b) => b.status !== "pending");

  // Stats calculation
  const totalBookedValue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = [
    { label: "Pending Requests", value: String(pendingRequests.length), color: "text-amber-400" },
    {
      label: "Active Bookings",
      value: String(bookings.filter((b) => b.status === "confirmed" || b.status === "accepted").length),
      color: "text-brand-400",
    },
    { label: "Earnings in Escrow", value: `₹${totalBookedValue.toLocaleString()}`, color: "text-emerald-400" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10 min-h-[80vh]">
      {/* Header section with stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
              style={{ backgroundColor: profile.accent }}
            >
              {profile.initials}
            </span>
            <div>
              <p className="text-sm font-medium text-brand-400">Creator Hub</p>
              <h1 className="text-2xl font-black text-white">{profile.name}</h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-[15px] text-slate-400 leading-relaxed">
            Manage your schedule, accept incoming leads, and monitor deposit releases for your event sessions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href={`/photographer/${profile.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold px-4 py-2 text-xs transition-all cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5 text-brand-400" />
              View Portfolio Page
            </Link>
            <Link
              href="/photographer/register"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/20 bg-brand-500/5 hover:bg-brand-500/10 text-brand-400 font-semibold px-4 py-2 text-xs transition-all cursor-pointer"
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        <dl className="flex flex-wrap gap-4">
          {stats.map(({ label, value, color }) => (
            <div
              key={label}
              className="min-w-[150px] rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl"
            >
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</dt>
              <dd className={`mt-1.5 text-2xl font-extrabold ${color}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Grid of Pending Requests */}
      <section className="mt-10 space-y-6" aria-labelledby="requests-heading">
        <h2 id="requests-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Booking Requests ({pendingRequests.length})
        </h2>

        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((booking) => (
              <article
                key={booking.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between hover:border-brand-500/20 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                        <Loader2Icon className="h-3 w-3 animate-spin" />
                        Pending Action
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">
                        {booking.eventDetails.packageName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <UserIcon className="h-3 w-3 text-brand-400" />
                        Host: {booking.userEmail}
                      </p>
                    </div>
                    <span className="text-xl font-black text-white shrink-0">
                      ₹{booking.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <dl className="mt-5 grid grid-cols-1 gap-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4 text-brand-400 shrink-0" />
                      <span>{booking.eventDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-brand-400 shrink-0" />
                      <span>{booking.eventDetails.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-brand-400 shrink-0" />
                      <span className="truncate">{booking.eventDetails.location}</span>
                    </div>
                  </dl>

                  {booking.addOns.length > 0 && (
                    <div className="mt-4 border-t border-white/5 pt-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selected Add-ons:</span>
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {booking.addOns.map((ao) => (
                          <li
                            key={ao}
                            className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-semibold"
                          >
                            {ao === "qr" ? "Live Guest QR upload" : "Secure Cloud Storage"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                  <button
                    type="button"
                    disabled={respondingId !== null}
                    onClick={() => handleRespond(booking.id, "accept")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {respondingId === booking.id ? (
                      <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckIcon className="h-3.5 w-3.5" />
                    )}
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={respondingId !== null}
                    onClick={() => handleRespond(booking.id, "reject")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 py-2.5 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.01] p-10 text-center max-w-lg mx-auto">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-500 mb-4">
              <CalendarDaysIcon className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-white">No Pending Requests</h3>
            <p className="mt-1 text-xs text-slate-400">
              When hosts express interest or book you from the marketplace, requests will display here.
            </p>
          </div>
        )}
      </section>

      {/* Active & Historical Bookings Section */}
      <section className="mt-14 space-y-6" aria-labelledby="active-heading">
        <h2 id="active-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Bookings Archive ({activeBookings.length})
        </h2>

        {activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.map((booking) => {
              const isConfirmed = booking.status === "confirmed";
              const isAccepted = booking.status === "accepted";
              const isRejected = booking.status === "rejected";

              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {booking.eventDetails.packageName}
                      </h4>
                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                          <CheckCircle2Icon className="h-2.5 w-2.5" />
                          Deposit Paid
                        </span>
                      )}
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[9px] font-bold text-blue-400">
                          <Loader2Icon className="h-2.5 w-2.5 animate-spin" />
                          Awaiting Payment
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[9px] font-bold text-rose-400">
                          <XCircleIcon className="h-2.5 w-2.5" />
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Host: {booking.userEmail}</span>
                      <span>·</span>
                      <span>Date: {booking.eventDetails.date}</span>
                      <span>·</span>
                      <span>Location: {booking.eventDetails.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Total Value</span>
                      <span className="block text-sm font-extrabold text-white">
                        ₹{booking.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {isConfirmed ? "Deposit Received" : "Deposit Due"}
                      </span>
                      <span className={`block text-sm font-extrabold ${isConfirmed ? "text-emerald-400" : "text-slate-400"}`}>
                        ₹{booking.dueToday.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                        title="Message Host"
                      >
                        <MessageSquareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.01] p-10 text-center max-w-lg mx-auto">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-500 mb-4">
              <CalendarDaysIcon className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-white">No Historical Sessions</h3>
            <p className="mt-1 text-xs text-slate-400">
              Your active and completed event bookings will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
