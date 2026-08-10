import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const {
      photographerId,
      photographerName,
      packagePrice,
      addOns,
      totalAmount,
      dueToday,
      paymentId,
      eventDetails,
    } = body;

    if (!photographerId || !photographerName || !packagePrice || !paymentId) {
      return NextResponse.json(
        { error: "Missing required parameters for booking" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // Validate that the host is not booking themselves
    const photographer = await db.collection("photographers").findOne({ id: photographerId });
    if (photographer && photographer.userId === user.id) {
      return NextResponse.json(
        { error: "Self-booking restriction: You cannot book your own photographer profile." },
        { status: 400 }
      );
    }

    const newBooking = {
      userId: user.id,
      userEmail: user.email,
      photographerId,
      photographerName,
      packagePrice: Number(packagePrice),
      addOns: Array.isArray(addOns) ? addOns : [],
      totalAmount: Number(totalAmount),
      dueToday: Number(dueToday),
      paymentId,
      eventDetails: {
        date: eventDetails?.date || "Sat, Oct 18, 2026",
        location: eventDetails?.location || "Laurel Hall",
        coverage: eventDetails?.coverage || "6 hours · 2pm–8pm",
        packageName: eventDetails?.packageName || "Signature Event Coverage",
      },
      status: "confirmed",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json({
      success: true,
      bookingId: result.insertedId.toString(),
    });
  } catch (error: unknown) {
    console.error("Booking api error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
