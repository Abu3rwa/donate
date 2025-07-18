import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import StatusBadge from "./StatusBadge";
import ExpenseBills from "./ExpenseBills";
import { getUserById } from "../../services/userService";
import { formatDate } from "./expenseHelpers";

const CATEGORY_LABELS = {
  operations: "تشغيلية",
  purchase: "شراء",
  salary: "راتب",
  donation: "تبرع",
  other: "أخرى",
};

const ExpenseCardList = ({
  expenses,
  onEdit,
  onDelete,
  hasPermission,
  categories = [],
}) => {
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    // Find all unique submittedBy values that look like UIDs (not names)
    const uids = expenses
      .map((item) => item.submittedBy)
      .filter((v) => v && /^[a-zA-Z0-9]{20,}$/.test(v));
    const uniqueUids = Array.from(new Set(uids));
    uniqueUids.forEach(async (uid) => {
      if (!userNames[uid]) {
        const user = await getUserById(uid);
        setUserNames((prev) => ({
          ...prev,
          [uid]: user?.displayName || "غير معروف",
        }));
      }
    });
    // eslint-disable-next-line
  }, [expenses]);

  // Helper to get category name by ID
  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.nameAr : catId;
  };

  return (
    <div className="block md:hidden">
      {expenses.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2 mb-4 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-base text-gray-900 dark:text-white">
              {getCategoryName(item.category)}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-bold text-green-700">
              المبلغ: {item.amount} ج.س
            </span>
            <span className="font-bold text-blue-700">
              المُقدِّم:{" "}
              {/^[a-zA-Z0-9]{20,}$/.test(item.submittedBy)
                ? userNames[item.submittedBy] || "..."
                : item.submittedBy || "غير معروف"}
            </span>
            <span>بتاريخ: {formatDate(item.createdAt)}</span>
          </div>
          <ExpenseBills expenseId={item.id} />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => onEdit(item)}
              disabled={!hasPermission || !hasPermission("manage_finances")}
            >
              تفاصيل / تعديل
            </button>
            <button
              className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              onClick={() => onDelete(item.id)}
              disabled={!hasPermission || !hasPermission("manage_finances")}
            >
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

ExpenseCardList.propTypes = {
  expenses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object),
};

export default ExpenseCardList;
