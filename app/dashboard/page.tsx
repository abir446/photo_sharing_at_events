// app/dashboard/page.tsx
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your events, QR galleries, and photographer bookings from your DropCast dashboard.",
  robots: { index: false },
};
import EventCard from '@/components/EventCard';
import { redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb";
import { MongoEvent } from '@/utils/typescript/types';
import Link from 'next/link';
import {
  CalendarDaysIcon,
  StarIcon,
  ImagesIcon,
  PlusIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ZapIcon
} from 'lucide-react';

import PhotographerDashboard from "@/components/PhotographerDashboard";


export default async function Page() {
  const userDoc = await getCurrentUser();
  
  if (!userDoc) {
    redirect('/signin');
  }

  const user = {
    id: userDoc.userId as string,
    email: userDoc.email as string,
    name: userDoc.name as string,
    given_name: (userDoc.name as string).split(" ")[0]
  };

  const client = await clientPromise;
  const db = client.db("dropcast");

  // 1. Check user role selection in users collection
  const userDocDb = await db.collection("users").findOne({ userId: user.id });
  
  let isPhotographer = false;
  let needsOnboarding = false;

  if (userDocDb) {
    isPhotographer = userDocDb.role === "creator";
  } else {
    // Legacy fallback check for existing accounts
    const notedEmail = await db.collection("photographer_emails").findOne({ email: user.email });
    let legacyPhotographer = !!notedEmail;

    if (!legacyPhotographer) {
      const photographerProfile = await db.collection("photographers").findOne({
        $or: [{ email: user.email }, { userId: user.id }]
      });
      if (photographerProfile) {
        legacyPhotographer = true;
      }
    }

    if (legacyPhotographer) {
      // Auto-onboard legacy photographers
      isPhotographer = true;
      await db.collection("users").updateOne(
        { userId: user.id },
        {
          $set: {
            userId: user.id,
            email: user.email,
            name: user.name || user.email,
            role: "creator",
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );
      // Ensure photographer_emails list is noted
      await db.collection("photographer_emails").updateOne(
        { email: user.email },
        { $set: { email: user.email, userId: user.id, registeredAt: new Date() } },
        { upsert: true }
      );
    } else {
      // Check if they are a legacy host (have existing event spaces)
      const existingEvent = await db.collection("events").findOne({ userId: user.id });
      if (existingEvent) {
        isPhotographer = false;
        await db.collection("users").updateOne(
          { userId: user.id },
          {
            $set: {
              userId: user.id,
              email: user.email,
              name: user.name || user.email,
              role: "user",
              createdAt: new Date(),
            }
          },
          { upsert: true }
        );
      } else {
        // True new sign-up: needs selection
        needsOnboarding = true;
      }
    }
  }

  if (needsOnboarding) {
    redirect('/signup');
  }

  if (isPhotographer) {
    const profileDoc = await db.collection("photographers").findOne({
      $or: [{ email: user.email }, { userId: user.id }]
    });

    let profile = null;
    let bookings: any[] = [];

    if (profileDoc) {
      profile = {
        id: profileDoc.id,
        name: profileDoc.name,
        initials: profileDoc.initials,
        accent: profileDoc.accent,
        location: profileDoc.location,
        rating: profileDoc.rating,
        reviews: profileDoc.reviews,
        startingPrice: profileDoc.startingPrice,
        styles: profileDoc.styles,
        responseTime: profileDoc.responseTime,
        email: profileDoc.email || user.email,
      };

      const bookingsDocs = await db.collection("bookings")
        .find({ photographerId: profileDoc.id })
        .sort({ createdAt: -1 })
        .toArray();

      bookings = bookingsDocs.map((b) => ({
        id: b._id.toString(),
        userId: b.userId,
        userEmail: b.userEmail,
        packagePrice: b.packagePrice,
        addOns: b.addOns,
        totalAmount: b.totalAmount,
        dueToday: b.dueToday,
        paymentId: b.paymentId || null,
        eventDetails: b.eventDetails,
        status: b.status,
        createdAt: b.createdAt.toLocaleDateString(),
      }));
    }

    return (
      <PhotographerDashboard profile={profile} initialBookings={bookings} />
    );
  }
  
  const events = await db
    .collection<MongoEvent>("events")
    .find({ userId: user.id })
    .sort({_id: -1})
    .toArray();

  // Query real-time total guest uploads for this host's events
  const eventIds = events.map((e) => e._id.toString());
  let totalMediaCount = 0;
  if (eventIds.length > 0) {
    totalMediaCount = await db.collection("media").countDocuments({ eventId: { $in: eventIds } });
  }

  const stats = [
    { label: 'Events created', value: String(events.length), icon: CalendarDaysIcon },
    { label: 'Saved creators', value: '14', icon: StarIcon },
    { label: 'Guest uploads', value: totalMediaCount.toLocaleString(), icon: ImagesIcon }
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10">
      
      {/* Header section with stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-[#E5E2C4]">
        <div>
          <p className="text-sm font-semibold text-[#B250DF]">Welcome back, {user.given_name || "Host"}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900">
            Plan every moment of your event
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-zinc-550">
            Create shared photo galleries, generate custom guest QR codes, and collect every single memory in one place.
          </p>
        </div>

        <dl className="flex flex-wrap gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="min-w-[150px] rounded-2xl border border-[#E5E2C4] bg-white px-5 py-4 shadow-sm"
            >
              <dt className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <Icon className="h-3.5 w-3.5 text-[#CF6DFC]" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 text-2xl font-bold text-zinc-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Grid of Events */}
      <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        
        {/* Create New Event CTA card */}
        <div className="flex flex-col rounded-3xl border border-dashed border-[#E5E2C4] bg-white p-7 hover:border-[#CF6DFC]/50 hover:bg-[#FAF9F5] transition-all duration-300 items-center justify-center text-center group min-h-[300px] h-full shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C1BFFF]/20 text-[#B250DF] group-hover:scale-110 transition-transform duration-300">
            <PlusIcon className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-900">Create New Event</h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-[240px] leading-relaxed">
            Set up a live photo sharing space and generate a QR code for your guests instantly.
          </p>
          <Link 
            href="/dashboard/create" 
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#CF6DFC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#B250DF] transition-colors"
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Existing Event Cards */}
        {events.map((event) => (
          <EventCard 
            key={event._id.toString()}          
            name={event.name}                  
            date={event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            eId={event._id.toString()} 
            qrCodeUrl={event.qrCodeUrl || ""}
            planName={event.plan?.name}
          />
        ))}
      </div>

      {/* Assurance banner */}
      <section
        aria-labelledby="assurance-heading"
        className="mt-16 grid grid-cols-1 gap-6 rounded-3xl border border-[#E5E2C4] bg-white p-8 md:grid-cols-3 shadow-sm"
      >
        <h2 id="assurance-heading" className="sr-only">
          Why hosts choose DropCast
        </h2>
        {[
          {
            icon: ShieldCheckIcon,
            title: 'Secure cloud backups',
            copy: 'Every memory uploaded is safely stored in optimized Cloudinary storage.'
          },
          {
            icon: ZapIcon,
            title: 'No guest sign-ups',
            copy: 'Instant uploads via mobile browsers. Zero barrier to entry for guests.'
          },
          {
            icon: ImagesIcon,
            title: 'One gallery for everything',
            copy: 'Live SSE stream pushes new uploads to your dashboard gallery screen in real time.'
          }
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-4.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E2C4] bg-[#FAF9F5]">
              <Icon className="h-5 w-5 text-[#CF6DFC]" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
              <p className="mt-1.5 text-sm text-zinc-550 leading-relaxed">{copy}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}