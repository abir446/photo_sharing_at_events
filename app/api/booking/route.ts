import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const userDoc = await getCurrentUser();

    if (!userDoc) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = {
      id: userDoc.userId as string,
      email: userDoc.email as string,
      name: userDoc.name as string
    };

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

    if (!photographerId || !photographerName || !packagePrice) {
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

    // Validate event date
    const bookingDate = eventDetails?.date;
    if (!bookingDate) {
      return NextResponse.json(
        { error: "Booking date is required." },
        { status: 400 }
      );
    }

    // Check if the photographer is already booked on this date (accepted or confirmed)
    const existingConflict = await db.collection("bookings").findOne({
      photographerId,
      "eventDetails.date": bookingDate,
      status: { $in: ["accepted", "confirmed"] }
    });

    if (existingConflict) {
      return NextResponse.json(
        { error: "This photographer is already booked on the selected date." },
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
      paymentId: paymentId || null,
      eventDetails: {
        date: eventDetails?.date || "Sat, Oct 18, 2026",
        location: eventDetails?.location || "Laurel Hall",
        coverage: eventDetails?.coverage || "6 hours · 2pm–8pm",
        packageName: eventDetails?.packageName || "Signature Event Coverage",
      },
      status: "pending",
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
