"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  CheckIcon,
  CloudIcon,
  ClockIcon,
  LockIcon,
  MapPinIcon,
  MessageSquareIcon,
  PackageIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StarIcon
} from 'lucide-react';
import type { Photographer } from '@/data/photographers';

type AddOn = {
  id: 'qr' | 'cloud';
  title: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
};

const ADD_ONS: AddOn[] = [
  {
    id: 'qr',
    title: 'Include Guest QR Code Photo Upload Service',
    description: 'Add live guest media collection with a branded QR stand.',
    price: 120,
    icon: QrCodeIcon
  },
  {
    id: 'cloud',
    title: 'Enable Secure Cloud Storage & Media Delivery Platform',
    description: 'Encrypted delivery, 12-month archive, and shareable links.',
    price: 60,
    icon: CloudIcon
  }
];

const MILESTONES = [
  {
    step: 1,
    percent: 20,
    title: 'Booking Deposit',
    due: 'Due now',
    detail: 'Locks your date and reserves the creator.',
    state: 'due' as const
  },
  {
    step: 2,
    percent: 50,
    title: 'Event Day Payment',
    due: 'Due on event date',
    detail: 'Auto-charged the morning of Oct 18, 2026.',
    state: 'upcoming' as const
  },
  {
    step: 3,
    percent: 30,
    title: 'Media Delivery Payment',
    due: 'Due upon final delivery release',
    detail: 'Released only after you approve the gallery.',
    state: 'upcoming' as const
  }
];

interface BookingClientProps {
  photographer: Photographer;
}

export default function BookingClient({ photographer }: BookingClientProps) {
  const [selected, setSelected] = useState<AddOn['id'][]>([]);

  const packagePrice = photographer.startingPrice;
  const addOnTotal = ADD_ONS.filter((a) => selected.includes(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );
  const dueToday = Math.round(packagePrice * 0.2) + addOnTotal;
  const total = packagePrice + addOnTotal;

  const toggle = (addOnId: AddOn['id']) =>
    setSelected((prev) =>
      prev.includes(addOnId)
        ? prev.filter((x) => x !== addOnId)
        : [...prev, addOnId]
    );

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to marketplace
      </Link>

      <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Confirm your booking
          </h1>
          <p className="mt-3 text-[15px] text-slate-400">
            Review the details, choose your add-ons, and pay only the deposit today.
          </p>
        </div>
        <ol className="flex items-center gap-3 text-xs font-medium">
          {['Details', 'Payment', 'Confirmation'].map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                  i === 1
                    ? 'border-brand-500/50 bg-brand-500/15 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    i === 0
                      ? 'bg-emerald-500 text-ink-900'
                      : i === 1
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {i === 0 ? <CheckIcon className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </span>
              {i < 2 && <span className="h-px w-4 bg-white/10" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Left column */}
        <section
          aria-label="Photographer and event details"
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
        >
          <img
            src={photographer.portfolio[0]}
            alt={`${photographer.name} portfolio sample`}
            className="h-52 w-full object-cover"
          />

          <div className="p-6">
            <div className="flex items-start gap-3.5">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: photographer.accent }}
                aria-hidden="true"
              >
                {photographer.initials}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-white">
                    {photographer.name}
                  </h2>
                  {photographer.verified && (
                    <BadgeCheckIcon
                      className="h-4 w-4 text-brand-400"
                      aria-label="Verified creator"
                    />
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-400">
                  <StarIcon
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  {photographer.rating.toFixed(1)} · {photographer.reviews} reviews
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
              >
                <MessageSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Message
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: CalendarDaysIcon,
                  label: 'Event date',
                  value: 'Sat, Oct 18, 2026'
                },
                { icon: ClockIcon, label: 'Coverage', value: '6 hours · 2pm–8pm' },
                {
                  icon: MapPinIcon,
                  label: 'Location',
                  value: 'Laurel Hall, ' + photographer.location
                },
                {
                  icon: PackageIcon,
                  label: 'Package',
                  value: 'Signature Event Coverage'
                }
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-ink-950/40 p-3.5"
                >
                  <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-white">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Service overview
              </h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  '6 hours of continuous on-site coverage',
                  '300+ professionally edited high-resolution images',
                  'Second shooter for ceremony and reception',
                  'Private online gallery delivered within 21 days'
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-slate-300">
                    <CheckIcon
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/10 bg-ink-950/40 p-3.5 text-xs leading-relaxed text-slate-400">
              <ShieldCheckIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
              Free cancellation up to 30 days before the event. All payments are
              held in escrow and released per milestone.
            </p>
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-6">
          <section
            aria-labelledby="milestones-heading"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <div className="flex items-baseline justify-between">
              <h2 id="milestones-heading" className="text-lg font-bold text-white">
                Payment schedule
              </h2>
              <span className="text-sm text-slate-400">
                Package total{' '}
                <span className="font-semibold text-white">
                  ${packagePrice.toLocaleString()}
                </span>
              </span>
            </div>

            <ol className="mt-5 space-y-3">
              {MILESTONES.map((m) => {
                const amount = Math.round((packagePrice * m.percent) / 100);
                const isDue = m.state === 'due';
                return (
                  <li
                    key={m.step}
                    className={`flex items-start gap-4 rounded-xl border p-4 ${
                      isDue
                        ? 'border-brand-500/50 bg-brand-500/10'
                        : 'border-white/10 bg-ink-950/40'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        isDue ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      {m.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {m.percent}% {m.title}
                        </h3>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            isDue ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {m.due}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{m.detail}</p>
                    </div>
                    <span className="text-base font-bold text-white">
                      ${amount.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section
            aria-labelledby="addons-heading"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <h2 id="addons-heading" className="text-lg font-bold text-white">
              Enhance your event
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Optional services billed with today&apos;s deposit.
            </p>

            <div className="mt-4 space-y-3">
              {ADD_ONS.map((addOn) => {
                const checked = selected.includes(addOn.id);
                const Icon = addOn.icon;
                return (
                  <label
                    key={addOn.id}
                    className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-colors ${
                      checked
                        ? 'border-brand-500/60 bg-brand-500/10'
                        : 'border-white/10 bg-ink-950/40 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(addOn.id)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 ${
                        checked ? 'border-brand-500 bg-brand-500' : 'border-white/25 bg-transparent'
                      }`}
                    >
                      {checked && (
                        <CheckIcon className="h-3 w-3 text-white" strokeWidth={3} />
                      )}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Icon className="h-4 w-4 text-brand-400" aria-hidden="true" />
                        {addOn.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">
                        {addOn.description}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-white">
                      +${addOn.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <section
            aria-labelledby="summary-heading"
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
          >
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Signature Event Coverage</dt>
                <dd className="font-medium text-white">
                  ${packagePrice.toLocaleString()}
                </dd>
              </div>
              {ADD_ONS.filter((a) => selected.includes(a.id)).map((a) => (
                <div key={a.id} className="flex justify-between">
                  <dt className="text-slate-400">
                    {a.id === 'qr' ? 'Guest QR upload service' : 'Cloud storage & delivery'}
                  </dt>
                  <dd className="font-medium text-white">+${a.price}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/10 pt-2.5">
                <dt className="text-slate-400">Booking total</dt>
                <dd className="font-medium text-white">
                  ${total.toLocaleString()}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-white/10 pt-5">
              <div>
                <p className="text-sm text-slate-400">Amount Due Today</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                  ${dueToday.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Remaining ${(total - dueToday).toLocaleString()} split across milestones 2 and 3.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
              >
                <LockIcon className="h-4 w-4" aria-hidden="true" />
                Proceed to Payment
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
