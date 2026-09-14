import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword, createSession, isAdminEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Auto-promote if email is in ADMIN_EMAILS
    if (isAdminEmail(user.email) && user.role !== "admin") {
      await db.collection("users").updateOne(
        { userId: user.userId },
        { $set: { role: "admin" } }
      );
    }

    // Set cookie session
    await createSession(user.userId);

    return NextResponse.json({ success: true, role: isAdminEmail(user.email) ? "admin" : user.role });
  } catch (error: unknown) {
    console.error("Signin API error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
