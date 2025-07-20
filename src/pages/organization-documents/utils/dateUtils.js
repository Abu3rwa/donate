// Helper to format Firestore Timestamp or string
export function formatDate(ts) {
  if (!ts) return "";
  // Check if it's a Firestore Timestamp
  if (ts.seconds && typeof ts.toDate === "function") {
    return ts.toDate().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  // Fallback for string dates (though Firestore Timestamps are preferred)
  const d = new Date(ts);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "تاريخ غير صالح";
}
