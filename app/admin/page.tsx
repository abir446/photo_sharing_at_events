// app/admin/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const { isAuthenticated, getRoles } = getKindeServerSession();

  // 1. Check if authenticated
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  // 2. Fetch roles assigned to this user
  const roles = await getRoles();
  const isAdmin = roles?.some((role) => role.key === "admin");
  console.log("User Roles:", roles);

  if (!isAdmin) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome back, Admin!</p>
    </main>
  );
}