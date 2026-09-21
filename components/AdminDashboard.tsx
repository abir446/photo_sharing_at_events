"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";
import {
  CalendarDaysIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  ImagesIcon,
  CreditCardIcon,
  SearchIcon,
  EditIcon,
  Trash2Icon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  FlagIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  DollarSignIcon,
  CheckIcon,
  XIcon,
  ChevronDownIcon,
  CopyIcon,
  QrCodeIcon,
  FilterIcon,
  LayersIcon,
  CameraIcon,
  UserCheckIcon,
  ArrowRightIcon
} from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

export interface AdminEvent {
  id: string;
  userId: string;
  createdBy: string;
  name: string;
  date: string;
  qrCodeUrl: string;
  uploadUrl: string;
  paymentId: string | null;
  plan: { id: string; name: string; storage: string; price: number } | null;
  mediaCount: number;
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  userId: string;
  userEmail: string;
  photographerId: string;
  photographerName: string;
  packagePrice: number;
  addOns: string[];
  totalAmount: number;
  dueToday: number;
  paymentId: string | null;
  status: string;
  eventDetails: {
    date: string;
    location: string;
    coverage: string;
    packageName: string;
  };
  createdAt: string;
}

export interface AdminCreator {
  id: string;
  name: string;
  initials: string;
  accent: string;
  location: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  styles: string[];
  verified: boolean;
  subscribed: boolean;
  email: string;
  paymentId: string | null;
  responseTime: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface AdminMedia {
  id: string;
  eventId: string;
  url: string;
  publicId: string;
  resourceType: string;
  state: "approved" | "flagged" | "hidden";
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  eventRevenue: number;
  bookingVolume: number;
  totalEvents: number;
  totalBookings: number;
  totalCreators: number;
  totalUsers: number;
  totalMedia: number;
}

interface AdminDashboardProps {
  currentAdminUser: { id: string; email: string; name: string };
  initialEvents: AdminEvent[];
  initialBookings: AdminBooking[];
  initialCreators: AdminCreator[];
  initialUsers: AdminUser[];
  initialMedia: AdminMedia[];
  initialStats: AdminStats;
}

type TabType = "overview" | "events" | "bookings" | "creators" | "users" | "media";

export default function AdminDashboard({
  currentAdminUser,
  initialEvents,
  initialBookings,
  initialCreators,
  initialUsers,
  initialMedia,
  initialStats,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // State Collections
  const [events, setEvents] = useState<AdminEvent[]>(initialEvents);
  const [bookings, setBookings] = useState<AdminBooking[]>(initialBookings);
  const [creators, setCreators] = useState<AdminCreator[]>(initialCreators);
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [media, setMedia] = useState<AdminMedia[]>(initialMedia);

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");

  // Event Edit / Delete Modals
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [editEventName, setEditEventName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Booking Update Action
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  // User Role Update State
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Creator Toggle States
  const [updatingCreatorId, setUpdatingCreatorId] = useState<string | null>(null);
  const [deletingCreatorId, setDeletingCreatorId] = useState<string | null>(null);

  // Media Moderation Action
  const [moderatingMediaId, setModeratingMediaId] = useState<string | null>(null);

  // Copy helper
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
    showToast.success("Copied to clipboard!", { duration: 2500, position: "top-right" });
  };

  // --- FILTERED DATASETS ---
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = eventSearch.toLowerCase().trim();
      return (
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.createdBy.toLowerCase().includes(q) ||
        (e.paymentId && e.paymentId.toLowerCase().includes(q))
      );
    });
  }, [events, eventSearch]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = bookingSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        b.photographerName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.paymentId && b.paymentId.toLowerCase().includes(q));

      const matchesStatus =
        bookingStatusFilter === "all" || b.status.toLowerCase() === bookingStatusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      const q = creatorSearch.toLowerCase().trim();
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.styles.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [creators, creatorSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchesRole =
        userRoleFilter === "all" || u.role.toLowerCase() === userRoleFilter;

      return matchesQuery && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredMedia = useMemo(() => {
    return media.filter((m) => {
      if (mediaFilter === "all") return true;
      return m.state === mediaFilter;
    });
  }, [media, mediaFilter]);

  // --- EVENT ACTIONS ---
  const handleSaveEventEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsSavingEvent(true);
    try {
      const res = await fetch(`/api/event/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editEventName, date: editEventDate }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents((prev) =>
          prev.map((evt) =>
            evt.id === editingEvent.id
              ? { ...evt, name: editEventName, date: new Date(editEventDate).toISOString() }
              : evt
          )
        );
        showToast.success("Event updated successfully!", { duration: 3000, position: "top-right" });
        setEditingEvent(null);
      } else {
        throw new Error(data.error || "Failed to update event");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Update failed", { duration: 3000, position: "top-right" });
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this event and its media references?")) return;
    setDeletingEventId(id);
    try {
      const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        showToast.success("Event deleted from platform.", { duration: 3000, position: "top-right" });
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to delete event", { duration: 3000, position: "top-right" });
    } finally {
      setDeletingEventId(null);
    }
  };

  // --- BOOKING ACTIONS ---
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        showToast.success(`Booking status changed to ${newStatus}`, { duration: 3000, position: "top-right" });
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Error updating booking", { duration: 3000, position: "top-right" });
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;
    setDeletingBookingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        showToast.success("Booking record removed.", { duration: 3000, position: "top-right" });
      } else {
        throw new Error(data.error || "Failed to delete booking");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Delete failed", { duration: 3000, position: "top-right" });
    } finally {
      setDeletingBookingId(null);
    }
  };

  // --- CREATOR ACTIONS ---
  const handleToggleCreatorStatus = async (creatorId: string, field: "verified" | "subscribed", currentValue: boolean) => {
    setUpdatingCreatorId(creatorId);
    try {
      const nextValue = !currentValue;
      const res = await fetch(`/api/admin/creators/${creatorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: nextValue }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreators((prev) =>
          prev.map((c) => (c.id === creatorId ? { ...c, [field]: nextValue } : c))
        );
        showToast.success(`Creator ${field} set to ${nextValue ? "active" : "disabled"}`, { duration: 2500, position: "top-right" });
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to update creator", { duration: 3000, position: "top-right" });
    } finally {
      setUpdatingCreatorId(null);
    }
  };

  const handleDeleteCreator = async (creatorId: string) => {
    if (!confirm("Are you sure you want to remove this creator profile from the marketplace?")) return;
    setDeletingCreatorId(creatorId);
    try {
      const res = await fetch(`/api/admin/creators/${creatorId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreators((prev) => prev.filter((c) => c.id !== creatorId));
        showToast.success("Creator profile removed.", { duration: 3000, position: "top-right" });
      } else {
        throw new Error(data.error || "Failed to delete creator");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to delete creator", { duration: 3000, position: "top-right" });
    } finally {
      setDeletingCreatorId(null);
    }
  };

  // --- USER ACTIONS ---
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast.success(`User role updated to ${newRole}`, { duration: 3000, position: "top-right" });
      } else {
        throw new Error(data.error || "Role update failed");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to update role", { duration: 3000, position: "top-right" });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user account?")) return;
    setDeletingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showToast.success("User account deleted.", { duration: 3000, position: "top-right" });
      } else {
        throw new Error(data.error || "Failed to delete user");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to delete user", { duration: 3000, position: "top-right" });
    } finally {
      setDeletingUserId(null);
    }
  };

  // --- MEDIA ACTIONS ---
  const handleModerateMedia = async (mediaId: string, newState: "approved" | "flagged" | "hidden") => {
    setModeratingMediaId(mediaId);
    try {
      const res = await fetch(`/api/admin/media/${mediaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: newState }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMedia((prev) =>
          prev.map((m) => (m.id === mediaId ? { ...m, state: newState } : m))
        );
        showToast.success(`Media marked as ${newState}`, { duration: 2500, position: "top-right" });
      } else {
        throw new Error(data.error || "Moderation failed");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to update media", { duration: 3000, position: "top-right" });
    } finally {
      setModeratingMediaId(null);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Permanently delete this photo from the event?")) return;
    setModeratingMediaId(mediaId);
    try {
      const res = await fetch(`/api/admin/media/${mediaId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMedia((prev) => prev.filter((m) => m.id !== mediaId));
        showToast.success("Photo removed from platform.", { duration: 2500, position: "top-right" });
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Failed to delete photo", { duration: 3000, position: "top-right" });
    } finally {
      setModeratingMediaId(null);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayersIcon, count: null },
    { id: "events", label: "QR Events", icon: QrCodeIcon, count: events.length },
    { id: "bookings", label: "Bookings & Payments", icon: CreditCardIcon, count: bookings.length },
    { id: "creators", label: "Creators", icon: CameraIcon, count: creators.length },
    { id: "users", label: "Users & Roles", icon: UsersIcon, count: users.length },
    { id: "media", label: "Media Moderation", icon: ImagesIcon, count: media.length },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-ink-950 text-slate-100">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm">
              <ShieldCheckIcon className="w-4 h-4 text-brand-400" />
              <span>DropCast Platform Administrator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Command Center
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Real-time administrative control across all platform events, guest QR streams, creator bookings, payment audits, and user access.
            </p>
          </div>

          {/* Admin Identity Badge */}
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-sm">
              {currentAdminUser.name.slice(0, 2).toUpperCase() || "AD"}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">{currentAdminUser.name}</p>
              <p className="text-[11px] text-brand-400 font-mono">{currentAdminUser.email}</p>
            </div>
          </div>
        </header>

        {/* Tab Navigation Navigation Bar */}
        <nav aria-label="Admin Navigation Tabs" className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-500 text-white shadow-glow"
                    : "bg-white/[0.02] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW METRICS                                   */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <section className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                {
                  label: "Platform Volume",
                  value: `₹${(initialStats.totalRevenue || 0).toLocaleString()}`,
                  desc: "Events + Bookings gross",
                  icon: CreditCardIcon,
                  color: "text-emerald-400",
                  badge: "Financials",
                },
                {
                  label: "Active Events",
                  value: events.length.toString(),
                  desc: "QR spaces created",
                  icon: QrCodeIcon,
                  color: "text-brand-400",
                  badge: "Events",
                },
                {
                  label: "Creator Bookings",
                  value: bookings.length.toString(),
                  desc: "All time requests",
                  icon: CalendarDaysIcon,
                  color: "text-purple-400",
                  badge: "Leads",
                },
                {
                  label: "Marketplace Talent",
                  value: creators.length.toString(),
                  desc: `${creators.filter((c) => c.subscribed).length} active subscriptions`,
                  icon: CameraIcon,
                  color: "text-amber-400",
                  badge: "Creators",
                },
                {
                  label: "Total Accounts",
                  value: users.length.toString(),
                  desc: `${users.filter((u) => u.role === "admin").length} Administrators`,
                  icon: UsersIcon,
                  color: "text-sky-400",
                  badge: "Users",
                },
                {
                  label: "Guest Uploads",
                  value: initialStats.totalMedia.toLocaleString(),
                  desc: "Cloudinary media files",
                  icon: ImagesIcon,
                  color: "text-rose-400",
                  badge: "Gallery",
                },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {stat.label}
                        </span>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400 font-medium">{stat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Summaries Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings Feed */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-purple-400" />
                    Recent Creator Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer"
                  >
                    View all ({bookings.length}) &rarr;
                  </button>
                </div>
                <div className="divide-y divide-white/5 space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="pt-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {b.photographerName}{" "}
                          <span className="text-xs font-normal text-slate-400">for</span>{" "}
                          {b.userEmail}
                        </p>
                        <p className="text-xs text-slate-400">
                          {b.eventDetails.date} &bull; ₹{b.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : b.status === "accepted"
                            ? "bg-sky-500/10 text-sky-300 border border-sky-500/30"
                            : b.status === "rejected"
                            ? "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Events & QR Spaces */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <QrCodeIcon className="w-4 h-4 text-brand-400" />
                    Active Event Spaces
                  </h3>
                  <button
                    onClick={() => setActiveTab("events")}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold cursor-pointer"
                  >
                    View all ({events.length}) &rarr;
                  </button>
                </div>
                <div className="divide-y divide-white/5 space-y-3">
                  {events.slice(0, 5).map((e) => (
                    <div key={e.id} className="pt-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{e.name}</p>
                        <p className="text-xs text-slate-400">
                          Host: {e.createdBy} &bull; {new Date(e.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {e.plan && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                            {e.plan.name}
                          </span>
                        )}
                        <Link
                          href={`/event/${e.id}`}
                          className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                          title="View Live Event Stand"
                        >
                          <ExternalLinkIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 2: QR EVENTS MANAGEMENT                               */}
        {/* ========================================================= */}
        {activeTab === "events" && (
          <section className="space-y-6 animate-fadeIn">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="relative w-full sm:max-w-md">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by event title, ID, host email, or payment ID..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-ink-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <span className="text-xs text-slate-400">
                Showing <strong className="text-white">{filteredEvents.length}</strong> events
              </span>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-3xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-white leading-snug">{event.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          📅 {new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      {event.plan && (
                        <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {event.plan.name} (₹{event.plan.price})
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 space-y-1 bg-ink-900/60 p-3 rounded-xl border border-white/5">
                      <p className="truncate"><span className="text-slate-500 font-semibold">Host:</span> {event.createdBy}</p>
                      <p className="truncate font-mono"><span className="text-slate-500 font-semibold">ID:</span> {event.id}</p>
                      {event.paymentId && (
                        <p className="truncate font-mono text-emerald-400">
                          <span className="text-slate-500 font-semibold">Razorpay:</span> {event.paymentId}
                        </p>
                      )}
                      <p className="text-slate-300 font-semibold pt-1">
                        📸 {event.mediaCount} guest uploads recorded
                      </p>
                    </div>

                    {/* QR Preview & Share Links */}
                    {event.qrCodeUrl && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                          <img
                            src={event.qrCodeUrl}
                            alt="QR code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 text-xs space-y-1">
                          <button
                            onClick={() => copyToClipboard(event.uploadUrl)}
                            className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold transition-colors cursor-pointer"
                          >
                            <CopyIcon className="w-3.5 h-3.5" />
                            Copy Guest Upload Link
                          </button>
                          <Link
                            href={`/event/${event.id}`}
                            className="block text-slate-400 hover:text-white transition-colors"
                          >
                            Preview Print Stand &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        setEditEventName(event.name);
                        setEditEventDate(event.date.split("T")[0]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                      Edit Name/Date
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deletingEventId === event.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                      {deletingEventId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Event Modal */}
            {editingEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="bg-ink-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-lg text-white">Edit Event Details</h3>
                    <button
                      onClick={() => setEditingEvent(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveEventEdit} className="space-y-4">
                    <Input
                      label="Event Name"
                      id="editEventName"
                      value={editEventName}
                      onChange={(e) => setEditEventName(e.target.value)}
                      required
                    />
                    <Input
                      label="Event Date"
                      id="editEventDate"
                      type="date"
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                      required
                    />
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditingEvent(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={isSavingEvent}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BOOKINGS & PAYMENTS                                */}
        {/* ========================================================= */}
        {activeTab === "bookings" && (
          <section className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="relative w-full md:max-w-md">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client email, photographer, booking ID..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-ink-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                <span className="text-xs text-slate-400">Status filter:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-ink-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table / List */}
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-5 py-4">Client & Creator</th>
                    <th className="px-5 py-4">Event Date & Place</th>
                    <th className="px-5 py-4">Financials & Milestones</th>
                    <th className="px-5 py-4">Payment ID</th>
                    <th className="px-5 py-4">Status & Overrides</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-white text-sm">{b.photographerName}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          Host: {b.userEmail}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {b.id}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{b.eventDetails.date}</p>
                        <p className="text-slate-400">{b.eventDetails.location}</p>
                        <span className="inline-block mt-1 text-[10px] text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded">
                          {b.eventDetails.coverage}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">
                          Total: ₹{b.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          Deposit (20%): ₹{b.dueToday.toLocaleString()}
                        </p>
                        {b.addOns && b.addOns.length > 0 && (
                          <p className="text-[10px] text-indigo-300 mt-0.5">
                            + {b.addOns.length} Add-on(s) included
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px]">
                        {b.paymentId ? (
                          <span className="text-emerald-400 font-semibold">
                            {b.paymentId}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">No deposit recorded</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={b.status}
                            disabled={updatingBookingId === b.id}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="bg-ink-900 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer focus:outline-none focus:border-brand-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingBookingId === b.id && (
                            <RefreshCwIcon className="w-3.5 h-3.5 animate-spin text-brand-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          disabled={deletingBookingId === b.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Booking Record"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No bookings matching current search criteria.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CREATORS & MARKETPLACE                             */}
        {/* ========================================================= */}
        {activeTab === "creators" && (
          <section className="space-y-6 animate-fadeIn">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="relative w-full sm:max-w-md">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search creators by name, location, style..."
                  value={creatorSearch}
                  onChange={(e) => setCreatorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-ink-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <span className="text-xs text-slate-400">
                <strong className="text-white">{filteredCreators.length}</strong> photographers listed
              </span>
            </div>

            {/* Creators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="rounded-3xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                        style={{ backgroundColor: creator.accent || "#6366f1" }}
                      >
                        {creator.initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-base text-white truncate">{creator.name}</h3>
                        <p className="text-xs text-slate-400">{creator.location} &bull; ★ {creator.rating} ({creator.reviews} reviews)</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-ink-900/60 p-3 rounded-xl border border-white/5">
                      <p><span className="text-slate-500 font-semibold">Starting Price:</span> ₹{creator.startingPrice?.toLocaleString()}</p>
                      <p className="truncate"><span className="text-slate-500 font-semibold">Email:</span> {creator.email || "—"}</p>
                      <p className="truncate"><span className="text-slate-500 font-semibold">Response:</span> {creator.responseTime}</p>
                      {creator.styles && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {creator.styles.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-slate-300 border border-white/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Administrative Toggles */}
                  <div className="pt-3 border-t border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Verified Creator Badge:</span>
                      <button
                        onClick={() => handleToggleCreatorStatus(creator.id, "verified", creator.verified)}
                        className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                          creator.verified
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {creator.verified ? "Verified ✓" : "Unverified"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Marketplace Listing:</span>
                      <button
                        onClick={() => handleToggleCreatorStatus(creator.id, "subscribed", creator.subscribed)}
                        className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                          creator.subscribed
                            ? "bg-brand-500/10 text-brand-300 border border-brand-500/30"
                            : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {creator.subscribed ? "Live & Listed" : "Hidden"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href={`/photographer/${creator.id}`}
                        className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                      >
                        View Portfolio <ExternalLinkIcon className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCreator(creator.id)}
                        disabled={deletingCreatorId === creator.id}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 5: USERS & ROLE MANAGEMENT                            */}
        {/* ========================================================= */}
        {activeTab === "users" && (
          <section className="space-y-6 animate-fadeIn">
            {/* Header info banner */}
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-4 text-xs text-brand-200 flex items-center gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-brand-400 shrink-0" />
              <span>
                <strong>Role Permissions Control:</strong> Promote any registered user to an Administrator or switch them between Event Host and Creator. Changes take effect instantly across all active sessions.
              </span>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="relative w-full md:max-w-md">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or user ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-ink-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                <span className="text-xs text-slate-400">Role filter:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-ink-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrator</option>
                  <option value="creator">Creator</option>
                  <option value="user">Event Host</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-5 py-4">User Name & Email</th>
                    <th className="px-5 py-4">User ID</th>
                    <th className="px-5 py-4">Current Role</th>
                    <th className="px-5 py-4">Assign Role</th>
                    <th className="px-5 py-4">Joined Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentAdminUser.id;
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-white text-sm flex items-center gap-2">
                            {u.name}
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td className="px-5 py-4 font-mono text-[11px] text-slate-400">
                          {u.id}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                                : u.role === "creator"
                                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                                : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {u.role === "admin" ? "Administrator" : u.role === "creator" ? "Creator" : "Event Host"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={u.role}
                              disabled={isSelf || updatingUserId === u.id}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                              className={`bg-ink-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-500 ${
                                isSelf ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            >
                              <option value="user">Event Host</option>
                              <option value="creator">Creator</option>
                              <option value="admin">Administrator</option>
                            </select>
                            {updatingUserId === u.id && (
                              <RefreshCwIcon className="w-3.5 h-3.5 animate-spin text-brand-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={isSelf || deletingUserId === u.id}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSelf
                                ? "text-slate-600 cursor-not-allowed"
                                : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            }`}
                            title={isSelf ? "Cannot delete yourself" : "Delete User Account"}
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* TAB 6: MEDIA & GUEST UPLOADS MODERATION                   */}
        {/* ========================================================= */}
        {activeTab === "media" && (
          <section className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter status:</span>
                {(["all", "approved", "flagged", "hidden"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMediaFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      mediaFilter === st
                        ? "bg-brand-500 text-white shadow-glow"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">
                Showing <strong className="text-white">{filteredMedia.length}</strong> photos
              </span>
            </div>

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-ink-900 aspect-square shadow-lg"
                >
                  <img
                    src={item.url}
                    alt="Event upload"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge */}
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md ${
                      item.state === "approved"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : item.state === "flagged"
                        ? "bg-rose-500/30 text-rose-200 border border-rose-500/40"
                        : "bg-slate-900/80 text-slate-400 border border-white/10"
                    }`}
                  >
                    {item.state}
                  </span>

                  {/* Moderation Controls Overlay */}
                  <div className="absolute inset-0 bg-ink-950/80 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between backdrop-blur-sm">
                    <p className="text-[10px] text-slate-400 truncate">Event: {item.eventId}</p>
                    
                    <div className="grid grid-cols-2 gap-1.5 pt-2">
                      <button
                        onClick={() => handleModerateMedia(item.id, "approved")}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerateMedia(item.id, "flagged")}
                        className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[10px] font-bold cursor-pointer"
                      >
                        Flag
                      </button>
                      <button
                        onClick={() => handleModerateMedia(item.id, "hidden")}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[10px] font-bold cursor-pointer"
                      >
                        Hide
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="px-2 py-1 rounded bg-red-600/30 text-red-200 hover:bg-red-600/40 text-[10px] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedia.length === 0 && (
              <div className="py-16 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl">
                No media items matching current filter.
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
