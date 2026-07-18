// components/EventCard.tsx
import Link from 'next/link';

interface EventCardProps {
  name: string;
  date: string;
  eId: string;
}

export default function EventCard({ name, date, eId }: EventCardProps) {
  return (
    <Link href={`/event/${eId}`} className="block">
      <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </Link>
  );
}