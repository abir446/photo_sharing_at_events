import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import PortfolioClient from "./PortfolioClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("dropcast");

  // Query photographer by their unique string ID
  const photographer = await db
    .collection("photographers")
    .findOne({ id: id });

  if (!photographer) {
    notFound();
  }

  // Serialize MongoDB document fields
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
    userId: photographer.userId || null,
  };

  // Fetch sample portfolio images from other listed creators
  const otherPhotographersDocs = await db
    .collection("photographers")
    .find({ id: { $ne: id }, subscribed: true })
    .limit(6)
    .toArray();

  const otherPortfolios = otherPhotographersDocs.flatMap((p) => p.portfolio);

  return (
    <PortfolioClient 
      photographer={serializedPhotographer} 
      otherPortfolios={otherPortfolios} 
    />
  );
}
