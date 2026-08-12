import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // Fetch approved/flagged/non-hidden media for this event
    const mediaDocs = await db
      .collection("media")
      .find({ eventId, state: { $ne: "hidden" } })
      .sort({ createdAt: -1 })
      .toArray();

    const mediaList = mediaDocs.map((doc) => ({
      _id: doc._id.toString(),
      eventId: doc.eventId,
      url: doc.url,
      publicId: doc.publicId,
      resourceType: doc.resourceType || "image",
      createdAt: doc.createdAt.toISOString(),
      state: doc.state || "approved",
    }));

    return NextResponse.json(mediaList);
  } catch (error: unknown) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
