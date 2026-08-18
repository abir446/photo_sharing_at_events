import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from 'next/navigation';
import RegisterClient from './RegisterClient';
import clientPromise from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "List Your Photography Business",
  description:
    "Join DropCast as a professional photographer. Create your portfolio, set your rates, and get booked for weddings, corporate events, and celebrations.",
  alternates: {
    canonical: "https://dropcast.app/photographer/register",
  },
};

export default async function Page() {
  const userDoc = await getCurrentUser();
  
  if (!userDoc) {
    redirect('/signin');
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  const existingProfile = await db.collection("photographers").findOne({
    userId: userDoc.userId
  });

  const serializedProfile = existingProfile ? {
    name: existingProfile.name,
    location: existingProfile.location,
    startingPrice: existingProfile.startingPrice,
    styles: existingProfile.styles || [],
    responseTime: existingProfile.responseTime,
    accent: existingProfile.accent
  } : null;

  return (
    <RegisterClient 
      defaultName={userDoc.name}
      defaultEmail={userDoc.email} 
      existingProfile={serializedProfile}
    />
  );
}
