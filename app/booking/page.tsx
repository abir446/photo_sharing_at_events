import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  MessageSquareIcon,
  SparklesIcon,
  StarIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  HelpCircleIcon
} from "lucide-react";

interface BookingDoc {
  _id: ObjectId;
  userId: string;
  userEmail: string;
  photographerId: string;
  photographerName: string;
  packagePrice: number;
  addOns: string[];
  totalAmount: number;
  dueToday: number;
  paymentId: string;
  eventDetails: {
    date: string;
    location: string;
    coverage: string;
    packageName: string;
  };
  status: string;
  createdAt: Date;
}

export default async function BookingsDashboardPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login?post_login_redirect_url=/booking");
  }

  const user = await getUser();
  if (!user || !user.id) {
    redirect("/api/auth/login?post_login_redirect_url=/booking");
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  // Fetch bookings for this host
  const bookingsDocs = await db
    .collection<BookingDoc>("bookings")
    .find({ userId: user.id })
    .sort({ createdAt: -1 })
    .toArray();

  // Fetch corresponding photographer details for aesthetic styling (accent, initials, etc.)
  const photographerIds = bookingsDocs.map((b) => b.photographerId);
  const photographersDocs = await db
    .collection("photographers")
    .find({ id: { $in: photographerIds } })
    .toArray();

  interface PhotographerDetails {
    id: string;
    initials?: string;
    accent?: string;
    location?: string;
  }

  const photographerMap = new Map<string, PhotographerDetails>();
  photographersDocs.forEach((p) => {
    photographerMap.set(p.id as string, {
      id: p.id as string,
      initials: p.initials as string | undefined,
      accent: p.accent as string | undefined,
      location: p.location as string | undefined,
    });
  });

  const bookings = bookingsDocs.map((b) => {
    const pDetails = photographerMap.get(b.photographerId) || {};
    return {
      id: b._id.toString(),
      photographerId: b.photographerId,
      photographerName: b.photographerName,
      initials: pDetails.initials || b.photographerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      accent: pDetails.accent || "#6366f1",
      location: pDetails.location || b.eventDetails.location,
      packagePrice: b.packagePrice,
      addOns: b.addOns,
      totalAmount: b.totalAmount,
      dueToday: b.dueToday,
      paymentId: b.paymentId,
      date: b.eventDetails.date,
      coverage: b.eventDetails.coverage,
      packageName: b.eventDetails.packageName,
      status: b.status,
      createdAt: b.createdAt.toLocaleDateString(),
    };
  });

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10 min-h-[80vh]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div>
          <p className="text-sm font-medium text-brand-400">Manage Your Sessions</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            Your Booked Creators
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-400 leading-relaxed">
            Track payments, message your creators, and unlock milestones as deliverables are finalized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/[0.04] border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-xl text-center min-w-[140px]">
            <span className="block text-2xl font-bold text-white">{bookings.length}</span>
            <span className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase">Active Bookings</span>
          </div>
        </div>
      </header>

      {bookings.length > 0 ? (
        <div className="mt-9 space-y-8">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-brand-500/30"
            >
              {/* Top Details & Creator Profile Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold text-white shrink-0 shadow-lg"
                    style={{ backgroundColor: booking.accent }}
                  >
                    {booking.initials}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl font-bold text-white">{booking.photographerName}</h2>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2Icon className="h-3 w-3" />
                        {booking.status === "confirmed" ? "Booking Confirmed" : booking.status}
                      </span>
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="h-4 w-4 text-brand-400" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClockIcon className="h-4 w-4 text-brand-400" />
                        {booking.coverage}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPinIcon className="h-4 w-4 text-brand-400" />
                        {booking.location}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center">
                  <Link
                    href={`/photographer/${booking.photographerId}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
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
                  <div className="rounded-2xl border border-white/5 bg-ink-950/40 p-5 space-y-3.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{booking.packageName}</span>
                      <span className="font-semibold text-white">${booking.packagePrice.toLocaleString()}</span>
                    </div>

                    {booking.addOns.map((addOnId) => (
                      <div key={addOnId} className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {addOnId === "qr" ? "Guest QR upload service" : "Cloud storage & delivery"}
                        </span>
                        <span className="font-semibold text-white">
                          +{addOnId === "qr" ? "$120" : "$60"}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                      <span className="text-slate-400">Total Price</span>
                      <span className="font-bold text-white">${booking.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                      <span className="text-brand-400 font-semibold">Deposit Paid Today</span>
                      <span className="font-extrabold text-white">${booking.dueToday.toLocaleString()}</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 mt-2 truncate">
                      Receipt Payment ID: {booking.paymentId}
                    </div>
                  </div>
                </div>

                {/* Column 2 & 3: Milestones Payment Breakdown */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Milestone Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Milestone 1 */}
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
                        <span className="text-base font-extrabold text-white">${Math.round(booking.dueToday).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Milestone 2 */}
                    <div className="rounded-2xl border border-white/5 bg-ink-950/40 p-4.5 flex flex-col justify-between h-40">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="h-6 w-6 rounded-lg bg-white/10 text-slate-400 flex items-center justify-center text-xs font-bold">2</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500 px-2 py-0.5 rounded-md">Upcoming</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-3.5">50% Event Day Payment</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Auto-charged morning of event.</p>
                      </div>
                      <div className="mt-auto border-t border-white/5 pt-2 text-right">
                        <span className="text-base font-extrabold text-slate-400">${Math.round(booking.packagePrice * 0.5).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Milestone 3 */}
                    <div className="rounded-2xl border border-white/5 bg-ink-950/40 p-4.5 flex flex-col justify-between h-40">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="h-6 w-6 rounded-lg bg-white/10 text-slate-400 flex items-center justify-center text-xs font-bold">3</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500 px-2 py-0.5 rounded-md">Escrow</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-3.5">30% Media Delivery</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Released upon final approval.</p>
                      </div>
                      <div className="mt-auto border-t border-white/5 pt-2 text-right">
                        <span className="text-base font-extrabold text-slate-400">${Math.round(booking.packagePrice * 0.3).toLocaleString()}</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </article>
          ))}
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
