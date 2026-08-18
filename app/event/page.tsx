import React from 'react'
import { getCurrentUser } from "@/lib/auth"
import { redirect } from 'next/navigation'

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
