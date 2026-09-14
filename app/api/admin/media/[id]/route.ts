import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid media ID format" }, { status: 400 });
    }

    const { state } = await request.json();
    if (!["approved", "flagged", "hidden"].includes(state)) {
      return NextResponse.json({ error: "Invalid state. Must be 'approved', 'flagged', or 'hidden'" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("media").updateOne(
      { _id: new ObjectId(id) },
      { $set: { state, moderatedAt: new Date(), moderatedBy: adminUser.email } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, state });
  } catch (error: unknown) {
    console.error("Admin media PATCH error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update media status";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid media ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("media").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    console.error("Admin media DELETE error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete media item";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
