"use client";

import React from "react";
import { RangeSlider as MantineRangeSlider } from "@mantine/core";

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
  label,
}: RangeSliderProps) {
  return (
    <div className="py-2.5">
      <MantineRangeSlider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(val) => onChange(val as [number, number])}
        color="brand"
        label={(val) => `₹${val.toLocaleString()}`}
        classNames={{
          track: "before:bg-transparent",
          thumb: "active:cursor-grabbing active:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
        }}
        styles={{
          root: {
            paddingTop: "4px",
            paddingBottom: "4px",
          },
          track: {
            backgroundColor: "var(--theme-border, #e2e0f8)",
            height: "6px",
            borderRadius: "9999px",
          },
          bar: {
            backgroundColor: "var(--color-brand-500, #6366f1)",
            height: "6px",
          },
          thumb: {
            backgroundColor: "#ffffff",
            border: "2px solid var(--color-brand-500, #6366f1)",
            height: "16px",
            width: "16px",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.4)",
            transition: "transform 150ms ease, border-color 150ms ease",
            cursor: "grab",
          },
          label: {
            backgroundColor: "#1e1b4b",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 600,
            borderRadius: "6px",
            padding: "3px 6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          },
        }}
      />
    </div>
  );
}
