"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  CameraIcon,
  ClockIcon,
  MapPinIcon,
  MessageSquareIcon,
  StarIcon,
  XIcon
} from 'lucide-react';
import type { Photographer } from '@/data/photographers';
import { User } from '@/utils/typescript/types';

interface PortfolioClientProps {
  photographer: Photographer;
  otherPortfolios: string[];
  date?: string;
}

export default function PortfolioClient({ photographer, otherPortfolios, date }: PortfolioClientProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setUser(data.user);
        }
      });
  }, []);

  const isOwner = photographer.userId && user && photographer.userId === user.id;
  const isCreator = user && user.role === "creator";

  // Blend photographer's own portfolio with sample other shots for high density
  const samples = [
    ...photographer.portfolio,
    ...otherPortfolios.slice(0, 6)
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to marketplace
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-6 rounded-2xl border border-indigo-150/80 bg-white p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-xs"
            style={{ backgroundColor: photographer.accent }}
            aria-hidden="true"
          >
            {photographer.initials}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {photographer.name}
              </h1>
              {photographer.verified && (
                <BadgeCheckIcon
                  className="h-5 w-5 text-indigo-700 dark:text-brand-400"
                  aria-label="Verified creator"
                />
              )}
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <StarIcon
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {photographer.rating.toFixed(1)} · {photographer.reviews} reviews
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                {photographer.location}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                {photographer.responseTime}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isOwner && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:shadow-none"
            >
              <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
              Message
            </button>
          )}
          {isOwner ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-950 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400">
              <CameraIcon className="h-4 w-4 shrink-0 text-indigo-700 dark:text-brand-400" aria-hidden="true" />
              Your Creator Listing
            </span>
          ) : isCreator ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-150/80 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              Creator Account
            </span>
          ) : (
            <Link
              href={`/booking/${photographer.id}${date ? `?date=${date}` : ''}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold !text-white text-white shadow-md transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <span className="!text-white text-white font-bold" style={{ color: '#ffffff' }}>Book from ₹{photographer.startingPrice.toLocaleString()}</span>
            </Link>
          )}
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {photographer.styles.map((style) => (
          <span
            key={style}
            className="rounded-lg border border-indigo-150/80 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none"
          >
            {style}
          </span>
        ))}
      </div>

      <section className="mt-8" aria-labelledby="collection-heading">
        <div className="flex items-center gap-2">
          <CameraIcon className="h-4 w-4 text-indigo-700 dark:text-brand-400" aria-hidden="true" />
          <h2 id="collection-heading" className="text-sm font-bold text-slate-900 dark:text-white">
            Sample collection · {samples.length} photos
          </h2>
        </div>
        <div className="mt-4 columns-1 sm:columns-2 md:columns-3 gap-5">
          {samples.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setLightbox(src)}
              className="mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-indigo-150/80 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer dark:border-white/10 dark:shadow-none"
            >
              <img
                src={src}
                alt={`${photographer.name} sample ${i + 1}`}
                className="w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-10 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setLightbox(null)}
            className="absolute right-8 top-8 rounded-xl border border-white/15 bg-white/10 p-2 text-white transition-colors hover:bg-white/20 cursor-pointer"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <img
            src={lightbox}
            alt="Enlarged portfolio sample"
            className="max-h-full max-w-4xl rounded-2xl object-contain"
          />
        </div>
      )}
    </main>
  );
}
