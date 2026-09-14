import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id: creatorId } = await params;
    const body = await request.json();

    const updateFields: Record<string, unknown> = {};
    if (body.verified !== undefined) updateFields.verified = Boolean(body.verified);
    if (body.subscribed !== undefined) updateFields.subscribed = Boolean(body.subscribed);
    if (body.startingPrice !== undefined) updateFields.startingPrice = Number(body.startingPrice);
    if (body.location !== undefined) updateFields.location = body.location;
    if (body.name !== undefined) updateFields.name = body.name;
    if (body.responseTime !== undefined) updateFields.responseTime = body.responseTime;
    if (body.styles !== undefined) updateFields.styles = body.styles;

    updateFields.updatedAt = new Date();
    updateFields.updatedBy = adminUser.email;

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db
      .collection("photographers")
      .updateOne({ id: creatorId }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedFields: updateFields });
  } catch (error: unknown) {
    console.error("Admin creator PATCH error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update creator profile";
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

    const { id: creatorId } = await params;

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("photographers").deleteOne({ id: creatorId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: creatorId });
  } catch (error: unknown) {
    console.error("Admin creator DELETE error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete creator";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
