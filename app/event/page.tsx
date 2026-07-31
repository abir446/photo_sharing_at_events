import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from 'next/navigation'

const page = async () => {
    const { isAuthenticated, getUser, getPermissions, getClaim } = getKindeServerSession()

    if (!isAuthenticated()) {
    redirect("/api/auth/login?post_login_redirect_url=/event")
  }
  const user = await getUser();
  const r = await getClaim("roles")
  console.log(r);
  const userPermissions = (await getPermissions())?.permissions;
  console.log(userPermissions);
  return (
    <div>
      Authenticated Users only
      <div className="">
        <h1 className="text-4xl font-bold">Welcome {user?.given_name}</h1>
      </div>
    </div>
  )
}

export default page
