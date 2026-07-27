"use client";

import { useState } from "react";

export default function DownloadQRButton({ qrCodeUrl, eventName }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      const localUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = localUrl;
      
      const safeName = eventName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = `${safeName}-qr.png`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(localUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Could not download the QR Code directly. Please try long-pressing the image to save it.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="mt-4 flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {isDownloading ? "Downloading..." : "Download QR Code"}
    </button>
  );
}
