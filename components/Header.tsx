"use client"
import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { showToast } from "nextjs-toast-notify";
import { User } from "@/utils/typescript/types";
import {
  SparklesIcon,
  ChevronDownIcon,
  LogOutIcon,
  PlusIcon,
  CalendarIcon,
  InfoIcon,
  MenuIcon,
  XIcon,
  ImageIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const pathname = usePathname();
  const [auth, setAuth] = useState<{ isAuthenticated: boolean; user: User | null; isLoading: boolean }>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPhotographer, setIsPhotographer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = auth.user;
  const initials = user?.name
    ? user.name.split(/\s+/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DC";
  const roleName = isAdmin ? "Administrator" : isPhotographer ? "Photographer" : "Event Host";
  const fullName = user?.name || roleName;
  const isAuthenticated = auth.isAuthenticated;
  const isLoading = auth.isLoading;

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    setIsOpen(false);
    window.location.href = "/api/auth/signout";
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setAuth({
          isAuthenticated: data.isAuthenticated,
          user: data.user,
          isLoading: false
        });
        setIsPhotographer(data.isAuthenticated && data.user?.role === "creator");
        setIsAdmin(data.isAuthenticated && data.user?.role === "admin");
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        setAuth({ isAuthenticated: false, user: null, isLoading: false });
      });
  }, [pathname]);

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


  // Navigation Links
  const links = [
    ...(isAdmin ? [{ label: 'Admin Portal', to: '/admin', icon: ShieldCheckIcon }] : []),
    ...(!isPhotographer && !isAdmin ? [{ label: 'Marketplace', to: '/marketplace', icon: SparklesIcon }] : []),
    ...(isAuthenticated ? (
      isAdmin ? [
        { label: 'QR Gallery', to: '/qr-gallery', icon: ImageIcon },
        { label: 'Marketplace', to: '/marketplace', icon: SparklesIcon },
        { label: 'My Events', to: '/dashboard', icon: CalendarIcon }
      ] : isPhotographer ? [
        { label: 'Dashboard', to: '/dashboard', icon: CalendarIcon },
        { label: 'QR Gallery', to: '/qr-gallery', icon: ImageIcon }
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
      <header className="sticky top-0 z-50 w-full border-b border-indigo-100/60 bg-[#f4f2fd]/85 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
            <Image
              src="/logo.svg"
              alt="DropCast logo"
              width={36}
              height={36}
              className="rounded-xl"
              priority
            />
            <span>DropCast</span>
          </div>
          <div className="animate-pulse flex space-x-6 items-center">
            <div className="h-4 w-20 bg-slate-300/40 dark:bg-white/10 rounded-md"></div>
            <div className="h-4 w-20 bg-slate-300/40 dark:bg-white/10 rounded-md"></div>
            <div className="h-8 w-24 bg-slate-300/40 dark:bg-white/10 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-100/70 bg-[#f4f2fd]/85 backdrop-blur-md transition-all duration-300 dark:border-zinc-900 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        
        {/* Left Logo and Menu */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.svg"
              alt="DropCast logo"
              width={36}
              height={36}
              className="rounded-xl group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
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
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    active ?
                    'bg-indigo-100/80 border border-indigo-200/90 text-indigo-900 shadow-xs dark:bg-brand-500/20 dark:border-brand-500/30 dark:text-brand-300 font-bold' :
                    'text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section Profile / Login & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2.5 rounded-xl border border-indigo-100/80 bg-white/90 py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:shadow-none"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {fullName}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-zinc-400">
                    {roleName}
                  </span>
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-slate-500 dark:text-zinc-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-indigo-100 bg-white/95 backdrop-blur-md p-1.5 shadow-xl z-50 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-indigo-900 dark:text-brand-300 bg-indigo-100/70 border border-indigo-200/80 transition-colors hover:bg-indigo-100 dark:bg-brand-500/15 dark:border-transparent font-bold mb-1"
                    >
                      <ShieldCheckIcon className="h-4 w-4 text-indigo-700 dark:text-brand-400" />
                      Admin Portal
                    </Link>
                  )}
                  {isPhotographer ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                    >
                      <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                      >
                        <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                        My Events
                      </Link>
                      <Link
                        href="/dashboard/create"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                      >
                        <PlusIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                        New Event
                      </Link>
                    </>
                  )}
                  <div className="my-1.5 h-px bg-slate-200/80 dark:bg-zinc-900" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/25 cursor-pointer text-left font-medium"
                  >
                    <LogOutIcon className="h-4 w-4 text-rose-500 dark:text-rose-400" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/signin" className="text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white font-medium text-sm transition-colors py-2 px-3 focus:outline-none cursor-pointer">
                Sign in
              </Link>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle button with ThemeToggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-indigo-150/80 bg-white/80 text-slate-700 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-ink-950/98 border-t border-indigo-100 dark:border-white/5 px-6 py-4 flex flex-col space-y-3 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="pb-1">
            <ThemeToggle variant="row" />
          </div>
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
                  'bg-indigo-100/80 border border-indigo-200/90 text-indigo-900 dark:border-brand-500/30 dark:bg-brand-500/20 dark:text-white font-bold' :
                  'text-slate-600 hover:bg-indigo-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-indigo-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}

          <div className="my-1.5 h-px bg-slate-200/80 dark:bg-white/5" />

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-4 py-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {fullName}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {user?.email || roleName}
                  </span>
                </span>
              </div>
              <div className="border-t border-slate-200/80 dark:border-white/5 pt-2">
                <button
                  onClick={handleSignOut}
                  className="flex justify-center w-full px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400 font-semibold hover:bg-rose-500/20 text-center transition-colors text-sm cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/5">
              <Link href="/signin" className="flex justify-center w-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-semibold text-sm py-2.5 text-center transition-colors cursor-pointer">
                Sign in
              </Link>
              <Link href="/signup" className="flex justify-center w-full px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-center shadow-md transition-all duration-200 text-sm cursor-pointer">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header


