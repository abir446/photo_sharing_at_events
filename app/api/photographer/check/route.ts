import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface KindeRole {
  key: string;
  name: string;
  id?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { getUser, isAuthenticated, getRoles, getPermissions } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json({ isPhotographer: false });
    }

    const user = await getUser();
    if (!user || !user.email) {
      return NextResponse.json({ isPhotographer: false });
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

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

    // 3. Check Kinde roles & permissions
    const roles: KindeRole[] | null = await getRoles();
    const permissionsObj = await getPermissions();
    const permissions = permissionsObj?.permissions || [];

    const hasRole = roles?.some((role) => role.key === "photographer");
    const hasPermission = permissions.includes("photographer:all");

    if (hasRole || hasPermission) {
      // Note the email
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
