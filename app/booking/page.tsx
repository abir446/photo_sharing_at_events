import React from 'react';
import BookingClient from '@/components/BookingClient';
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function BookingDefaultPage() {
  const client = await clientPromise;
  const db = client.db("dropcast");

  // Retrieve the first active creator in the list
  const photographer = await db
    .collection("photographers")
    .findOne({ subscribed: true });

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
