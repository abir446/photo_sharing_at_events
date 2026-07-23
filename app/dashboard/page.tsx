// app/dashboard/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import EventCard from '@/components/EventCard';
import { redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb";
import { MongoEvent } from '@/utils/typescript/types';

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
  
  return (
    <div className='p-4 space-y-4 max-w-4xl mx-auto'>
      <h1 className="text-2xl font-bold mb-4">Your Events</h1>
      
      {/* Responsive layout wrapper for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard 
            key={event._id.toString()}          
            name={event.name}                  
            date={event.date.toLocaleDateString()} 
            eId={event._id.toString()} 
            qrCodeUrl={event.qrCodeUrl || ""} // 2. Pass the Cloudinary URL down to the card
          />
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-gray-500 text-center py-4">You haven&apos;t created any events yet.</p>
      )}
    </div>
  );
}