import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }
    
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error in api/auth/me:", error);
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
