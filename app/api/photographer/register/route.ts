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
      name,
      location,
      styles,
      startingPrice,
      responseTime,
      accent,
      paymentId
    } = body;

    if (!name || !location || !styles || !startingPrice || !paymentId) {
      return NextResponse.json({ error: "Missing required profile registration parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // Generate unique custom photographer slug/id
    const creatorId = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    // Extract initials
    const initials = name
      .split(/\s+/)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const photographerProfile = {
      id: creatorId,
      name,
      initials,
      accent: accent || "#6366f1",
      location,
      rating: 5.0,
      reviews: 0,
      startingPrice: Number(startingPrice),
      styles: Array.isArray(styles) ? styles : [styles],
      portfolio: [
        "/33c39f57-d46e-4f25-addf-129ca2506ae8.jpg",
        "/ca35071e-ec2d-4a7b-bd13-f26939f90801.jpg"
      ],
      verified: true,
      responseTime: responseTime || "Usually responds in 1 hour",
      subscribed: true,
      userId: user.id,
      email: user.email,
      paymentId,
      createdAt: new Date()
    };

    // Update if already exists by userId, otherwise insert
    await db.collection("photographers").updateOne(
      { userId: user.id },
      { $set: photographerProfile },
      { upsert: true }
    );

    // Note the email in photographer_emails collection
    await db.collection("photographer_emails").updateOne(
      { email: user.email },
      { $set: { email: user.email, userId: user.id, registeredAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, creatorId });
  } catch (error: unknown) {
    console.error("Creator registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
