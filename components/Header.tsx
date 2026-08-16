"use client"
import React, { useState, useEffect, useRef } from 'react'
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { showToast } from "nextjs-toast-notify";
import {
  SparklesIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
  PlusIcon,
  CalendarIcon,
  InfoIcon,
  MenuIcon,
  XIcon,
  ImageIcon
} from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPhotographer, setIsPhotographer] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetch("/api/photographer/check")
        .then((res) => res.json())
        .then((data) => {
          if (data.isPhotographer) {
            setIsPhotographer(true);
          }
        })
        .catch((err) => console.error("Error checking photographer status:", err));
    } else {
      setIsPhotographer(false);
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    if (isLoading) return;

    const prevAuth = localStorage.getItem("last_auth_state");
    if (prevAuth === "false" && isAuthenticated) {
      showToast.success("Logged in successfully!", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
      });
    } else if (prevAuth === "true" && !isAuthenticated) {
      showToast.success("Logged out successfully!", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
      });
    }

    localStorage.setItem("last_auth_state", isAuthenticated ? "true" : "false");
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = ((user?.given_name?.[0] || "") + (user?.family_name?.[0] || "")).toUpperCase() || "DC";
  const defaultFullName = isPhotographer ? "Photographer" : "Event Host";
  const fullName = user?.given_name ? `${user.given_name} ${user.family_name || ""}`.trim() : defaultFullName;
  const roleName = isPhotographer ? "Photographer" : "Event Host";

  // Navigation Links
  const links = [
    { label: 'Marketplace', to: '/marketplace', icon: SparklesIcon },
    ...(isAuthenticated ? (
      isPhotographer ? [
        { label: 'Dashboard', to: '/dashboard', icon: CalendarIcon }
      ] : [
        { label: 'QR Gallery', to: '/qr-gallery', icon: ImageIcon },
        { label: 'Bookings', to: '/booking', icon: CalendarIcon },
        { label: 'My Events', to: '/dashboard', icon: CalendarIcon }
      ]
    ) : []),
    { label: 'About', to: '/about', icon: InfoIcon }
  ];

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 animate-pulse">
              <SparklesIcon className="h-5 w-5 text-white" />
            </span>
            <span>DropCast</span>
          </div>
          <div className="animate-pulse flex space-x-6">
            <div className="h-5 w-20 bg-slate-800 rounded"></div>
            <div className="h-5 w-20 bg-slate-800 rounded"></div>
            <div className="h-8 w-20 bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-ink-900/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        
        {/* Left Logo and Menu */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <SparklesIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              DropCast
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    active ?
                    'bg-white/10 text-white' :
                    'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section Profile / Login */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-white">
                    {fullName}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {roleName}
                  </span>
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-800/95 p-1.5 shadow-2xl backdrop-blur-xl z-50"
                >
                  {isPhotographer ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <CalendarIcon className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        My Events
                      </Link>
                      <Link
                        href="/dashboard/create"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <PlusIcon className="h-4 w-4 text-slate-400" />
                        New Event
                      </Link>
                    </>
                  )}
                  <div className="my-1.5 h-px bg-white/10" />
                  <LogoutLink
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-500/10 cursor-pointer"
                    postLogoutRedirectURL="/"
                  >
                    <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </LogoutLink>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <LoginLink className="text-slate-300 hover:text-white font-medium text-sm transition-colors py-2 px-3 focus:outline-none cursor-pointer">
                Sign in
              </LoginLink>
              <RegisterLink className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer">
                Sign up
              </RegisterLink>
            </div>
          )}
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-ink-950/98 border-t border-white/5 px-6 py-4 flex flex-col space-y-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
          {links.map((link) => {
            const active = pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ?
                  'bg-white/10 text-white' :
                  'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 text-slate-400" />
                {link.label}
              </Link>
            );
          })}

          <div className="my-1.5 h-px bg-white/5" />

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-4 py-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-white">
                    {fullName}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {user?.email || roleName}
                  </span>
                </span>
              </div>
              <div className="border-t border-white/5 pt-2">
                <LogoutLink
                  className="flex justify-center w-full px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold hover:bg-rose-500/20 text-center transition-colors text-sm cursor-pointer"
                  postLogoutRedirectURL="/"
                >
                  Sign out
                </LogoutLink>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
              <LoginLink className="flex justify-center w-full text-slate-300 hover:text-white font-semibold text-sm py-2.5 text-center transition-colors cursor-pointer">
                Sign in
              </LoginLink>
              <RegisterLink className="flex justify-center w-full px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-center shadow-glow transition-all duration-200 text-sm cursor-pointer">
                Sign up
              </RegisterLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header

