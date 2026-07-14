"use client"
import React from 'react'
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const Header = () => {
  
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  
  if (isLoading) return <div className="bg-gray-800 p-4 text-white">Loading...</div>;

  return (
    <nav className="bg-gray-800 p-4 flex">
      <div className="container mx-auto">
        <h1 className="text-white text-xl font-bold">DropCast</h1>
      </div>
      <div className="flex space-x-4 text-xl text-white">
        {isAuthenticated ? (
          <LogoutLink postLogoutRedirectURL='http://localhost:3000/'>Sign out</LogoutLink>
        ) : (
          <>
            <LoginLink>Sign in</LoginLink>
            <RegisterLink>Sign up</RegisterLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Header