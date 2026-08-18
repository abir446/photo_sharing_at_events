import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your photographer bookings, payment milestones, and event schedules.",
  robots: { index: false },
};
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
import HostBookingsClient from "@/components/HostBookingsClient";

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
  const userDoc = await getCurrentUser();

  if (!userDoc) {
    redirect("/signin");
  }

  const user = {
    id: userDoc.userId as string,
    email: userDoc.email as string,
    name: userDoc.name as string
  };

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
    const pDetails = photographerMap.get(b.photographerId);
    return {
      id: b._id.toString(),
      photographerId: b.photographerId,
      photographerName: b.photographerName,
      initials: pDetails?.initials || b.photographerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      accent: pDetails?.accent || "#6366f1",
      location: pDetails?.location || b.eventDetails.location,
      packagePrice: b.packagePrice,
      addOns: b.addOns,
      totalAmount: b.totalAmount,
      dueToday: b.dueToday,
      paymentId: b.paymentId || null,
      date: b.eventDetails.date,
      coverage: b.eventDetails.coverage,
      packageName: b.eventDetails.packageName,
      status: b.status,
      createdAt: b.createdAt.toLocaleDateString(),
    };
  });

  return <HostBookingsClient initialBookings={bookings} />;
}
