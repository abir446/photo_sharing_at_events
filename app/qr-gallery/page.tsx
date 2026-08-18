import { getCurrentUser } from "@/lib/auth";
import { redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb";
import { MongoEvent, MediaItem } from '@/utils/typescript/types';
import QRGalleryClient from './QRGalleryClient';

export default async function Page() {
  const userDoc = await getCurrentUser();
  
  if (!userDoc) {
    redirect('/signin');
  }

  const user = {
    id: userDoc.userId as string,
    email: userDoc.email as string,
    name: userDoc.name as string
  };

  const client = await clientPromise;
  const db = client.db("dropcast");
  
  const events = await db
    .collection<MongoEvent>("events")
    .find({ userId: user.id })
    .sort({ _id: -1 })
    .toArray();

  const eventMediaMap: Record<string, MediaItem[]> = {};
  for (const event of events) {
    const eId = event._id.toString();
    const mediaDocs = await db
      .collection("media")
      .find({ eventId: eId })
      .sort({ createdAt: -1 })
      .toArray();
    
    eventMediaMap[eId] = mediaDocs.map((doc) => ({
      _id: doc._id.toString(),
      eventId: doc.eventId,
      url: doc.url,
      publicId: doc.publicId,
      resourceType: (doc.resourceType || "image") as "image" | "video",
      createdAt: doc.createdAt.toISOString(),
    }));
  }

  const serializedEvents = events.map((event) => ({
    id: event._id.toString(),
    name: event.name,
    date: event.date instanceof Date 
      ? event.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) 
      : String(event.date),
    qrCodeUrl: event.qrCodeUrl || "",
    uploadUrl: event.uploadUrl || "",
  }));

  return (
    <QRGalleryClient 
      initialEvents={serializedEvents} 
      initialMediaMap={eventMediaMap} 
    />
  );
}
