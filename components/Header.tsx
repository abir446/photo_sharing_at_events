"use client"
import React from 'react'
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from 'next/link';

const Header = () => {
  
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  
  if (isLoading) return <div className="bg-gray-800 p-4 text-white">Loading...</div>;

  return (
    <nav className="bg-gray-800 p-4 flex">
      <div className="container mx-auto">
        <Link className='text-white text-xl font-bold' href="/">DropCast</Link>
      </div>
      <div className="flex space-x-4 text-xl text-white">
        {isAuthenticated ? (
          <div className='flex space-x-4'> 
            <Link href="/dashboard/create">
              <span className='hover:text-gray-300'>New Event </span>
            </Link>
            <Link href="/dashboard">
              <span className='hover:text-gray-300'>My Events </span>
            </Link> 
            <LogoutLink  className='hover:text-gray-300' postLogoutRedirectURL='http://localhost:3000/'>Sign out</LogoutLink>
          </div>
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