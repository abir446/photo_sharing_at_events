// components/EventCard.tsx
import Link from 'next/link';
import Image from "next/image";

interface EventCardProps {
  name: string;
  date: string;
  eId: string;
  qrCodeUrl: string; // Add this prop to receive the Cloudinary link
}

export default function EventCard({ name, date, eId, qrCodeUrl }: EventCardProps) {
  return (
    <Link href={`/event/${eId}`} className="block">
      <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white flex flex-col items-center">
        <div className="w-full text-left">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        
        {/* Render the QR code using the prop string */}
        {qrCodeUrl ? (
          <Image 
            src={qrCodeUrl} 
            alt={`QR Code for ${name}`} 
            width={200} 
            height={200}
            className="mt-4 object-contain"
          />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-xs text-gray-400 mt-4 rounded">
            No QR Code
          </div>
        )}
      </div>
    </Link>
  );
}