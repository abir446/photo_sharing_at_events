// app/dashboard/create/page.tsx
import { createEvent } from "@/app/actions/event";

export default function CreateEventPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md border border-gray-200">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Create a New Wedding Event
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set up your event page and instantly generate guest QR codes.
          </p>
        </div>

        {/* The action attribute calls our server function directly */}
        <form action={createEvent} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                required
                placeholder="e.g., Abir & Neha's Wedding Reception"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Create Event & Generate QR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}