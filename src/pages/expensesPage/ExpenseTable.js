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

const ExpenseTable = ({
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
    // Fetch user names for UIDs not already cached
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
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <thead>
          <tr>
            <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
              التصنيف
            </th>

            <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
              المبلغ
            </th>
            <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
              المُقدِّم
            </th>
            <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
              التاريخ
            </th>
            <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
              الحالة
            </th>
            <th className="p-3 text-right">الفواتير</th>
            <th className="p-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 dark:border-gray-700"
            >
              <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                {getCategoryName(item.category)}
              </td>

              <td className="p-3 text-sm text-gray-700 dark:text-gray-200">
                {item.amount} ج.س
              </td>
              <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                {/* If submittedBy looks like a UID, show fetched name; else show as is */}
                {/^[a-zA-Z0-9]{20,}$/.test(item.submittedBy)
                  ? userNames[item.submittedBy] || "..."
                  : item.submittedBy || "غير معروف"}
              </td>
              <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(item.createdAt)}
              </td>
              <td className="p-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="p-3">
                <ExpenseBills expenseId={item.id} />
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    className="py-1 px-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => onEdit(item)}
                    disabled={
                      !hasPermission || !hasPermission("manage_finances")
                    }
                  >
                    تفاصيل / تعديل
                  </button>
                  <button
                    className="py-1 px-3 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    onClick={() => onDelete(item.id)}
                    disabled={
                      !hasPermission || !hasPermission("manage_finances")
                    }
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ExpenseTable.propTypes = {
  expenses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nameAr: PropTypes.string.isRequired,
    })
  ),
};

export default ExpenseTable;
