// Helper to format Firestore Timestamp, string, number, or Date to a readable date string
export function formatDate(value) {
  if (!value) return "-";
  let date;
  if (value.toDate && typeof value.toDate === "function") {
    date = value.toDate();
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else {
    return "-";
  }
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ar-EG");
}
