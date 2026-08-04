// components/EventCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";

interface EventCardProps {
  name: string;
  date: string;
  eId: string;
  qrCodeUrl: string; // Add this prop to receive the Cloudinary link
}

export default function EventCard({ name, date, eId, qrCodeUrl }: EventCardProps) {
  return (
    <Link href={`/event/${eId}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center overflow-hidden border border-slate-100 bg-white">
        <CardHeader className="w-full text-left p-4 pb-2">
          <CardTitle className="text-lg font-bold text-gray-900 leading-tight">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{date}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 w-full flex justify-center">
          {/* Render the QR code using the prop string */}
          {qrCodeUrl ? (
            <Image 
              src={qrCodeUrl} 
              alt={`QR Code for ${name}`} 
              width={200} 
              height={200}
              className="mt-2 object-contain rounded-lg"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-xs text-gray-400 mt-2 rounded-lg">
              No QR Code
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}