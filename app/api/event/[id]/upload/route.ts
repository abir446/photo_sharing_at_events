import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const completeItem = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `dropcast_events/${eventId}`,
          resource_type: "auto",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new Error("Cloudinary upload failed: " + error.message));
          }
          if (!result) {
            return reject(new Error("Cloudinary upload returned empty result"));
          }

          try {
            const client = await clientPromise;
            const db = client.db("dropcast");

            const mediaItem = {
              eventId,
              url: result.secure_url,
              publicId: result.public_id,
              resourceType: result.resource_type as "image" | "video",
              createdAt: new Date(),
              state: "pending",
            };

            const insertResult = await db.collection("media").insertOne(mediaItem);
            const itemWithId = {
              ...mediaItem,
              _id: insertResult.insertedId.toString(),
            };

            resolve(itemWithId);
          } catch (dbError: unknown) {
            console.error("Database save error:", dbError);
            const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
            reject(new Error("Failed to save upload info to database: " + errorMessage));
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json(completeItem);
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
