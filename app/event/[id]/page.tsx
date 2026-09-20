// app/events/[id]/page.tsx
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import DownloadQRButton from "@/components/DownloadQRButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  // 1. Await the dynamic parameters route
  const { id } = await params;

  // 2. Validate that the ID is a proper 24-character hexadecimal MongoDB ObjectId string
  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;
  const db = client.db("dropcast");

  // 3. Fetch the individual event document by its ID
  const event = await db
    .collection("events")
    .findOne({ _id: new ObjectId(id) });

  // 4. If no event exists with that ID, show the standard Next.js 404 page
  if (!event) {
    notFound();
  }

  // 5. Cleanly format the event date
  const formattedDate = event.date instanceof Date 
    ? event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
    : String(event.date);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl absolute -top-40 -right-40 -z-10"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl absolute -bottom-40 -left-40 -z-10"></div>

      <div className="max-w-md w-full rounded-3xl border border-indigo-150/80 bg-white/90 dark:border-white/10 dark:bg-white/[0.03] p-6 backdrop-blur-xl shadow-lg dark:shadow-2xl flex flex-col space-y-6">
        
        {/* Printable Stand Card Header */}
        <div className="flex items-center justify-between">
          <span className="inline-block bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
            Event Live Console
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Event ID: {id}</span>
        </div>

        {/* Printable Card Stand Wrapper */}
        <div className="rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-150/80 flex flex-col items-center select-none">
          {/* Top accent line */}
          <div className="h-1.5 w-16 rounded-full bg-brand-500 mb-5" />
          
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Share your photos
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {event.name}
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-500">
            {formattedDate}
          </p>

          {/* QR Code Frame */}
          {event.qrCodeUrl ? (
            <div className="mt-6 flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-center shadow-sm">
                <Image
                  src={event.qrCodeUrl}
                  alt={`QR Code for ${event.name}`}
                  width={200}
                  height={200}
                  className="object-contain rounded"
                  priority
                />
              </div>

              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4.5 py-2 text-xs font-bold text-white shadow-glow">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Scan to upload — no app needed
              </span>
            </div>
          ) : (
            <div className="w-[200px] h-[200px] bg-slate-100 flex items-center justify-center rounded-xl border border-dashed border-slate-200 mt-6">
              <p className="text-xs text-red-500 font-medium">QR Code image is missing.</p>
            </div>
          )}

          <p className="mt-5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
            Powered by DropCast
          </p>
        </div>

        {/* Download Stand Trigger */}
        {event.qrCodeUrl && (
          <div className="w-full">
            <DownloadQRButton 
              qrCodeUrl={event.qrCodeUrl} 
              eventName={event.name} 
            />
          </div>
        )}

        {/* Quick share link info */}
        {event.uploadUrl && (
          <div className="pt-4 border-t border-indigo-100 dark:border-white/5 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Quick share link
            </span>
            <code className="block w-full truncate rounded-xl border border-indigo-200 bg-indigo-50/60 dark:border-white/10 dark:bg-ink-950/60 px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 text-left font-mono">
              {event.uploadUrl}
            </code>
            <Link 
              href={`/event/${id}/upload`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors mt-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Preview the guest experience
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}