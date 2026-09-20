import React from 'react';
import { CheckIcon, MapPinIcon, RotateCcwIcon, SearchIcon, CalendarIcon } from 'lucide-react';
import { RangeSlider } from '../RangeSlider';
import { LOCATIONS, STYLE_TAGS, type StyleTag } from '@/data/photographers';
import { getTodayDateString } from '@/utils/date';

type Props = {
  location: string;
  onLocationChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
  selectedStyles: StyleTag[];
  onToggleStyle: (style: StyleTag) => void;
  budget: [number, number];
  onBudgetChange: (value: [number, number]) => void;
  onReset: () => void;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="border-t border-indigo-100/80 px-5 py-5 first:border-t-0 dark:border-zinc-900">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
        {title}
      </h3>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export function FilterSidebar({
  location,
  onLocationChange,
  selectedDate,
  onDateChange,
  selectedStyles,
  onToggleStyle,
  budget,
  onBudgetChange,
  onReset,
  showTitleBar = true
}: Props & { showTitleBar?: boolean }) {
  return (
    <div className="flex flex-col w-full">
      {showTitleBar && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-100/80 dark:border-zinc-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Filters</h2>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      )}

      <Section title="Location">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-zinc-400"
            aria-hidden="true"
          />
          <input
            type="search"
            list="evermore-locations"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="City or region"
            aria-label="Search location"
            className="w-full rounded-xl border border-indigo-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:shadow-none"
          />
          <datalist id="evermore-locations">
            {LOCATIONS.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {LOCATIONS.slice(0, 3).map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onLocationChange(city)}
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-100/90 bg-indigo-50/60 px-2 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:border-brand-500/50 hover:text-brand-600 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-355 dark:hover:border-brand-500/40 dark:hover:text-brand-400"
            >
              <MapPinIcon className="h-3 w-3" aria-hidden="true" />
              {city}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Date of Event">
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            min={getTodayDateString()}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-xl border border-indigo-200 bg-white py-2.5 px-3.5 text-sm text-slate-900 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:[color-scheme:dark] dark:shadow-none"
          />
        </div>
      </Section>

      <Section title="Style tags">
        <ul className="space-y-1">
          {STYLE_TAGS.map((style) => {
            const checked = selectedStyles.includes(style);
            return (
              <li key={style}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-indigo-50/60 dark:hover:bg-zinc-900/50">
                  <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleStyle(style)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 ${
                        checked
                          ? 'border-brand-500 bg-brand-500'
                          : 'border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
                      }`}
                    >
                      {checked && (
                        <CheckIcon className="h-3 w-3 text-white" strokeWidth={3} />
                      )}
                    </span>
                  </span>
                  <span
                    className={`text-sm ${
                      checked
                        ? 'font-semibold text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {style}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Budget">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="rounded-lg border border-indigo-150/80 bg-indigo-50/70 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            ₹{budget[0].toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">to</span>
          <span className="rounded-lg border border-indigo-150/80 bg-indigo-50/70 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            ₹{budget[1].toLocaleString()}
            {budget[1] === 400000 ? '+' : ''}
          </span>
        </div>
        <RangeSlider
          min={40000}
          max={400000}
          step={5000}
          value={budget}
          onChange={onBudgetChange}
          label="Budget"
        />
        <p className="mt-3 text-[11px] text-slate-500">
          Based on each creator&apos;s starting package price.
        </p>
      </Section>
    </div>
  );
}
