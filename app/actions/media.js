"use server";

export async function uploadMedia(eventId, formData) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendUrl}/api/events/${eventId}/media`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Upload media action error:", error);
    throw new Error(error.message || "An unexpected error occurred during upload.");
  }
}
