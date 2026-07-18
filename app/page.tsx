// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
// import { redirect } from "next/navigation"

export default function Home() {
  // const { isAuthenticated } = await getKindeServerSession()
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">DropCast</h1>
      <p className="text-xs">Share your photos with ease</p>
    </div>
  );
}
