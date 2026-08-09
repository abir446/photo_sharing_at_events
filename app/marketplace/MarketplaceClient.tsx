"use client";

import React, { useMemo, useState } from 'react';
import { CameraOffIcon, ChevronDownIcon, SlidersHorizontalIcon } from 'lucide-react';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { PhotographerCard } from '@/components/marketplace/PhotographerCard';
import type { Photographer, StyleTag } from '@/data/photographers';
import Link from 'next/link';

const SORTS = ['Recommended', 'Top rated', 'Price: low to high', 'Most reviews'];

interface MarketplaceClientProps {
  initialPhotographers: Photographer[];
}

export default function MarketplaceClient({ initialPhotographers }: MarketplaceClientProps) {
  const [location, setLocation] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([]);
  const [budget, setBudget] = useState<[number, number]>([500, 5000]);
  const [sort, setSort] = useState(SORTS[0]);

  const results = useMemo(() => {
    const filtered = initialPhotographers.filter((p) => {
      const matchesLocation =
        !location.trim() ||
        p.location.toLowerCase().includes(location.trim().toLowerCase());
      const matchesStyle =
        selectedStyles.length === 0 ||
        selectedStyles.some((s) => p.styles.includes(s));
      const matchesBudget =
        p.startingPrice >= budget[0] && p.startingPrice <= budget[1];
      return matchesLocation && matchesStyle && matchesBudget;
    });

    const sorted = [...filtered];
    if (sort === 'Top rated') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'Price: low to high')
      sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === 'Most reviews') sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [initialPhotographers, location, selectedStyles, budget, sort]);

  const toggleStyle = (style: StyleTag) =>
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );

  const reset = () => {
    setLocation('');
    setSelectedStyles([]);
    setBudget([500, 5000]);
  };

  const avgRating = (
    initialPhotographers.reduce((sum, p) => sum + p.rating, 0) / (initialPhotographers.length || 1)
  ).toFixed(1);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Find Your Event Photographer
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-400">
            Compare vetted creators near you, then lock in your date with a
            milestone-based deposit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <dl className="flex divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
            {[
              { label: 'Creators available', value: `${initialPhotographers.length}` },
              { label: 'Avg. rating', value: initialPhotographers.length > 0 ? avgRating : '0.0' },
              { label: 'Median starting price', value: '$1,475' }
            ].map(({ label, value }) => (
              <div key={label} className="px-6 py-4">
                <dt className="text-xs font-medium text-slate-400">{label}</dt>
                <dd className="mt-1 text-xl font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/photographer/register"
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 px-6 py-4 font-semibold text-white text-sm shadow-glow transition-colors cursor-pointer self-stretch text-center"
          >
            List as Creator
          </Link>
        </div>
      </header>

      <div className="mt-8 flex flex-col lg:flex-row items-start gap-7">
        <FilterSidebar
          location={location}
          onLocationChange={setLocation}
          selectedStyles={selectedStyles}
          onToggleStyle={toggleStyle}
          budget={budget}
          onBudgetChange={setBudget}
          onReset={reset}
        />

        <section className="min-w-0 flex-1 w-full" aria-label="Photographer results">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <SlidersHorizontalIcon
                className="h-4 w-4 text-brand-400"
                aria-hidden="true"
              />
              <span className="font-semibold text-white">{results.length}</span>
              creators match your filters
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              Sort by
              <span className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-lg border border-white/10 bg-ink-950/60 py-1.5 pl-3 pr-8 text-sm font-medium text-white focus:border-brand-500 focus:outline-none"
                >
                  {SORTS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
              </span>
            </label>
          </div>

          {results.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((photographer) => (
                <PhotographerCard
                  key={photographer.id}
                  photographer={photographer}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
              <CameraOffIcon
                className="h-8 w-8 text-slate-600"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-lg font-semibold text-white">
                No creators match these filters
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-slate-400">
                Try widening your budget range or clearing a style tag to see more
                photographers.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
