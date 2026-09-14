import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin Command Center — DropCast",
  description: "Platform-wide management for events, bookings, creators, users, and media moderation.",
  robots: { index: false },
};

export default async function AdminPage() {
  const userDoc = await getCurrentUser();

  if (!userDoc) {
    redirect("/signin");
  }

  const isAdmin = userDoc.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Access Denied</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              You are not authorized to access the Admin Panel. Only designated administrators can manage platform resources.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 text-sm transition-all duration-200 shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  // 1. Fetch Events
  const events = await db
    .collection("events")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  // 2. Fetch Bookings
  const bookings = await db
    .collection("bookings")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  // 3. Fetch Photographers / Creators
  const creators = await db
    .collection("photographers")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  // 4. Fetch Users (omitting password)
  const users = await db
    .collection("users")
    .find({})
    .project({ password: 0 })
    .sort({ createdAt: -1 })
    .toArray();

  // 5. Fetch Recent Media Uploads
  const recentMedia = await db
    .collection("media")
    .find({})
    .sort({ createdAt: -1 })
    .limit(80)
    .toArray();

  // 6. Media counts per event
  const mediaCountMap: Record<string, number> = {};
  const mediaAggregation = await db.collection("media").aggregate([
    { $group: { _id: "$eventId", count: { $sum: 1 } } }
  ]).toArray();
  mediaAggregation.forEach((item) => {
    mediaCountMap[item._id] = item.count;
  });

  const totalMediaUploadsCount = await db.collection("media").countDocuments();

  // 7. Calculate Financials / Platform Volume (Excluding Admin test transactions)
  let totalEventRevenue = 0;
  events.forEach((e) => {
    const isTest = (e as { isAdminTest?: boolean }).isAdminTest || e.paymentId?.startsWith("admin_test_");
    if (e.paymentId && e.plan?.price && !isTest) {
      totalEventRevenue += Number(e.plan.price);
    }
  });

  let totalBookingVolume = 0;
  bookings.forEach((b) => {
    const isTest = (b as { isAdminTest?: boolean }).isAdminTest || b.paymentId?.startsWith("admin_test_");
    if ((b.status === "confirmed" || b.status === "accepted") && !isTest) {
      totalBookingVolume += Number(b.totalAmount || b.packagePrice || 0);
    }
  });

  // Serialization
  const serializedEvents = events.map((event) => ({
    id: event._id.toString(),
    userId: event.userId || "",
    createdBy: event.createdBy || event.userId || "Unknown",
    name: event.name || "Untitled Event",
    date: event.date instanceof Date ? event.date.toISOString() : String(event.date || ""),
    qrCodeUrl: event.qrCodeUrl || "",
    uploadUrl: event.uploadUrl || "",
    paymentId: event.paymentId || null,
    plan: event.plan || null,
    mediaCount: mediaCountMap[event._id.toString()] || 0,
    createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : new Date().toISOString(),
  }));

  const serializedBookings = bookings.map((b) => ({
    id: b._id.toString(),
    userId: b.userId || "",
    userEmail: b.userEmail || "",
    photographerId: b.photographerId || "",
    photographerName: b.photographerName || "Creator",
    packagePrice: Number(b.packagePrice || 0),
    addOns: Array.isArray(b.addOns) ? b.addOns : [],
    totalAmount: Number(b.totalAmount || b.packagePrice || 0),
    dueToday: Number(b.dueToday || 0),
    paymentId: b.paymentId || null,
    status: b.status || "pending",
    eventDetails: {
      date: b.eventDetails?.date || "",
      location: b.eventDetails?.location || "",
      coverage: b.eventDetails?.coverage || "",
      packageName: b.eventDetails?.packageName || "",
    },
    createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString(),
  }));

  const serializedCreators = creators.map((c) => ({
    id: c.id || c._id.toString(),
    name: c.name || "Unnamed Creator",
    initials: c.initials || "CR",
    accent: c.accent || "#6366f1",
    location: c.location || "Local",
    rating: Number(c.rating || 5.0),
    reviews: Number(c.reviews || 0),
    startingPrice: Number(c.startingPrice || 0),
    styles: Array.isArray(c.styles) ? c.styles : [],
    verified: Boolean(c.verified),
    subscribed: Boolean(c.subscribed),
    email: c.email || "",
    paymentId: c.paymentId || null,
    responseTime: c.responseTime || "Usually responds in 1 hour",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
  }));

  const serializedUsers = users.map((u) => ({
    id: u.userId || u._id.toString(),
    email: u.email || "",
    name: u.name || u.email || "Anonymous",
    role: u.role || "user",
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
  }));

  const serializedMedia = recentMedia.map((m) => ({
    id: m._id.toString(),
    eventId: m.eventId || "",
    url: m.url || "",
    publicId: m.publicId || "",
    resourceType: m.resourceType || "image",
    state: m.state || "approved",
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
  }));

  const platformStats = {
    totalRevenue: totalEventRevenue + totalBookingVolume,
    eventRevenue: totalEventRevenue,
    bookingVolume: totalBookingVolume,
    totalEvents: events.length,
    totalBookings: bookings.length,
    totalCreators: creators.length,
    totalUsers: users.length,
    totalMedia: totalMediaUploadsCount,
  };

  return (
    <AdminDashboard
      currentAdminUser={{
        id: userDoc.userId as string,
        email: userDoc.email as string,
        name: userDoc.name as string,
      }}
      initialEvents={serializedEvents}
      initialBookings={serializedBookings}
      initialCreators={serializedCreators}
      initialUsers={serializedUsers}
      initialMedia={serializedMedia}
      initialStats={platformStats}
    />
  );
}