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
    <Link href={`/event/${eId}`} className="block group">
      <Card className="hover:shadow-glow hover:border-brand-500/40 transition-all duration-300 cursor-pointer flex flex-col items-center overflow-hidden bg-white/[0.03] border border-white/10 text-white h-full">
        <CardHeader className="w-full text-left p-6 pb-3">
          <CardTitle className="text-xl font-bold text-white leading-tight group-hover:text-brand-400 transition-colors">{name}</CardTitle>
          <CardDescription className="text-sm text-slate-400 mt-1">{date}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 pt-0 w-full flex justify-center mt-auto">
          {/* Render the QR code using the prop string */}
          {qrCodeUrl ? (
            <div className="bg-white p-3.5 rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-102">
              <Image 
                src={qrCodeUrl} 
                alt={`QR Code for ${name}`} 
                width={180} 
                height={180}
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-[180px] h-[180px] bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-xs text-slate-500 mt-2 rounded-2xl">
              No QR Code
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}