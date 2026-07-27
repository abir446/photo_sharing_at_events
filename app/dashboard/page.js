import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import EventCard from '@/components/EventCard';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
    redirect('/api/auth/login');
  }

  const user = await getUser();
  if (!user || !user.id) {
    redirect('/api/auth/login');
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const res = await fetch(`${backendUrl}/api/events?userId=${user.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events from backend");
  }
  
  const events = await res.json();
  
  return (
    <div className='p-4 space-y-4 max-w-4xl mx-auto'>
      <h1 className="text-2xl font-bold mb-4">Your Events</h1>
      
      {/* Responsive layout wrapper for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard 
            key={event._id}          
            name={event.name}                  
            date={new Date(event.date).toLocaleDateString()} 
            eId={event._id} 
            qrCodeUrl={event.qrCodeUrl || ""}
          />
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-gray-500 text-center py-4">You haven&apos;t created any events yet.</p>
      )}
    </div>
  );
}
