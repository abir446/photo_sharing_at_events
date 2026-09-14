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
      return NextResponse.json({ error: "Invalid booking ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { status, paymentId, totalAmount, dueToday, eventDate, location } = body;

    const updateFields: Record<string, unknown> = {};
    if (status) updateFields.status = status;
    if (paymentId !== undefined) updateFields.paymentId = paymentId;
    if (totalAmount !== undefined) updateFields.totalAmount = Number(totalAmount);
    if (dueToday !== undefined) updateFields.dueToday = Number(dueToday);
    if (eventDate) updateFields["eventDetails.date"] = eventDate;
    if (location) updateFields["eventDetails.location"] = location;
    updateFields.updatedAt = new Date();
    updateFields.updatedBy = adminUser.email;

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedFields: updateFields });
  } catch (error: unknown) {
    console.error("Admin booking PATCH error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update booking";
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
      return NextResponse.json({ error: "Invalid booking ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    console.error("Admin booking DELETE error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete booking";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
