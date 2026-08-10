import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from 'next/link';
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import clientPromise from "@/lib/mongodb";
import { MongoEvent } from '@/utils/typescript/types';
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CameraIcon,
  ImagesIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StarIcon,
  ZapIcon
} from 'lucide-react';

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  eyebrowIcon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  meta: string[];
  isAuth: boolean;
}

function FeatureCard({
  image,
  imageAlt,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  cta,
  href,
  meta,
  isAuth
}: FeatureCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl transition-colors hover:border-brand-500/40 h-full">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-900/70 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md">
          <EyebrowIcon className="h-3.5 w-3.5 text-brand-400" />
          {eyebrow}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-slate-400">
          {subtitle}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {meta.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          {isAuth || href === "/marketplace" ? (
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              {cta}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <LoginLink
              postLoginRedirectURL={href}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
            >
              {cta}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </LoginLink>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const auth = await isAuthenticated();
  const user = auth ? await getUser() : null;

  let eventCount = 0;
  let uploadCount = 0;

  if (auth && user?.id) {
    try {
      const client = await clientPromise;
      const db = client.db("dropcast");
      const events = await db
        .collection<MongoEvent>("events")
        .find({ userId: user.id })
        .toArray();
      
      eventCount = events.length;

      const eventIds = events.map((e) => e._id.toString());
      if (eventIds.length > 0) {
        uploadCount = await db.collection("media").countDocuments({ eventId: { $in: eventIds } });
      }
    } catch (e) {
      console.error("Failed to query mongo stats for root page", e);
    }
  }

  const stats = auth ? [
    { label: 'Upcoming events', value: String(eventCount), icon: CalendarDaysIcon },
    { label: 'Saved creators', value: '14', icon: StarIcon },
    { label: 'Guest uploads', value: uploadCount.toLocaleString(), icon: ImagesIcon }
  ] : [
    { label: 'Vetted creators', value: '320+', icon: StarIcon },
    { label: 'Rating average', value: '4.9', icon: CalendarDaysIcon },
    { label: 'Photos captured', value: '52,400+', icon: ImagesIcon }
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      
      {/* Welcome / Intro */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div>
          {auth ? (
            <p className="text-sm font-medium text-brand-400">Welcome back, {user?.given_name || "Host"}</p>
          ) : (
            <p className="text-sm font-medium text-brand-400">Welcome to DropCast</p>
          )}
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white leading-tight">
            Plan every moment of your event
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-400 leading-relaxed">
            Book vetted professional creators and collect every guest photo in one shared, secure gallery automatically.
          </p>
          
          {!auth && (
            <div className="mt-5 flex items-center gap-3">
              <LoginLink className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors cursor-pointer">
                Sign in
              </LoginLink>
              <RegisterLink className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors cursor-pointer">
                Get started
              </RegisterLink>
            </div>
          )}
        </div>

        <dl className="flex flex-wrap gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="min-w-[150px] rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl"
            >
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Icon className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 text-2xl font-bold text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Hero cards */}
      <div className="mt-9 grid grid-cols-1 gap-7 lg:grid-cols-2">
        <FeatureCard
          image="/33c39f57-d46e-4f25-addf-129ca2506ae8.jpg"
          imageAlt="Professional photographer capturing an evening reception"
          eyebrow="Photographer Marketplace"
          eyebrowIcon={CameraIcon}
          title="Hire Professional Creators"
          subtitle="Browse local photographers by budget, location, and aesthetic style."
          cta="Browse Marketplace"
          href="/marketplace"
          meta={['320+ vetted creators', 'Milestone payments', 'Verified reviews']}
          isAuth={!!auth}
        />
        
        <FeatureCard
          image="/ca35071e-ec2d-4a7b-bd13-f26939f90801.jpg"
          imageAlt="QR code stand on a table at an evening event"
          eyebrow="Guest QR Upload"
          eyebrowIcon={QrCodeIcon}
          title="Set Up Guest QR Gallery"
          subtitle="Instant live photo sharing for your event guests."
          cta="Launch QR Service"
          href="/dashboard"
          meta={['No app required', 'Live moderation', 'Unlimited guests']}
          isAuth={!!auth}
        />
      </div>

      {/* Assurance banner */}
      <section
        aria-labelledby="assurance-heading"
        className="mt-9 grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl md:grid-cols-3"
      >
        <h2 id="assurance-heading" className="sr-only">
          Why hosts choose DropCast
        </h2>
        {[
          {
            icon: ShieldCheckIcon,
            title: 'Escrow-backed payments',
            copy: 'Funds release only as each milestone is completed.'
          },
          {
            icon: ZapIcon,
            title: 'Fast creator matching',
            copy: 'Shortlists tailored to your date, budget, and style.'
          },
          {
            icon: ImagesIcon,
            title: 'One gallery for everything',
            copy: 'Pro deliverables and guest uploads live side by side.'
          }
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10">
              <Icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{copy}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Creator Registration Section */}
      <section className="mt-9 rounded-3xl border border-brand-500/20 bg-brand-500/5 p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-400">
            <CameraIcon className="h-3.5 w-3.5" />
            For Professional Creators
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Are you an event photographer?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            List your business on DropCast to reach premium hosts, manage milestones, and secure payments in escrow.
          </p>
        </div>
        <Link
          href="/photographer/register"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
        >
          Join as Creator
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
