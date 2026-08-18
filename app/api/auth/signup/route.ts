import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role !== "creator" && role !== "user") {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const userId = "usr_" + Math.random().toString(36).substring(2, 11);
    const hashedPassword = hashPassword(password);

    const newUser = {
      userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    // If role is creator, sync with photographer_emails
    if (role === "creator") {
      await db.collection("photographer_emails").updateOne(
        { email: newUser.email },
        { $set: { email: newUser.email, userId, registeredAt: new Date() } },
        { upsert: true }
      );
    }

    // Set cookie session
    await createSession(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
