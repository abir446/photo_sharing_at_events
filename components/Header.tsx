import React from 'react'
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";



const Header = () => {
  return (
    <nav className="bg-gray-800 p-4 flex">
      <div className="container mx-auto">
        <h1 className="text-white text-xl font-bold">My App</h1>
      </div>
      <div className="flex space-x-4 text-xl text-white">
        <LoginLink>Sign in</LoginLink>
        <RegisterLink>Sign up</RegisterLink>
        <LogoutLink>Sign out</LogoutLink>
      </div>
    </nav>
  )
}

export default Header
