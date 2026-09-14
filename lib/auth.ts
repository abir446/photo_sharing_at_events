import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "dropcast_salt_123!").digest("hex");
}

interface SessionDoc {
  _id: string;
  userId: string;
  expiresAt: Date;
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  const adminList = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminList.includes(email.trim().toLowerCase());
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("dropcast_session")?.value;
    if (!token) return null;

    const client = await clientPromise;
    const db = client.db("dropcast");

    // Find active session
    const session = await db.collection<SessionDoc>("sessions").findOne({
      _id: token,
      expiresAt: { $gt: new Date() }
    });

    if (!session) return null;

    // Find user
    const user = await db.collection("users").findOne({ userId: session.userId });
    if (!user) return null;

    // Auto-promote if user's email is in ADMIN_EMAILS list
    if (isAdminEmail(user.email) && user.role !== "admin") {
      await db.collection("users").updateOne(
        { userId: user.userId },
        { $set: { role: "admin" } }
      );
      user.role = "admin";
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const client = await clientPromise;
  const db = client.db("dropcast");

  await db.collection<SessionDoc>("sessions").insertOne({
    _id: token,
    userId,
    expiresAt
  });

  const cookieStore = await cookies();
  cookieStore.set("dropcast_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });

  return token;
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("dropcast_session")?.value;
    if (token) {
      const client = await clientPromise;
      const db = client.db("dropcast");
      await db.collection<SessionDoc>("sessions").deleteOne({ _id: token });
    }
  } catch (error) {
    console.error("Error destroying session:", error);
  }
  
  try {
    const cookieStore = await cookies();
    cookieStore.delete("dropcast_session");
  } catch (err) {
    // Ignore context errors in non-request handlers
  }
}
