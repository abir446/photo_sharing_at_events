"use client";

import React, { useState, useMemo } from "react";
import { showToast } from "nextjs-toast-notify";
import EventCard from "./EventCard";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface SerializedEvent {
  id: string;
  userId: string;
  name: string;
  date: string;
  qrCodeUrl: string;
}

interface AdminDashboardProps {
  initialEvents: SerializedEvent[];
}

function toInputDateFormat(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    return "";
  }
}

function toDisplayDateFormat(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
}

export default function AdminDashboard({ initialEvents }: AdminDashboardProps) {
  const [events, setEvents] = useState<SerializedEvent[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit State
  const [editingEvent, setEditingEvent] = useState<SerializedEvent | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingEvent, setDeletingEvent] = useState<SerializedEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter events based on search term (name or ID)
  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  // Open Edit Modal
  const handleEditClick = (event: SerializedEvent) => {
    setEditingEvent(event);
    setEditName(event.name);
    setEditDate(toInputDateFormat(event.date));
  };

  // Save Event Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    if (!editName.trim() || !editDate) {
      showToast.error("Event name and date are required.", { duration: 3000 });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/event/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          date: editDate,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showToast.success("Event updated successfully!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });

        // Update local state
        setEvents((prev) =>
          prev.map((evt) =>
            evt.id === editingEvent.id
              ? { ...evt, name: editName, date: new Date(editDate).toISOString() }
              : evt
          )
        );
        setEditingEvent(null);
      } else {
        showToast.error(data.error || "Failed to update event.", {
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      showToast.error("An error occurred while updating the event.", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete confirmation
  const handleDeleteClick = (event: SerializedEvent) => {
    setDeletingEvent(event);
  };

  // Confirm Delete Event
  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/event/${deletingEvent.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        showToast.success("Event deleted successfully!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });

        // Remove from local state
        setEvents((prev) => prev.filter((evt) => evt.id !== deletingEvent.id));
        setDeletingEvent(null);
      } else {
        showToast.error(data.error || "Failed to delete event.", {
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showToast.error("An error occurred while deleting the event.", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/30">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Admin Portal
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Management</h1>
            <p className="text-slate-500 text-sm">
              View, edit, and delete all events created across the platform.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-center">
              <span className="block text-2xl font-bold text-slate-800">{events.length}</span>
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Total Events</span>
            </div>
          </div>
        </div>

        {/* Search & Filtering Area */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-md flex-grow">
            <Input
              type="text"
              placeholder="Search by Event Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm py-2.5"
              icon={
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                </svg>
              }
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Clear Filter
            </Button>
          )}
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                name={event.name}
                date={toDisplayDateFormat(event.date)}
                eId={event.id}
                qrCodeUrl={event.qrCodeUrl}
                onEdit={() => handleEditClick(event)}
                onDelete={() => handleDeleteClick(event)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No Events Found</h3>
              <p className="text-slate-500 text-sm">
                {searchTerm
                  ? "We couldn't find any events matching your search term. Try another query."
                  : "There are currently no events registered in the system."}
              </p>
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="mt-2 text-xs font-semibold cursor-pointer"
              >
                Reset Search
              </Button>
            )}
          </div>
        )}

      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-6 relative animate-scaleUp">
            
            {/* Close Button */}
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              title="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Edit Event</h2>
              <p className="text-xs text-slate-400 font-mono">ID: {editingEvent.id}</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Input
                label="Event Name"
                id="editName"
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Wedding Reception"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                }
              />

              <Input
                label="Event Date"
                id="editDate"
                type="date"
                required
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              />

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-11 text-sm cursor-pointer"
                  onClick={() => setEditingEvent(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 rounded-xl h-11 text-sm cursor-pointer"
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 relative animate-scaleUp">
            
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Delete Event</h2>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete the event <span className="font-semibold text-slate-800">&quot;{deletingEvent.name}&quot;</span>? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 text-sm cursor-pointer"
                onClick={() => setDeletingEvent(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1 rounded-xl h-11 text-sm cursor-pointer"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
              >
                Delete Event
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
