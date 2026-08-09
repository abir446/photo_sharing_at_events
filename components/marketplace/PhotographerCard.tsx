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
};

export function PhotographerCard({ photographer }: Props) {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const count = photographer.portfolio.length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors hover:border-brand-500/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
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
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900/90 to-transparent" />

        <span className="absolute left-3 top-3 rounded-lg border border-white/15 bg-ink-900/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          From ${photographer.startingPrice.toLocaleString()}
        </span>

        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove' : 'Save'} ${photographer.name}`}
          className="absolute right-3 top-3 rounded-lg border border-white/15 bg-ink-900/75 p-1.5 text-slate-200 backdrop-blur-md transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
        >
          <HeartIcon
            className={`h-4 w-4 ${saved ? 'fill-brand-500 text-brand-500' : ''}`}
            aria-hidden="true"
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="rounded-full border border-white/15 bg-ink-900/70 p-1.5 text-white opacity-0 backdrop-blur-md transition-opacity hover:bg-ink-900 focus:opacity-100 group-hover:opacity-100 cursor-pointer"
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
                  i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="rounded-full border border-white/15 bg-ink-900/70 p-1.5 text-white opacity-0 backdrop-blur-md transition-opacity hover:bg-ink-900 focus:opacity-100 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: photographer.accent }}
            aria-hidden="true"
          >
            {photographer.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[15px] font-semibold text-white">
                {photographer.name}
              </h3>
              {photographer.verified && (
                <BadgeCheckIcon
                  className="h-4 w-4 shrink-0 text-brand-400"
                  aria-label="Verified creator"
                />
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {photographer.location}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <StarIcon
              className="h-4 w-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="font-semibold text-white">
              {photographer.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">
              ({photographer.reviews})
            </span>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {photographer.styles.map((style) => (
            <li
              key={style}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300"
            >
              {style}
            </li>
          ))}
        </ul>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {photographer.responseTime}
        </p>

        <Link
          href={`/photographer/${photographer.id}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          View Portfolio &amp; Book
        </Link>
      </div>
    </article>
  );
}
