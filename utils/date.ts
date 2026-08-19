/**
 * Formats a date string to a consistent, beautiful human-readable format.
 * Gracefully handles both YYYY-MM-DD strings and legacy strings (e.g. "Sat, Oct 18, 2026").
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return "";
  
  // If it already has day names or month names in letters, it's already verbose (legacy)
  if (/[a-zA-Z]/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(d.getTime())) return dateStr;
    
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Returns today's local date formatted as a YYYY-MM-DD string.
 * Used for setting min attributes on date inputs to prevent past bookings.
 */
export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
