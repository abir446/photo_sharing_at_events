// app/dashboard/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import EventCard from '@/components/EventCard';
import { redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb";
import { MongoEvent } from '@/utils/typescript/types';
import Link from 'next/link';
import {
  CalendarDaysIcon,
  StarIcon,
  ImagesIcon,
  PlusIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ZapIcon
} from 'lucide-react';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
    redirect('/api/auth/login');
  }

  const user = await getUser();
  if (!user || !user.id) {
    redirect('/api/auth/login');
  }

  const client = await clientPromise;
  const db = client.db("dropcast");
  
  const events = await db
    .collection<MongoEvent>("events")
    .find({ userId: user.id })
    .sort({_id: -1})
    .toArray();

  // Query real-time total guest uploads for this host's events
  const eventIds = events.map((e) => e._id.toString());
  let totalMediaCount = 0;
  if (eventIds.length > 0) {
    totalMediaCount = await db.collection("media").countDocuments({ eventId: { $in: eventIds } });
  }

  const stats = [
    { label: 'Events created', value: String(events.length), icon: CalendarDaysIcon },
    { label: 'Saved creators', value: '14', icon: StarIcon },
    { label: 'Guest uploads', value: totalMediaCount.toLocaleString(), icon: ImagesIcon }
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-8 py-10">
      
      {/* Header section with stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/5">
        <div>
          <p className="text-sm font-medium text-brand-400">Welcome back, {user.given_name || "Host"}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            Plan every moment of your event
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-400">
            Create shared photo galleries, generate custom guest QR codes, and collect every single memory in one place.
          </p>
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

      {/* Grid of Events */}
      <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        
        {/* Create New Event CTA card */}
        <div className="flex flex-col rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-7 hover:border-brand-500/40 hover:bg-white/[0.04] transition-all duration-300 items-center justify-center text-center group min-h-[300px] h-full">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform duration-300">
            <PlusIcon className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Create New Event</h2>
          <p className="mt-2 text-sm text-slate-400 max-w-[240px] leading-relaxed">
            Set up a live photo sharing space and generate a QR code for your guests instantly.
          </p>
          <Link 
            href="/dashboard/create" 
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-brand-600 transition-colors"
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Existing Event Cards */}
        {events.map((event) => (
          <EventCard 
            key={event._id.toString()}          
            name={event.name}                  
            date={event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            eId={event._id.toString()} 
            qrCodeUrl={event.qrCodeUrl || ""}
          />
        ))}
      </div>

      {/* Assurance banner */}
      <section
        aria-labelledby="assurance-heading"
        className="mt-16 grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:grid-cols-3"
      >
        <h2 id="assurance-heading" className="sr-only">
          Why hosts choose DropCast
        </h2>
        {[
          {
            icon: ShieldCheckIcon,
            title: 'Secure cloud backups',
            copy: 'Every memory uploaded is safely stored in optimized Cloudinary storage.'
          },
          {
            icon: ZapIcon,
            title: 'No guest sign-ups',
            copy: 'Instant uploads via mobile browsers. Zero barrier to entry for guests.'
          },
          {
            icon: ImagesIcon,
            title: 'One gallery for everything',
            copy: 'Live SSE stream pushes new uploads to your dashboard gallery screen in real time.'
          }
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-4.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10">
              <Icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{copy}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}