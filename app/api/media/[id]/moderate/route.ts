import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { uploadEvents } from "@/lib/emitter";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mediaId } = await params;
    const { state } = await request.json();

    if (!["approved", "hidden", "flagged"].includes(state)) {
      return NextResponse.json({ error: "Invalid status state value" }, { status: 400 });
    }

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (!ObjectId.isValid(mediaId)) {
      return NextResponse.json({ error: "Invalid media ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // 1. Fetch the media item
    const mediaItem = await db.collection("media").findOne({ _id: new ObjectId(mediaId) });
    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // 2. Fetch the corresponding event
    const event = await db.collection("events").findOne({ _id: new ObjectId(mediaItem.eventId) });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 3. Securely verify that the user is the creator of the event
    if (event.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized access: You are not the host of this event" }, { status: 403 });
    }

    // 4. Update the photo state in the database
    await db.collection("media").updateOne(
      { _id: new ObjectId(mediaId) },
      { $set: { state } }
    );

    // 5. Emit real-time sse message to let guest upload feeds sync the change
    uploadEvents.emit("upload", { 
      eventId: mediaItem.eventId, 
      mediaItem: { 
        _id: mediaId,
        eventId: mediaItem.eventId,
        url: mediaItem.url,
        publicId: mediaItem.publicId,
        resourceType: mediaItem.resourceType,
        createdAt: mediaItem.createdAt.toISOString ? mediaItem.createdAt.toISOString() : String(mediaItem.createdAt),
        state 
      } 
    });

    return NextResponse.json({ success: true, state });
  } catch (error: unknown) {
    console.error("Moderation error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
