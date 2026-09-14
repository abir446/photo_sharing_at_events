import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import QRCode from "qrcode";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  try {
    const userDoc = await getCurrentUser();

    if (!userDoc) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = {
      id: userDoc.userId as string,
      email: userDoc.email as string,
      name: userDoc.name as string
    };

    const formData = await request.formData();
    const eventName = formData.get("eventName") as string;
    const eventDate = formData.get("eventDate") as string;
    const paymentId = formData.get("paymentId") as string;
    const planId = formData.get("planId") as string;
    const planName = formData.get("planName") as string;
    const planStorage = formData.get("planStorage") as string;
    const planPrice = formData.get("planPrice") as string;

    const isAdmin = userDoc.role === "admin";
    const effectivePaymentId = paymentId || (isAdmin ? "admin_test_free" : "");

    if (!eventName || !eventDate || !effectivePaymentId || !planId) {
      return NextResponse.json(
        { success: false, error: "Event details, selected plan, and payment confirmation are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("dropcast");

    // 1. Insert initial event details to secure a unique event ID
    const result = await db.collection("events").insertOne({
      userId: user.id,
      name: eventName,
      date: new Date(eventDate),
      createdAt: new Date(),
      createdBy: user.email,
      paymentId: effectivePaymentId,
      isAdminTest: isAdmin,
      plan: {
        id: planId,
        name: planName,
        storage: planStorage,
        price: Number(planPrice),
      },
    });

    const eventId = result.insertedId.toString();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const uploadUrl = `${baseUrl}/event/${eventId}/upload`;

    try {
      // 2. Generate the QR code as a Base64 Data URL
      const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 600, // Higher width for sharp Cloudinary storage
      });

      // 3. Upload the Base64 string directly to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
        folder: "dropcast_qrcodes",
        public_id: `qr_${eventId}`, // Gives the file a clean, predictable name
        overwrite: true,
      });

      // 4. Update the MongoDB document with the Cloudinary image URL
      await db.collection("events").updateOne(
        { _id: result.insertedId },
        { 
          $set: { 
            qrCodeUrl: uploadResponse.secure_url, // This is your Cloudinary https link
            uploadUrl: uploadUrl 
          } 
        }
      );
    } catch (error) {
      console.error("Failed to generate or upload QR code:", error);
      return NextResponse.json({ success: false, error: "Failed to generate or upload QR code" }, { status: 500 });
    }

    return NextResponse.json({ success: true, eventId });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
