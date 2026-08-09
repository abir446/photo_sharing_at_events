import React from 'react';
import BookingClient from '@/components/BookingClient';
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("dropcast");

  // Query photographer by dynamic route param ID
  const photographer = await db
    .collection("photographers")
    .findOne({ id: id });

  if (!photographer) {
    notFound();
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
