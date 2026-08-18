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

    const { paymentId } = await request.json();
    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // 1. Find the booking
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. Ensure only the booking creator can pay
    if (booking.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized. You cannot pay for someone else's booking." }, { status: 403 });
    }

    // 3. Ensure booking is accepted
    if (booking.status !== "accepted") {
      return NextResponse.json({ error: `Cannot pay for booking in '${booking.status}' status. It must be 'accepted'.` }, { status: 400 });
    }

    // 4. Update status and payment ID
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "confirmed",
          paymentId,
          paidAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Booking pay error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
