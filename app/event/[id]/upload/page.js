import { notFound } from "next/navigation";
import GalleryClient from "./GalleryClient";

export default async function GuestUploadPage({ params }) {
  const { id } = await params;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch the event
  const eventRes = await fetch(`${backendUrl}/api/events/${id}`, {
    cache: "no-store",
  });

  if (eventRes.status === 404 || eventRes.status === 400) {
    notFound();
  }

  if (!eventRes.ok) {
    throw new Error("Failed to fetch event from backend");
  }

  const event = await eventRes.json();

  // Fetch existing media for this event
  const mediaRes = await fetch(`${backendUrl}/api/events/${id}/media`, {
    cache: "no-store",
  });

  if (!mediaRes.ok) {
    throw new Error("Failed to fetch media from backend");
  }

  const initialMedia = await mediaRes.json();

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <GalleryClient
      eventId={id}
      eventName={event.name}
      eventDate={formattedDate}
      initialMedia={initialMedia}
    />
  );
}
