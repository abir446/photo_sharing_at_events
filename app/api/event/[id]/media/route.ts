import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

    const userDoc = await getCurrentUser();
    let isAuthorizedHostOrAdmin = false;

    if (userDoc) {
      if (userDoc.role === "admin") {
        isAuthorizedHostOrAdmin = true;
      } else if (ObjectId.isValid(eventId)) {
        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
        if (event && event.userId === userDoc.userId) {
          isAuthorizedHostOrAdmin = true;
        }
      }
    }

    // Filter based on authorization:
    // Host / Admin sees all active media (including pending & approved)
    // Guests only see approved media (and legacy items without state)
    const filter = isAuthorizedHostOrAdmin
      ? { eventId, state: { $ne: "hidden" } }
      : { 
          eventId, 
          $or: [
            { state: "approved" },
            { state: { $exists: false } }
          ] 
        };

    const mediaDocs = await db
      .collection("media")
      .find(filter)
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
