import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const users = await db
      .collection("users")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        id: u.userId,
        email: u.email,
        name: u.name,
        role: u.role || "user",
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
      })),
    });
  } catch (error: unknown) {
    console.error("Admin users GET error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (!["user", "creator", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    // Safety: prevent admin from demoting themselves
    if (userId === adminUser.userId && role !== "admin") {
      return NextResponse.json(
        { error: "Action prohibited: You cannot demote your own administrator account." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("users").updateOne(
      { userId },
      { $set: { role, roleUpdatedAt: new Date(), roleUpdatedBy: adminUser.email } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If role changed to creator, make sure photographer_emails is synced
    if (role === "creator") {
      const userDoc = await db.collection("users").findOne({ userId });
      if (userDoc?.email) {
        await db.collection("photographer_emails").updateOne(
          { email: userDoc.email },
          { $set: { email: userDoc.email, userId, registeredAt: new Date() } },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({ success: true, userId, role });
  } catch (error: unknown) {
    console.error("Admin users PATCH error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update user role";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    // Safety: prevent admin from deleting themselves
    if (userId === adminUser.userId) {
      return NextResponse.json(
        { error: "Action prohibited: You cannot delete your own account while signed in." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // Remove user and their active sessions
    await db.collection("users").deleteOne({ userId });
    await db.collection("sessions").deleteMany({ userId });

    return NextResponse.json({ success: true, deletedUserId: userId });
  } catch (error: unknown) {
    console.error("Admin users DELETE error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
