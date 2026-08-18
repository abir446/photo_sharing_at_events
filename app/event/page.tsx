import React from 'react'
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth"
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "My Event",
  description: "View your event details and manage guest uploads.",
  robots: { index: false },
};

const page = async () => {
  const userDoc = await getCurrentUser();

  if (!userDoc) {
    redirect("/signin");
  }

  return (
    <div>
      Authenticated Users only
      <div className="">
        <h1 className="text-4xl font-bold">Welcome {userDoc.name.split(" ")[0]}</h1>
      </div>
    </div>
  )
}

export default page
