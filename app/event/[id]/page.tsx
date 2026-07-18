// app/events/[id]/page.tsx
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

// Define the shape of the page props for dynamic parameters
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  // Await the dynamic parameters route
  const { id } = await params;

  // Validate that the ID is a proper 24-character hexadecimal MongoDB ObjectId string
  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  // Fetch the individual event document by its ID
  const event = await db
    .collection("events")
    .findOne({ _id: new ObjectId(id) });

  // If no event exists with that ID, show the standard Next.js 404 page
  if (!event) {
    notFound();
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p className="text-gray-600">
        Date: {event.date instanceof Date ? event.date.toLocaleDateString() : String(event.date)}
      </p>
      <div className="border-t pt-4">
        <p className="text-sm text-gray-400">Event ID: {id}</p>
        {/* Additional event specific details go here */}
      </div>
    </div>
  );
}