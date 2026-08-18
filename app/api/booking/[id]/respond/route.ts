import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userDoc = await getCurrentUser();

    if (!userDoc) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = {
      id: userDoc.userId as string,
      email: userDoc.email as string,
      name: userDoc.name as string
    };

    const { action } = await request.json();
    if (action !== "accept" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action. Must be 'accept' or 'reject'" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // 1. Find the booking
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. Find the photographer profile for current user
    const photographer = await db
      .collection("photographers")
      .findOne({ $or: [{ email: user.email }, { userId: user.id }] });

    if (!photographer) {
      return NextResponse.json({ error: "Photographer profile not found for this user" }, { status: 403 });
    }

    // 3. Ensure the photographer is indeed the owner of the booking
    if (booking.photographerId !== photographer.id) {
      return NextResponse.json({ error: "Unauthorized. You can only respond to bookings made for your profile." }, { status: 403 });
    }

    // 4. Update status
    const status = action === "accept" ? "accepted" : "rejected";
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, respondedAt: new Date() } }
    );

    return NextResponse.json({ success: true, status });
  } catch (error: unknown) {
    console.error("Booking respond error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
