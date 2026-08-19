import type { Metadata } from "next";
import clientPromise from "@/lib/mongodb";
import MarketplaceClient from './MarketplaceClient';
import { getCurrentUser } from "@/lib/auth";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Photographer Marketplace — Browse & Book Creators",
  description:
    "Discover and book vetted event photographers filtered by location, budget, and style. Candid, cinematic, editorial, and documentary styles available with escrow-backed payments.",
  alternates: {
    canonical: "https://dropcast.app/marketplace",
  },
};

export default async function Page() {
  const userDoc = await getCurrentUser();
  if (userDoc && userDoc.role === "creator") {
    redirect('/dashboard');
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  // 1. Seeding check: Populate photographers collection if empty
  const count = await db.collection("photographers").countDocuments();
  if (count === 0) {
    const { photographers: mockPhotographers } = await import("@/data/photographers");
    const seededPhotographers = mockPhotographers.map((p) => ({
      ...p,
      subscribed: true, // Mark original mock photographers as subscribed so they display immediately
    }));
    await db.collection("photographers").insertMany(seededPhotographers);
  }

  // 2. Query only verified, active subscribers
  const photographerDocs = await db
    .collection("photographers")
    .find({ subscribed: true })
    .toArray();

  // 3. Serialize MongoDB documents
  const photographers = photographerDocs.map((p) => ({
    id: p.id,
    name: p.name,
    initials: p.initials,
    accent: p.accent,
    location: p.location,
    rating: p.rating,
    reviews: p.reviews,
    startingPrice: p.startingPrice,
    styles: p.styles,
    portfolio: p.portfolio,
    verified: p.verified,
    responseTime: p.responseTime,
    subscribed: p.subscribed || false,
  }));

  // 4. Query active bookings to determine availability
  const bookingsDocs = await db
    .collection("bookings")
    .find({ status: { $in: ["accepted", "confirmed"] } })
    .project({ photographerId: 1, "eventDetails.date": 1 })
    .toArray();

  const bookedDates = bookingsDocs.map((b) => ({
    photographerId: b.photographerId as string,
    date: (b.eventDetails?.date || "") as string,
  }));

  return <MarketplaceClient initialPhotographers={photographers} bookedDates={bookedDates} />;
}
