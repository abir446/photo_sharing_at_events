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
}

export default function RegisterClient({ defaultName, defaultEmail }: RegisterClientProps) {
  const [name, setName] = useState(defaultName);
  const [location, setLocation] = useState('');
  const [startingPrice, setStartingPrice] = useState('1200');
  const [responseTime, setResponseTime] = useState('Usually responds in 1 hour');
  const [accent, setAccent] = useState('#6366f1');
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([]);
  
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
      // 1. Create order on the server-side via Razorpay API (INR 4999.00 -> 499900 paisa)
      const orderResponse = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 499900 })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to establish Razorpay order.');
      }

      const orderData = await orderResponse.json();

      // 2. Configure and open Razorpay modal checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'DropCast Pro Creator',
        description: 'Annual Marketplace Listing Fee',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Payment success callback - submit details to database
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
                paymentId: response.razorpay_payment_id
              })
            });

            if (!registerResponse.ok) {
              const errTxt = await registerResponse.text();
              throw new Error(errTxt || 'Verification registration request failed.');
            }

            const regData = await registerResponse.json();
            // Redirect user to their portfolio page
            window.location.href = `/photographer/${regData.creatorId}`;
          } catch (verifyErr) {
            console.error('Verify error:', verifyErr);
            setError('Payment was successful, but saving your registration failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: name,
          email: defaultEmail
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    setError('');
    if (!name.trim()) return setError('Please enter your brand/display name.');
    if (!location.trim()) return setError('Please specify your operational location.');
    if (selectedStyles.length === 0) {
      return setError('Please select at least one aesthetic style.');
    }

    setLoading(true);

    try {
      const response = await fetch('/api/photographer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          styles: selectedStyles,
          startingPrice: Number(startingPrice),
          responseTime,
          accent,
          paymentId: 'mock_pay_success_' + Math.random().toString(36).substring(2, 9)
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      window.location.href = `/photographer/${data.creatorId}`;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to simulate profile registration.');
      setLoading(false);
    }
  };

  const handleSimulateFailure = () => {
    setError('Payment failed (Simulated). Insufficient funds or checkout cancelled.');
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
          <SparklesIcon className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          List Your Creator Business
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Pay our annual listing fee and stand out to premium hosts searching for event coverage.
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
                Starting Rate ($)
              </label>
              <input
                type="number"
                id="startingPrice"
                required
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. 1200"
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
          <div className="flex items-center justify-between rounded-xl bg-brand-500/10 p-4 border border-brand-500/20 text-sm">
            <span className="text-slate-300 font-medium">Annual Subscription Fee</span>
            <span className="text-white font-extrabold text-lg">INR 4,999.00</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-4 font-semibold text-white shadow-glow transition-all hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Initializing Razorpay secure checkout...
              </>
            ) : (
              <>
                <CreditCardIcon className="h-4 w-4" />
                Pay Annual Fee &amp; Publish Listing
              </>
            )}
          </button>
        </div>
      </form>

      {/* Developer Test Controls */}
      <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.01] p-6 text-center backdrop-blur-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          🔧 Developer Test Controls
        </p>
        <p className="mt-1.5 text-xs text-slate-400">
          Bypass the Razorpay checkout overlay to test successful database persistence or failure UI screens.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSimulateSuccess}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simulate Payment Success
          </button>
          <button
            type="button"
            onClick={handleSimulateFailure}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simulate Payment Failure
          </button>
        </div>
      </div>
    </main>
  );
}
