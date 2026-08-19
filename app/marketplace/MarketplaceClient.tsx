"use client";

import React, { useMemo, useState } from 'react';
import { CameraOffIcon, ChevronDownIcon, SlidersHorizontalIcon } from 'lucide-react';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { PhotographerCard } from '@/components/marketplace/PhotographerCard';
import type { Photographer, StyleTag } from '@/data/photographers';
import { Drawer, ScrollArea } from '@mantine/core';

const SORTS = ['Recommended', 'Top rated', 'Price: low to high', 'Most reviews'];

import { useEffect } from 'react';

interface BookedDate {
  photographerId: string;
  date: string;
}

interface MarketplaceClientProps {
  initialPhotographers: Photographer[];
  bookedDates?: BookedDate[];
}

export default function MarketplaceClient({ initialPhotographers, bookedDates = [] }: MarketplaceClientProps) {
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([]);
  const [budget, setBudget] = useState<[number, number]>([40000, 400000]);
  const [sort, setSort] = useState(SORTS[0]);
  const [drawerOpened, setDrawerOpened] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const dateParam = searchParams.get('date');
      if (dateParam) {
        setSelectedDate(dateParam);
      }
    }
  }, []);

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
      const matchesDate =
        !selectedDate ||
        !bookedDates.some(
          (b) => b.photographerId === p.id && b.date === selectedDate
        );
      return matchesLocation && matchesStyle && matchesBudget && matchesDate;
    });

    const sorted = [...filtered];
    if (sort === 'Top rated') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'Price: low to high')
      sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === 'Most reviews') sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [initialPhotographers, location, selectedStyles, budget, sort, selectedDate, bookedDates]);

  const toggleStyle = (style: StyleTag) =>
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );

  const reset = () => {
    setLocation('');
    setSelectedStyles([]);
    setBudget([40000, 400000]);
    setSelectedDate('');
  };

  const avgRating = (
    initialPhotographers.reduce((sum, p) => sum + p.rating, 0) / (initialPhotographers.length || 1)
  ).toFixed(1);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 py-6 sm:py-10">
      {/* Mobile/Tablet responsive header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Event Photographer
          </h1>
          <p className="mt-2.5 sm:mt-3 max-w-xl text-sm sm:text-[15px] text-zinc-400 leading-relaxed">
            Compare vetted creators near you, then lock in your date with a
            milestone-based deposit.
          </p>
        </div>
        <div className="w-full lg:w-auto">
          {/* Responsive stats counter table */}
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm w-full shadow-sm">
            {[
              { label: 'Creators available', value: `${initialPhotographers.length}` },
              { label: 'Avg. rating', value: initialPhotographers.length > 0 ? avgRating : '0.0' },
              { label: 'Median starting price', value: '₹1,22,425' }
            ].map(({ label, value }) => (
              <div key={label} className="px-5 py-3 sm:px-6 sm:py-4 text-center sm:text-left">
                <dt className="text-[10px] sm:text-xs font-semibold text-zinc-450 uppercase tracking-wider">{label}</dt>
                <dd className="mt-1 text-lg sm:text-xl font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Main layout container with desktop sidebar and responsive results */}
      <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row items-start gap-7">
        {/* Desktop filter sidebar container */}
        <aside 
          className="hidden lg:block sticky top-24 w-[280px] shrink-0 self-start overflow-hidden rounded-2xl border border-zinc-850 bg-zinc-900/50 shadow-sm"
          aria-label="Desktop filters"
        >
          <FilterSidebar
            location={location}
            onLocationChange={setLocation}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedStyles={selectedStyles}
            onToggleStyle={toggleStyle}
            budget={budget}
            onBudgetChange={setBudget}
            onReset={reset}
          />
        </aside>

        {/* Results layout section */}
        <section className="min-w-0 flex-1 w-full" aria-label="Photographer results">
          {/* Responsive search filter toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm p-4 sm:px-5 sm:py-3.5 shadow-sm">
            <p className="flex items-center gap-2 text-sm text-zinc-350">
              <SlidersHorizontalIcon
                className="h-4 w-4 text-brand-400"
                aria-hidden="true"
              />
              <span className="font-bold text-white">{results.length}</span>
              creators match your filters
            </p>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setDrawerOpened(true)}
                className="lg:hidden inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <SlidersHorizontalIcon className="h-4 w-4 text-brand-400" />
                Filters
              </button>
              
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                Sort by
                <span className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-3 pr-8 text-sm font-medium text-white focus:border-brand-500 focus:outline-none cursor-pointer"
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
          </div>

          {/* Cards Grid */}
          {results.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((photographer) => (
                <PhotographerCard
                  key={photographer.id}
                  photographer={photographer}
                  selectedDate={selectedDate}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-8 py-20 text-center shadow-sm">
              <CameraOffIcon
                className="h-8 w-8 text-zinc-500"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-lg font-bold text-white">
                No creators match these filters
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-zinc-450">
                Try widening your budget range or clearing a style tag to see more
                photographers.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mantine Drawer for Mobile & Tablet Filters */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Filters"
        position="right"
        size="320px"
        scrollAreaComponent={ScrollArea.Autosize}
        styles={{
          content: {
            backgroundColor: "#09090b",
            color: "#ffffff",
            borderLeft: "1px solid #27272a",
          },
          header: {
            backgroundColor: "#09090b",
            color: "#ffffff",
            borderBottom: "1px solid #27272a",
            padding: "16px 20px",
          },
          title: {
            fontSize: "16px",
            fontWeight: 700,
          },
          close: {
            color: "#a1a1aa",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#ffffff",
            },
          },
          body: {
            padding: "0px",
          },
        }}
      >
        <div className="pb-10">
          <FilterSidebar
            location={location}
            onLocationChange={setLocation}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedStyles={selectedStyles}
            onToggleStyle={toggleStyle}
            budget={budget}
            onBudgetChange={setBudget}
            onReset={() => {
              reset();
              setDrawerOpened(false);
            }}
            showTitleBar={false}
          />
        </div>
      </Drawer>
    </main>
  );
}
