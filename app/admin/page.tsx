import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import clientPromise from "@/lib/mongodb";
import { MongoEvent } from "@/utils/typescript/types";
import AdminDashboard from "@/components/AdminDashboard";

interface KindeRole {
  key: string;
  name: string;
  id?: string;
}

export default async function AdminPage() {
  const { isAuthenticated, getRoles } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/admin");
  }
  const roles: KindeRole[] | null = await getRoles();

  console.log("User Roles in Admin Page:", roles);

  const isAdmin = roles?.some((role) => role.key === "admin");

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied</h1>
            <p className="text-slate-500 text-sm">
              You are not authorized to access the Admin Panel. If you believe this is an error, please contact your administrator.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 text-sm transition-all duration-200"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Load all events from MongoDB
  const client = await clientPromise;
  const db = client.db("dropcast");
  
  const events = await db
    .collection<MongoEvent>("events")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  const serializedEvents = events.map((event) => ({
    id: event._id.toString(),
    userId: event.userId,
    name: event.name,
    date: event.date instanceof Date ? event.date.toISOString() : String(event.date),
    qrCodeUrl: event.qrCodeUrl || "",
  }));

  return <AdminDashboard initialEvents={serializedEvents} />;
}