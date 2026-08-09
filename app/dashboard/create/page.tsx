import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import CreateEventForm from "@/components/CreateEventForm";

export default async function CreateEventPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login?post_login_redirect_url=/dashboard/create");
  }

  const user = await getUser();
  if (!user || !user.email) {
    redirect("/api/auth/login?post_login_redirect_url=/dashboard/create");
  }

  const defaultName = user.given_name ? `${user.given_name} ${user.family_name || ""}`.trim() : "";

  return (
    <CreateEventForm 
      defaultName={defaultName}
      defaultEmail={user.email} 
    />
  );
}