import React from "react";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) return "-";
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d) ? "-" : d.toLocaleDateString("ar-EG");
  }
  if (value.toDate) {
    // Firestore Timestamp
    const d = value.toDate();
    return isNaN(d) ? "-" : d.toLocaleDateString("ar-EG");
  }
  return "-";
}

const ExpenseCard = ({ item, userNames, onReview, getCategoryName }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-grow">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {item.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            بواسطة:{" "}
            {userNames[item.submittedBy] || item.submittedBy || "غير معروف"}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400">التاريخ</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            {formatDate(item.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">التصنيف</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            {getCategoryName(item.category)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">المبلغ</p>
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            {item.amount ? Number(item.amount).toLocaleString("ar-EG") : "-"} ج.س
          </p>
        </div>
      </div>

      {item.status !== "approved" && (
        <button
          onClick={() => onReview(item)}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm transition"
        >
          مراجعة
        </button>
      )}
    </div>
  );
};

export default ExpenseCard;
