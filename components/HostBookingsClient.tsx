"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  MessageSquareIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  HelpCircleIcon,
  LockIcon,
  Loader2Icon,
  XCircleIcon
} from "lucide-react";
import { formatReadableDate } from "@/utils/date";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface Booking {
  id: string;
  photographerId: string;
  photographerName: string;
  initials: string;
  accent: string;
  location: string;
  packagePrice: number;
  addOns: string[];
  totalAmount: number;
  dueToday: number;
  paymentId: string | null;
  date: string;
  coverage: string;
  packageName: string;
  status: string;
  createdAt: string;
}

interface HostBookingsClientProps {
  initialBookings: Booking[];
  isAdmin?: boolean;
}

export default function HostBookingsClient({
  initialBookings,
  isAdmin = false,
}: HostBookingsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dynamically load Razorpay checkout script on client mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayDeposit = async (booking: Booking) => {
    if (payingId) return;
    setPayingId(booking.id);
    setError(null);

    // If user is Admin, bypass Razorpay and confirm deposit directly for free
    if (isAdmin) {
      try {
        const payResponse = await fetch(`/api/booking/${booking.id}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: "admin_test_deposit_free",
          }),
        });

        const res = await payResponse.json();
        if (res.success) {
          showToast.success("Deposit confirmed (Admin Free Test)!", {
            duration: 4000,
            position: "top-right",
            transition: "bounceIn",
          });

          // Update state locally
          setBookings((prev) =>
            prev.map((b) =>
              b.id === booking.id
                ? { ...b, status: "confirmed", paymentId: "admin_test_deposit_free" }
                : b
            )
          );
        } else {
          throw new Error(res.error || "Failed to confirm deposit");
        }
      } catch (err) {
        console.error("Admin deposit error:", err);
        setError(err instanceof Error ? err.message : "Failed to confirm deposit.");
      } finally {
        setPayingId(null);
      }
      return;
    }

    try {
      // dueToday is already in INR
      const dueTodayINR = booking.dueToday;
      const orderResponse = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(dueTodayINR * 100) }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to establish Razorpay order.");
      }

      const orderData = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "DropCast Book Photographer",
        description: `Deposit for ${booking.photographerName}`,
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const payResponse = await fetch(`/api/booking/${booking.id}/pay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id
              }),
            });

            const res = await payResponse.json();
            if (res.success) {
              showToast.success("Deposit paid! Booking confirmed.", {
                duration: 4500,
                position: "top-right",
                transition: "bounceIn",
              });
              
              // Update state locally
              setBookings((prev) =>
                prev.map((b) =>
                  b.id === booking.id
                    ? { ...b, status: "confirmed", paymentId: response.razorpay_payment_id }
                    : b
                )
              );
            } else {
              throw new Error(res.error || "Failed to update payment details");
            }
          } catch (err) {
            console.error("Pay booking error:", err);
            const msg = err instanceof Error ? err.message : undefined;
            setError(msg || "Payment was successful, but booking confirmation failed. Please contact support.");
          } finally {
            setPayingId(null);
          }
        },
        prefill: {
          name: "Event Host",
          email: ""
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setPayingId(null);
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please try again.");
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPayingId(null);
    }
  };

  const handleSimulatePaySuccess = async (booking: Booking) => {
    if (payingId) return;
    setPayingId(booking.id);
    setError(null);

    try {
      const mockPayId = "mock_pay_deposit_" + Math.random().toString(36).substring(2, 9);
      const payResponse = await fetch(`/api/booking/${booking.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: mockPayId
        }),
      });

      const res = await payResponse.json();
      if (res.success) {
        showToast.success("Deposit paid successfully (Simulated)!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });

        // Update state locally
        setBookings((prev) =>
          prev.map((b) =>
            b.id === booking.id
              ? { ...b, status: "confirmed", paymentId: mockPayId }
              : b
          )
        );
      } else {
        throw new Error(res.error || "Failed to confirm payment simulation");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to simulate payment.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10 min-h-[80vh]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-indigo-100 dark:border-white/5">
        <div>
          <p className="text-sm font-bold text-indigo-950 dark:text-brand-400">Manage Your Sessions</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Your Booked Creators
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Track photographer response, complete deposit payments once accepted, and unlock milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-white/[0.04] border border-indigo-150/80 dark:border-white/10 px-5 py-4 rounded-2xl shadow-xs dark:shadow-none backdrop-blur-xl text-center min-w-[140px]">
            <span className="block text-2xl font-bold text-slate-900 dark:text-white">{bookings.length}</span>
            <span className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase">Active Bookings</span>
          </div>
        </div>
      </header>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-300">
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-left">
          <ShieldCheckIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 font-semibold text-sm">Admin Testing Mode Active</h4>
            <p className="text-amber-200/80 text-xs mt-0.5">
              As an Administrator, booking deposit payments are completely waived (₹0). You can confirm any accepted bookings without opening payment gateways.
            </p>
          </div>
        </div>
      )}

      {bookings.length > 0 ? (
        <div className="mt-9 space-y-8">
          {bookings.map((booking) => {
            const isPending = booking.status === "pending";
            const isAccepted = booking.status === "accepted";
            const isConfirmed = booking.status === "confirmed";
            const isRejected = booking.status === "rejected";

            return (
              <article
                key={booking.id}
                className="rounded-3xl border border-indigo-150/80 bg-white dark:border-white/10 dark:bg-white/[0.03] p-6 md:p-8 shadow-sm dark:shadow-none backdrop-blur-xl transition-all duration-300 hover:border-brand-300 dark:hover:border-brand-500/30"
              >
                {/* Top Details & Creator Profile Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-indigo-100 dark:border-white/5">
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold text-white shrink-0 shadow-lg"
                      style={{ backgroundColor: booking.accent }}
                    >
                      {booking.initials}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{booking.photographerName}</h2>
                        
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                            <Loader2Icon className="h-3 w-3 animate-spin" />
                            Awaiting Acceptance
                          </span>
                        )}
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                            Accepted · Pay Deposit
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2Icon className="h-3 w-3" />
                            Booking Confirmed
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                            <XCircleIcon className="h-3 w-3" />
                            Declined by Photographer
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <CalendarDaysIcon className="h-4 w-4 text-indigo-700 dark:text-brand-400" />
                          {formatReadableDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ClockIcon className="h-4 w-4 text-indigo-700 dark:text-brand-400" />
                          {booking.coverage}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPinIcon className="h-4 w-4 text-indigo-700 dark:text-brand-400" />
                          {booking.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start lg:self-center">
                    <Link
                      href={`/photographer/${booking.photographerId}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-slate-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white px-4.5 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                    >
                      View Portfolio
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4.5 py-2.5 text-xs font-semibold text-white shadow-glow hover:bg-brand-600 transition-all cursor-pointer"
                    >
                      <MessageSquareIcon className="h-3.5 w-3.5" />
                      Message Creator
                    </button>
                  </div>
                </div>

                {/* Booking Pricing Summary & Schedule */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Column 1: Package Pricing Summary */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Booking Summary</h3>
                    <div className="rounded-2xl border border-indigo-150/80 bg-indigo-50/40 dark:border-white/5 dark:bg-ink-950/40 p-5 space-y-3.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{booking.packageName}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">₹{booking.packagePrice.toLocaleString()}</span>
                      </div>

                      {booking.addOns.map((addOnId) => (
                        <div key={addOnId} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            {addOnId === "qr" ? "Guest QR upload service" : "Cloud storage & delivery"}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            +₹{(addOnId === "qr" ? 9960 : 4980).toLocaleString()}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between border-t border-indigo-100 dark:border-white/10 pt-3 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Total Price</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{booking.totalAmount.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-t border-indigo-100 dark:border-white/10 pt-3 text-sm">
                        <span className="text-indigo-950 dark:text-brand-400 font-bold">Deposit Paid Today</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">₹{booking.dueToday.toLocaleString()}</span>
                      </div>

                      {isConfirmed && booking.paymentId && (
                        <div className="text-[10px] font-mono text-slate-500 mt-2 truncate">
                          Receipt Payment ID: {booking.paymentId}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2 & 3: Milestones Payment Breakdown */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Milestone Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Milestone 1 */}
                      {isConfirmed ? (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4.5 relative overflow-hidden flex flex-col justify-between h-40">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="h-6 w-6 rounded-lg bg-emerald-500 text-ink-900 flex items-center justify-center text-xs font-bold">1</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">Paid</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-3.5">20% Booking Deposit</h4>
                            <p className="text-[11px] text-slate-400 mt-1">Locks date & reserves creator.</p>
                          </div>
                          <div className="mt-auto border-t border-white/5 pt-2 text-right">
                            <span className="text-base font-extrabold text-white">₹{Math.round(booking.dueToday).toLocaleString()}</span>
                          </div>
                        </div>
                      ) : isAccepted ? (
                        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-4.5 relative overflow-hidden flex flex-col justify-between h-40">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="h-6 w-6 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-950 border border-indigo-200 dark:bg-brand-500/20 dark:text-brand-400 px-2 py-0.5 rounded-md animate-pulse">Due Now</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-2.5">20% Booking Deposit</h4>
                            <p className="text-[11px] text-slate-400 mt-1">Pay deposit to secure date.</p>
                          </div>
                          <div className="mt-auto border-t border-white/5 pt-2 flex items-center justify-between">
                            {isAdmin ? (
                              <span className="text-sm font-bold text-emerald-400">₹0 (Free Admin)</span>
                            ) : (
                              <span className="text-sm font-bold text-white">₹{Math.round(booking.dueToday).toLocaleString()}</span>
                            )}
                            <button
                              type="button"
                              disabled={payingId !== null}
                              onClick={() => handlePayDeposit(booking)}
                              className="inline-flex items-center gap-1 bg-brand-500 hover:bg-brand-600 text-white px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              {payingId === booking.id ? (
                                <Loader2Icon className="h-3 w-3 animate-spin" />
                              ) : (
                                <ShieldCheckIcon className="h-3 w-3" />
                              )}
                              {isAdmin ? "Confirm Free (Admin)" : "Pay Now"}
                            </button>
                          </div>
                        </div>
                      ) : isPending ? (
                        <div className="rounded-2xl border border-white/10 bg-ink-950/20 p-4.5 relative overflow-hidden flex flex-col justify-between h-40">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="h-6 w-6 rounded-lg bg-white/10 text-slate-400 flex items-center justify-center text-xs font-bold">1</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500 px-2 py-0.5 rounded-md">Pending</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-300 mt-3.5">20% Booking Deposit</h4>
                            <p className="text-[11px] text-slate-400 mt-1">Awaiting acceptance.</p>
                          </div>
                          <div className="mt-auto border-t border-white/5 pt-2 text-right">
                            <span className="text-xs text-slate-400 italic">Locked until accepted</span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-ink-950/20 p-4.5 relative overflow-hidden flex flex-col justify-between h-40">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="h-6 w-6 rounded-lg bg-white/10 text-slate-400 flex items-center justify-center text-xs font-bold">1</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md">Cancelled</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-500 mt-3.5">20% Booking Deposit</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Request declined.</p>
                          </div>
                          <div className="mt-auto border-t border-white/5 pt-2 text-right">
                            <span className="text-xs text-rose-500">Declined</span>
                          </div>
                        </div>
                      )}

                      {/* Milestone 2 */}
                      <div className="rounded-2xl border border-indigo-150/80 bg-indigo-50/40 dark:border-white/5 dark:bg-ink-950/40 p-4.5 flex flex-col justify-between h-40">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="h-6 w-6 rounded-lg bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-400 flex items-center justify-center text-xs font-bold">2</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200/60 text-slate-700 dark:bg-white/5 dark:text-slate-500 px-2 py-0.5 rounded-md">Upcoming</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3.5">50% Event Day Payment</h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Auto-charged morning of event.</p>
                        </div>
                        <div className="mt-auto border-t border-indigo-100 dark:border-white/5 pt-2 text-right">
                          <span className="text-base font-extrabold text-slate-700 dark:text-slate-400">₹{Math.round(booking.packagePrice * 0.5).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Milestone 3 */}
                      <div className="rounded-2xl border border-indigo-150/80 bg-indigo-50/40 dark:border-white/5 dark:bg-ink-950/40 p-4.5 flex flex-col justify-between h-40">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="h-6 w-6 rounded-lg bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-400 flex items-center justify-center text-xs font-bold">3</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200/60 text-slate-700 dark:bg-white/5 dark:text-slate-500 px-2 py-0.5 rounded-md">Escrow</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3.5">30% Media Delivery</h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Released upon final approval.</p>
                        </div>
                        <div className="mt-auto border-t border-indigo-100 dark:border-white/5 pt-2 text-right">
                          <span className="text-base font-extrabold text-slate-700 dark:text-slate-400">₹{Math.round(booking.packagePrice * 0.3).toLocaleString()}</span>
                        </div>
                      </div>

                    </div>

                    {/* Developer Simulated Pay Controls for Accepted status */}
                    {isAccepted && (
                      <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-4 text-center">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          🔧 Developer Payment simulation
                        </p>
                        <button
                          type="button"
                          disabled={payingId !== null}
                          onClick={() => handleSimulatePaySuccess(booking)}
                          className="mt-2.5 inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {payingId === booking.id ? "Processing..." : "Simulate Deposit Payment Success"}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.01] px-6 py-20 text-center max-w-2xl mx-auto backdrop-blur-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 animate-pulse">
            <SparklesIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-white">No Photographer Sessions Booked</h2>
          <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
            Browse our vetted professional event creators and secure your dates using milestones in escrow.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-brand-600 transition-colors"
          >
            Find a Photographer
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Trust banner */}
      <section className="mt-16 grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl md:grid-cols-3">
        {[
          {
            icon: ShieldCheckIcon,
            title: "Escrow Protected Deposits",
            copy: "Milestone funds remain in escrow, only released upon your approval."
          },
          {
            icon: SparklesIcon,
            title: "100% Satisfaction Guarantee",
            copy: "Verified reviews ensure only the highest-rated local creatives capture your memory."
          },
          {
            icon: HelpCircleIcon,
            title: "24/7 Concierge Support",
            copy: "Our support specialists are here to coordinate schedules, backup creators, and delivery."
          }
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10">
              <Icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{copy}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
