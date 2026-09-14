import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create New Event",
  description: "Set up a new event photo sharing space and generate QR codes for your guests.",
  robots: { index: false },
};
import { redirect } from "next/navigation";
import CreateEventForm from "@/components/CreateEventForm";

export default async function CreateEventPage() {
  const userDoc = await getCurrentUser();
  
  if (!userDoc) {
    redirect("/signin");
  }

  const defaultName = userDoc.name;
  const user = { email: userDoc.email };

  return (
    <CreateEventForm 
      defaultName={defaultName}
      defaultEmail={user.email} 
      isAdmin={userDoc.role === "admin"}
    />
  );
}