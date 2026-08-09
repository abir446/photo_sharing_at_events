import React from 'react';

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label: string;
};

export function RangeSlider({
  min,
  max,
  step = 50,
  value,
  onChange,
  label
}: RangeSliderProps) {
  const [low, high] = value;
  const toPct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-500"
          style={{ left: `${toPct(low)}%`, right: `${100 - toPct(high)}%` }}
        />
        <input
          type="range"
          className="evermore-range absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"
          min={min}
          max={max}
          step={step}
          value={low}
          aria-label={`${label} minimum`}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), high - step), high])
          }
        />
        <input
          type="range"
          className="evermore-range absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label={`${label} maximum`}
          onChange={(e) =>
            onChange([low, Math.max(Number(e.target.value), low + step)])
          }
        />
      </div>
    </div>
  );
}
