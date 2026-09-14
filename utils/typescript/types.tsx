import { ObjectId } from "mongodb";

export interface MediaItem {
  _id: string;
  eventId: string;
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  createdAt: string;
  state?: "approved" | "pending" | "hidden" | "flagged";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface GalleryClientProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  initialMedia: MediaItem[];
  isHost?: boolean;
  isAdmin?: boolean;
}

export interface MongoEvent {
  _id: ObjectId;
  userId: string;
  name: string;
  date: Date;
  qrCodeUrl?: string;
  uploadUrl?: string;
  paymentId?: string;
  plan?: {
    id: string;
    name: string;
    storage: string;
    price: number;
  };
}

export interface DownloadQRButtonProps {
  qrCodeUrl: string;
  eventName: string;
}