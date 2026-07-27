"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function createEvent(formData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return { success: false, error: "User not authenticated" };
    }

    const eventName = formData.get("eventName");
    const eventDate = formData.get("eventDate");

    if (!eventName || !eventDate) {
      return { success: false, error: "Event name and date are required" };
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendUrl}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        eventDate,
        userId: user.id,
        userEmail: user.email,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return { success: false, error: errData.error || "Failed to create event on backend" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating event:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}
