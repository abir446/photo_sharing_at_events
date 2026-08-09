import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb";
import { MongoEvent } from '@/utils/typescript/types';
import QRGalleryClient from './QRGalleryClient';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
    redirect('/api/auth/login');
  }

  const user = await getUser();
  if (!user || !user.id) {
    redirect('/api/auth/login');
  }

  const client = await clientPromise;
  const db = client.db("dropcast");
  
  const events = await db
    .collection<MongoEvent>("events")
    .find({ userId: user.id })
    .sort({ _id: -1 })
    .toArray();

  const eventMediaMap: Record<string, any[]> = {};
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
      resourceType: doc.resourceType || "image",
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
