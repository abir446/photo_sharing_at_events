"use server";

import clientPromise from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  const eventName = formData.get("eventName") as string;
  const eventDate = formData.get("eventDate") as string;

  if (!eventName || !eventDate) {
    throw new Error("Event name and date are required");
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  const result = await db.collection("events").insertOne({
    userId: user.id,
    name: eventName,
    date: new Date(eventDate),
    createdAt: new Date(), 
    createdBy: user.email,
  });
  console.log("MongoDB connection established and event inserted successfully.");
  console.log(`New event created with the following id: ${result.insertedId}`);
  redirect("/dashboard");

}