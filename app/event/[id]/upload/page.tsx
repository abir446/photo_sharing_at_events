import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import GalleryClient from "./GalleryClient";
// import GalleryClient from "./GalleryClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface MongoEvent {
  _id: ObjectId;
  name: string;
  date: Date;
}

interface MongoMedia {
  _id: ObjectId;
  eventId: string;
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  createdAt: Date;
  state?: string;
}

export default async function GuestUploadPage({ params }: PageProps) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  // Fetch the event
  const event = await db
    .collection<MongoEvent>("events")
    .findOne({ _id: new ObjectId(id) });

  if (!event) {
    notFound();
  }

  // Fetch existing media for this event that are approved (or not hidden/flagged)
  const mediaDocs = await db
    .collection<MongoMedia>("media")
    .find({ eventId: id, state: { $ne: "hidden" } })
    .sort({ createdAt: -1 })
    .toArray();

  // Map to serializable items
  const initialMedia = mediaDocs.map((doc) => ({
    _id: doc._id.toString(),
    eventId: doc.eventId,
    url: doc.url,
    publicId: doc.publicId,
    resourceType: doc.resourceType,
    createdAt: doc.createdAt.toISOString(),
    state: doc.state || "approved",
  }));

  const formattedDate = event.date instanceof Date
    ? event.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : String(event.date);

  return (
    <GalleryClient
      eventId={id}
      eventName={event.name}
      eventDate={formattedDate}
      initialMedia={initialMedia}
    />
  );
}
