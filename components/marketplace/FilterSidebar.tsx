import React from 'react';
import { CheckIcon, MapPinIcon, RotateCcwIcon, SearchIcon } from 'lucide-react';
import { RangeSlider } from '../RangeSlider';
import { LOCATIONS, STYLE_TAGS, type StyleTag } from '@/data/photographers';

type Props = {
  location: string;
  onLocationChange: (value: string) => void;
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
    <section className="border-t border-[#E5E2C4] px-5 py-5 first:border-t-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-550">
        {title}
      </h3>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export function FilterSidebar({
  location,
  onLocationChange,
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E2C4]">
          <h2 className="text-sm font-semibold text-zinc-900">Filters</h2>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CF6DFC] cursor-pointer"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      )}

      <Section title="Location">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            type="search"
            list="evermore-locations"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="City or region"
            aria-label="Search location"
            className="w-full rounded-xl border border-[#E5E2C4] bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-450 focus:border-[#CF6DFC] focus:outline-none focus:ring-1 focus:ring-[#CF6DFC]"
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
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-semibold text-zinc-700 transition-colors hover:border-[#CF6DFC]/40 hover:text-[#B250DF] cursor-pointer"
            >
              <MapPinIcon className="h-3 w-3" aria-hidden="true" />
              {city}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Style tags">
        <ul className="space-y-1">
          {STYLE_TAGS.map((style) => {
            const checked = selectedStyles.includes(style);
            return (
              <li key={style}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50">
                  <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleStyle(style)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#CF6DFC] ${
                        checked
                          ? 'border-[#CF6DFC] bg-[#CF6DFC]'
                          : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {checked && (
                        <CheckIcon className="h-3 w-3 text-white" strokeWidth={3} />
                      )}
                    </span>
                  </span>
                  <span
                    className={`text-sm ${
                      checked ? 'font-semibold text-zinc-900' : 'text-zinc-650'
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
          <span className="rounded-lg border border-[#E5E2C4] bg-[#FAF9F5] px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-sm">
            ₹{budget[0].toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500 font-medium">to</span>
          <span className="rounded-lg border border-[#E5E2C4] bg-[#FAF9F5] px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-sm">
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
