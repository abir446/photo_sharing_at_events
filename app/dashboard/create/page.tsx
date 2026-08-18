import { getCurrentUser } from "@/lib/auth";
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
    />
  );
}