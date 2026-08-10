import React from 'react';
import BookingClient from '@/components/BookingClient';
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const client = await clientPromise;
  const db = client.db("dropcast");

  // Query photographer by dynamic route param ID
  const photographer = await db
    .collection("photographers")
    .findOne({ id: id });

  if (!photographer) {
    notFound();
  }

  // Self-booking restriction validation
  if (photographer.userId && user && photographer.userId === user.id) {
    return (
      <div className="min-h-[70vh] bg-ink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Self-Booking Restricted</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              You cannot book your own photographer profile. To test the booking experience, please register a different creator business or view another creator's profile in the marketplace.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/marketplace"
              className="inline-flex items-center justify-center font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm transition-all shadow-glow"
            >
              Explore Marketplace
            </a>
          </div>
        </div>
      </div>
    );
  }

  const serializedPhotographer = {
    id: photographer.id,
    name: photographer.name,
    initials: photographer.initials,
    accent: photographer.accent,
    location: photographer.location,
    rating: photographer.rating,
    reviews: photographer.reviews,
    startingPrice: photographer.startingPrice,
    styles: photographer.styles,
    portfolio: photographer.portfolio,
    verified: photographer.verified,
    responseTime: photographer.responseTime,
  };

  return <BookingClient photographer={serializedPhotographer} />;
}
