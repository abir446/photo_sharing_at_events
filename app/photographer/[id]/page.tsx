import type { Metadata, ResolvingMetadata } from "next";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import PortfolioClient from "./PortfolioClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("dropcast");
  const photographer = await db
    .collection("photographers")
    .findOne({ id: id });

  if (!photographer) {
    return {
      title: "Photographer Not Found",
    };
  }

  const styles = (photographer.styles as string[])?.join(", ") || "Professional";
  const title = `${photographer.name} — Event Photographer in ${photographer.location}`;
  const description = `Book ${photographer.name}, a ${styles.toLowerCase()} photographer in ${photographer.location}. Rated ${photographer.rating}★ from ${photographer.reviews} reviews. Starting at ₹${photographer.startingPrice?.toLocaleString()}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://dropcast.app/photographer/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://dropcast.app/photographer/${id}`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { date } = await searchParams;

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
      date={date}
    />
  );
}
