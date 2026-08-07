// components/EventCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import Button from "./ui/Button";

interface EventCardProps {
  name: string;
  date: string;
  eId: string;
  qrCodeUrl: string; // Cloudinary link
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function EventCard({ name, date, eId, qrCodeUrl, onDelete, onEdit }: EventCardProps) {
  if (onDelete || onEdit) {
    return (
      <div className="relative group h-full">
        {/* We wrap only the card navigation in a Link */}
        <Link href={`/event/${eId}`} className="block h-full">
          <Card className="hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center overflow-hidden border border-slate-100 bg-white h-full">
            <CardHeader className="w-full text-left p-4 pb-2">
              <CardTitle className="text-lg font-bold text-gray-900 leading-tight">{name}</CardTitle>
              <CardDescription className="text-sm text-gray-500">{date}</CardDescription>
              <span className="text-xs text-indigo-600/70 font-mono mt-1.5 block">ID: {eId}</span>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 w-full flex justify-center flex-grow pb-18">
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
        
        {/* Separate Action Buttons container positioned at the bottom of the card, outside the Link element to ensure valid HTML */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-0 bg-gradient-to-t from-white via-white to-white/90 rounded-b-2xl flex justify-between gap-2 z-10">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-lg text-xs py-2 h-9 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
              leftIcon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.913a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              }
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="danger" 
              size="sm" 
              className="flex-1 rounded-lg text-xs py-2 h-9 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              leftIcon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              }
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link href={`/event/${eId}`} className="block h-full">
      <Card className="hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center overflow-hidden border border-slate-100 bg-white h-full">
        <CardHeader className="w-full text-left p-4 pb-2">
          <CardTitle className="text-lg font-bold text-gray-900 leading-tight">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{date}</CardDescription>
          <span className="text-xs text-indigo-600/70 font-mono mt-1.5 block">ID: {eId}</span>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 w-full flex justify-center flex-grow">
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