import { ObjectId } from "mongodb";

export interface MediaItem {
  _id: string;
  eventId: string;
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  createdAt: string;
}

export interface GalleryClientProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  initialMedia: MediaItem[];
}

export interface MongoEvent {
  _id: ObjectId;
  userId: string;
  name: string;
  date: Date;
  qrCodeUrl?: string;
  uploadUrl?: string;
}

export interface DownloadQRButtonProps {
  qrCodeUrl: string;
  eventName: string;
}