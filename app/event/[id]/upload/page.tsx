import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import GalleryClient from "./GalleryClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface MongoEvent {
  _id: ObjectId;
  userId?: string;
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
  state?: "approved" | "pending" | "hidden" | "flagged";
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

  // Check if current viewer is the event host or platform admin
  const userDoc = await getCurrentUser();
  const isAdmin = userDoc?.role === "admin";
  const isHost = Boolean(userDoc && event.userId && userDoc.userId === event.userId);

  // Filter media: Hosts/Admins see all non-hidden media (approved & pending).
  // Guests strictly only receive approved media.
  const filter = (isHost || isAdmin)
    ? { eventId: id, state: { $ne: "hidden" } }
    : {
        eventId: id,
        $or: [{ state: "approved" }, { state: { $exists: false } }],
      };

  const mediaDocs = await db
    .collection<MongoMedia>("media")
    .find(filter)
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
      isHost={isHost}
      isAdmin={isAdmin}
    />
  );
}
