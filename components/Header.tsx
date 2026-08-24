"use client"
import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image';
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
  ImageIcon,
  SunIcon,
  MoonIcon
} from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const [auth, setAuth] = useState<{ isAuthenticated: boolean; user: any; isLoading: boolean }>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPhotographer, setIsPhotographer] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isLight = !document.documentElement.classList.contains('dark');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };
  const menuRef = useRef<HTMLDivElement>(null);
  const user = auth.user;
  const initials = user?.name
    ? user.name.split(/\s+/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DC";
  const fullName = user?.name || (isPhotographer ? "Photographer" : "Event Host");
  const roleName = isPhotographer ? "Photographer" : "Event Host";
  const isAuthenticated = auth.isAuthenticated;
  const isLoading = auth.isLoading;

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
    ...(!isPhotographer ? [{ label: 'Marketplace', to: '/marketplace', icon: SparklesIcon }] : []),
    ...(isAuthenticated ? (
      isPhotographer ? [
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
      <header className="sticky top-0 z-50 w-full border-b border-ink-700 bg-ink-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
          <div className="flex items-center gap-2.5 text-zinc-900 font-bold text-lg">
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
          <div className="animate-pulse flex space-x-6">
            <div className="h-5 w-20 bg-zinc-200 rounded"></div>
            <div className="h-5 w-20 bg-zinc-200 rounded"></div>
            <div className="h-8 w-20 bg-zinc-200 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-700 bg-ink-900/80 backdrop-blur-md transition-all duration-300">
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
            <span className="text-lg font-bold tracking-tight text-zinc-900">
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
                    'bg-brand-400/15 text-brand-400' :
                    'text-zinc-600 hover:bg-brand-400/5 hover:text-zinc-900'
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
          {/* Day/Night Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-ink-700 bg-ink-800 text-zinc-900 hover:bg-ink-700/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <MoonIcon className="h-4.5 w-4.5 text-brand-600" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-800 py-1.5 pl-1.5 pr-3 text-left transition-colors hover:bg-ink-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-zinc-900">
                    {fullName}
                  </span>
                  <span className="block text-[11px] text-zinc-550">
                    {roleName}
                  </span>
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-ink-700 bg-ink-800 p-1.5 shadow-lg z-50"
                >
                  {isPhotographer ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-750 transition-colors hover:bg-brand-400/10 hover:text-zinc-900"
                    >
                      <CalendarIcon className="h-4 w-4 text-zinc-400" />
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-brand-400/10 hover:text-zinc-900"
                      >
                        <CalendarIcon className="h-4 w-4 text-zinc-400" />
                        My Events
                      </Link>
                      <Link
                        href="/dashboard/create"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-brand-400/10 hover:text-zinc-900"
                      >
                        <PlusIcon className="h-4 w-4 text-zinc-400" />
                        New Event
                      </Link>
                    </>
                  )}
                  <div className="my-1.5 h-px bg-ink-700" />
                  <a
                    href="/api/auth/signout"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-650 transition-colors hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOutIcon className="h-4 w-4 text-rose-400" aria-hidden="true" />
                    Sign out
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/signin" className="text-zinc-600 hover:text-brand-500 font-medium text-sm transition-colors py-2 px-3 focus:outline-none cursor-pointer">
                Sign in
              </Link>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle button & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-ink-700 bg-ink-800 text-zinc-900 hover:bg-ink-700/50 transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <MoonIcon className="h-4.5 w-4.5 text-brand-600" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-ink-700 bg-ink-800 text-zinc-900 hover:text-brand-500 focus:outline-none cursor-pointer"
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
                <a
                  href="/api/auth/signout"
                  className="flex justify-center w-full px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold hover:bg-rose-500/20 text-center transition-colors text-sm cursor-pointer"
                >
                  Sign out
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
              <Link href="/signin" className="flex justify-center w-full text-slate-300 hover:text-white font-semibold text-sm py-2.5 text-center transition-colors cursor-pointer">
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


