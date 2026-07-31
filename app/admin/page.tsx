import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface KindeRole {
  key: string;
  name: string;
  id?: string;
}

const AdminPage = async () => {
  const { isAuthenticated, getRoles, getOrganization } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/admin");
  }
  const roles: KindeRole[] | null = await getRoles();

  console.log("User Roles:", roles);

  const isAdmin = roles?.some((role) => role.key === "admin");

  if (isAdmin) {
    return <div>AdminPage</div>;
  }

  return <div>Access Denied | You are not authorized to access this page</div>;
};

export default AdminPage;