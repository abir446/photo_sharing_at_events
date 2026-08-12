import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isAuthenticated, getRoles } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const roles = await getRoles();
    const isAdmin = roles?.some((role: { key: string }) => role.key === "admin");
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid event ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isAuthenticated, getRoles } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const roles = await getRoles();
    const isAdmin = roles?.some((role: { key: string }) => role.key === "admin");
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid event ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { name, date } = body;

    if (!name || !date) {
      return NextResponse.json({ success: false, error: "Name and date are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          name, 
          date: new Date(date) 
        } 
      }
    );

    if (result.modifiedCount === 0) {
      // It might be that the event was found but the values didn't change, 
      // or the event was not found. Let's check if it exists.
      const exists = await db.collection("events").findOne({ _id: new ObjectId(id) });
      if (!exists) {
        return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error updating event:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
