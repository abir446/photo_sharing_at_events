import React, { useState } from 'react';
import Link from 'next/link';
import {
  BadgeCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon
} from 'lucide-react';
import type { Photographer } from '@/data/photographers';

type Props = {
  photographer: Photographer;
  selectedDate?: string;
};

export function PhotographerCard({ photographer, selectedDate }: Props) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const count = photographer.portfolio.length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-indigo-150/80 bg-white shadow-xs transition-all duration-200 hover:border-brand-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-zinc-950">
        {photographer.portfolio.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${photographer.name} portfolio sample ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/20" />

        <span className="absolute left-3 top-3 rounded-lg border border-white/40 bg-white/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-slate-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-200">
          From ₹{photographer.startingPrice.toLocaleString()}
        </span>

        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove' : 'Save'} ${photographer.name}`}
          className="absolute right-3 top-3 rounded-lg border border-white/40 bg-white/90 backdrop-blur-md p-1.5 text-slate-600 transition-colors hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400 dark:hover:text-brand-400"
        >
          <HeartIcon
            className={`h-4 w-4 ${saved ? 'fill-brand-500 text-brand-500 dark:fill-brand-400 dark:text-brand-400' : ''}`}
            aria-hidden="true"
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="rounded-full border border-white/40 bg-white/90 p-1.5 text-slate-700 opacity-0 transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100 cursor-pointer shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex gap-1.5">
            {photographer.portfolio.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === index ? 'w-5 bg-brand-500' : 'w-1.5 bg-white/70 dark:bg-zinc-700'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="rounded-full border border-white/40 bg-white/90 p-1.5 text-slate-700 opacity-0 transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100 cursor-pointer shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-xs"
            style={{ backgroundColor: photographer.accent }}
            aria-hidden="true"
          >
            {photographer.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white">
                {photographer.name}
              </h3>
              {photographer.verified && (
                <BadgeCheckIcon
                  className="h-4 w-4 shrink-0 text-brand-500 dark:text-brand-400"
                  aria-label="Verified creator"
                />
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-450">
              <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {photographer.location}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <StarIcon
              className="h-4 w-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="font-semibold text-slate-900 dark:text-white">
              {photographer.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              ({photographer.reviews})
            </span>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {photographer.styles.map((style) => (
            <li
              key={style}
              className="rounded-md border border-indigo-150/80 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400"
            >
              {style}
            </li>
          ))}
        </ul>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-450">
          <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {photographer.responseTime}
        </p>

        <Link
          href={`/photographer/${photographer.id}${selectedDate ? `?date=${selectedDate}` : ''}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
        >
          <span className="text-white font-bold">View Portfolio &amp; Book</span>
        </Link>
      </div>
    </article>
  );
}
