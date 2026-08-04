import React from "react";

export interface StatusAlertsProps {
  uploadStatus: string;
  isUploading: boolean;
  errorMsg: string;
}

export default function StatusAlerts({ uploadStatus, isUploading, errorMsg }: StatusAlertsProps) {
  return (
    <>
      {uploadStatus && !isUploading && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center animate-fade-in">
          {uploadStatus}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl text-sm font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center animate-fade-in">
          {errorMsg}
        </div>
      )}
    </>
  );
}
