"use server";

import clientPromise from "@/lib/mongodb";
import { uploadEvents } from "@/lib/emitter";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMedia(eventId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
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
          };

          const insertResult = await db.collection("media").insertOne(mediaItem);
          const completeItem = {
            ...mediaItem,
            _id: insertResult.insertedId.toString(),
          };

          // Emit the event to all active Server-Sent Event (SSE) clients
          uploadEvents.emit("upload", { eventId, mediaItem: completeItem });

          resolve(completeItem);
        } catch (dbError: unknown) {
          console.error("Database save error:", dbError);
          const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
          reject(new Error("Failed to save upload info to database: " + errorMessage));
        }
      }
    );

    uploadStream.end(buffer);
  });
}
