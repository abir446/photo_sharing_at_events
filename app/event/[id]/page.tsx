// app/events/[id]/page.tsx
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Image from "next/image";
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
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 text-center">
        
        {/* Event Meta Metadata Header */}
        <div className="space-y-2">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
            Event Live Console
          </span>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{event.name}</h1>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        <hr className="border-gray-100" />

        {/* QR Code Presentation Container */}
        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Guest Photo Upload Access
          </p>
          
          {event.qrCodeUrl ? (
            <div className="w-full flex flex-col items-center">
              {/* Next.js Optimized External Image Element */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <Image
                  src={event.qrCodeUrl}
                  alt={`QR Code for ${event.name}`}
                  width={240}
                  height={240}
                  className="object-contain rounded"
                  priority
                />
              </div>

              {/* Client Component Button to trigger the blob download */}
              <DownloadQRButton 
                qrCodeUrl={event.qrCodeUrl} 
                eventName={event.name} 
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-sm text-red-500 font-medium">QR Code image url is missing.</p>
            </div>
          )}
        </div>

        {/* Informational Subtext */}
        <div className="space-y-1 text-xs text-gray-400">
          <p>Guests can point their smartphone cameras here to instantly share photos.</p>
          {event.uploadUrl && (
            <p className="text-indigo-500 font-medium break-all mt-1">{event.uploadUrl}</p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Target System: MongoDB</span>
          <span>Event ID: {id}</span>
        </div>
      </div>
    </div>
  );
}