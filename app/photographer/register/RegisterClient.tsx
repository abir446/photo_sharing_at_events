"use client";

import React, { useState, useEffect } from 'react';
import { CameraIcon, CheckIcon, CreditCardIcon, Loader2Icon, SparklesIcon } from 'lucide-react';
import type { StyleTag } from '@/data/photographers';

const AVAILABLE_STYLES: StyleTag[] = [
  'Cinematic',
  'Candid',
  'Wedding',
  'Drone',
  'Editorial'
];

interface RegisterClientProps {
  defaultName: string;
  defaultEmail: string;
  existingProfile?: {
    name: string;
    location: string;
    startingPrice: number;
    styles: string[];
    responseTime: string;
    accent: string;
  } | null;
}

export default function RegisterClient({ defaultName, defaultEmail, existingProfile }: RegisterClientProps) {
  const [name, setName] = useState(existingProfile?.name || defaultName);
  const [location, setLocation] = useState(existingProfile?.location || '');
  const [startingPrice, setStartingPrice] = useState(
    existingProfile ? String(existingProfile.startingPrice) : '99600'
  );
  const [responseTime, setResponseTime] = useState(
    existingProfile?.responseTime || 'Usually responds in 1 hour'
  );
  const [accent, setAccent] = useState(existingProfile?.accent || '#6366f1');
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>(
    (existingProfile?.styles as StyleTag[]) || []
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dynamically load Razorpay checkout script on client mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleStyleToggle = (style: StyleTag) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handlePayAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your brand/display name.');
    if (!location.trim()) return setError('Please specify your operational location.');
    if (!startingPrice || isNaN(Number(startingPrice)) || Number(startingPrice) <= 0) {
      return setError('Please enter a valid starting price.');
    }
    if (selectedStyles.length === 0) {
      return setError('Please select at least one aesthetic style styleTag.');
    }

    setLoading(true);

    try {
      const registerResponse = await fetch('/api/photographer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          styles: selectedStyles,
          startingPrice: Number(startingPrice),
          responseTime,
          accent,
          paymentId: 'free_listing_' + Math.random().toString(36).substring(2, 9)
        })
      });

      if (!registerResponse.ok) {
        const errTxt = await registerResponse.text();
        throw new Error(errTxt || 'Verification registration request failed.');
      }

      const regData = await registerResponse.json();
      // Redirect user to their portfolio page
      window.location.href = `/photographer/${regData.creatorId}`;
    } catch (err: unknown) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };



  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
          <SparklesIcon className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {existingProfile ? 'Edit Your Listing Profile' : 'List Your Creator Business'}
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          {existingProfile 
            ? 'Update your operational details, aesthetic styles, starting rate, and options.'
            : 'List your business and stand out to premium hosts searching for event coverage.'}
        </p>
      </header>

      <form onSubmit={handlePayAndRegister} className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        {error && (
          <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Creator / Brand Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mara Oswin Photography"
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Operational Location
            </label>
            <input
              type="text"
              id="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Seattle, WA"
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startingPrice" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Starting Rate (₹)
              </label>
              <input
                type="number"
                id="startingPrice"
                required
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. 99600"
                className="mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label htmlFor="responseTime" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Average Response Time
              </label>
              <input
                type="text"
                id="responseTime"
                required
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                placeholder="e.g. Usually responds in 1 hour"
                className="mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="accent" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Accent Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                id="accent"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent"
              />
              <input
                type="text"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Aesthetic Styles (Select all that apply)
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {AVAILABLE_STYLES.map((style) => {
                const selected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStyleToggle(style)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'border-brand-500 bg-brand-500/10 text-white'
                        : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/25'
                    }`}
                  >
                    {selected && <CheckIcon className="h-3 w-3" />}
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-4 font-semibold text-white shadow-glow transition-all hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Publishing Listing Profile...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Publish Listing Profile
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
