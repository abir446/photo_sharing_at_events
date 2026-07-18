// app/dashboard/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import EventCard from '@/components/EventCard';
import { redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface MongoEvent {
  _id: ObjectId;
  userId: string;
  name: string;
  date: Date; // 1. Change this from string to Date
}

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
    <div className='p-4 space-y-4'>
      {events.map((event) => (
        <EventCard 
          key={event._id.toString()}          
          name={event.name}                 
          // 2. Convert the Date object to a string format here
          date={event.date.toLocaleDateString()} 
          eId={event._id.toString()} 
        />
      ))}

      {events.length === 0 && (
        <p className="text-gray-500 text-center py-4">You havent created any events yet.</p>
      )}
    </div>
  );
}