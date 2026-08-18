import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userDoc = await getCurrentUser();

    if (!userDoc) {
      return NextResponse.json({ isPhotographer: false });
    }

    const user = {
      id: userDoc.userId as string,
      email: userDoc.email as string,
      name: userDoc.name as string
    };

    const client = await clientPromise;
    const db = client.db("dropcast");

    // 0. Check user role selection in users collection
    const userDocDb = await db.collection("users").findOne({ userId: user.id });
    if (userDocDb) {
      return NextResponse.json({ isPhotographer: userDocDb.role === "creator" });
    }

    // 1. Check if email is in noted photographer_emails
    const notedEmail = await db
      .collection("photographer_emails")
      .findOne({ email: user.email });

    if (notedEmail) {
      return NextResponse.json({ isPhotographer: true });
    }

    // 2. Check if a photographer profile exists in DB
    const photographerProfile = await db
      .collection("photographers")
      .findOne({ $or: [{ email: user.email }, { userId: user.id }] });

    if (photographerProfile) {
      // Note the email since profile exists
      await db.collection("photographer_emails").updateOne(
        { email: user.email },
        { $set: { email: user.email, userId: user.id, registeredAt: new Date() } },
        { upsert: true }
      );
      return NextResponse.json({ isPhotographer: true });
    }

    return NextResponse.json({ isPhotographer: false });
  } catch (error) {
    console.error("Error in photographer check route:", error);
    return NextResponse.json({ isPhotographer: false });
  }
}
