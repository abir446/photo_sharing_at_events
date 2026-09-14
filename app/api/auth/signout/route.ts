import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Signout error:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await destroySession();
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/`);
  } catch (error) {
    console.error("Signout GET error:", error);
    return NextResponse.redirect("http://localhost:3000/");
  }
}
