import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { moderationService } from "./moderationService";
import { CATEGORY_LABELS, STATUS_LABELS } from "./labels";
import StatusBadge from "./StatusBadge";
import ExpenseDetailModal from "./ModerationDetailModal";
import { useAuth } from "../../contexts/AuthContext";
import ExpenseCard from "./ExpenseCard"; // Import the new card component

// Main Page Component
export default function ContentModerationPage() {
  const { hasPermission, user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [categories, setCategories] = useState([]); // Add categories state
  const [userNames, setUserNames] = useState({});

  // Fetch categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Reuse getAllExpenseCategories from expensesService
        const { getAllExpenseCategories } = await import(
          "../../services/expensesService"
        );
        const data = await getAllExpenseCategories();
        setCategories(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

  // Helper: robust date formatter
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

  // Helper: get category Arabic name by ID
  function getCategoryName(catId) {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.nameAr : catId;
  }

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await moderationService.getItems("expense");
      setExpenses(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      setError("فشل في تحميل المصروفات.");
      toast.error("فشل في تحميل المصروفات.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const uids = expenses
      .map((item) => item.submittedBy)
      .filter((v) => v && /^[a-zA-Z0-9]{20,}$/.test(v));
    const uniqueUids = Array.from(new Set(uids));
    uniqueUids.forEach(async (uid) => {
      if (!userNames[uid]) {
        const { getUserById } = await import("../../services/userService");
        const user = await getUserById(uid);
        setUserNames((prev) => ({
          ...prev,
          [uid]: user?.displayName || "غير معروف",
        }));
      }
    });
  }, [expenses]);

  const handleAction = async (actionType, id, comment) => {
    try {
      let successMessage = "";
      const author = user?.displayName || user?.name || user?.email;
      const authorId = user?.uid || "unknown";
      if (actionType === "approve") {
        await moderationService.approveItem(
          "expense",
          id,
          comment,
          author,
          authorId
        );
        successMessage = "تمت الموافقة على المصروف بنجاح.";
      } else if (actionType === "reject") {
        await moderationService.rejectItem(
          "expense",
          id,
          comment,
          author,
          authorId
        );
        successMessage = "تم رفض المصروف بنجاح.";
      } else if (actionType === "comment") {
        await moderationService.addComment("expense", id, {
          text: comment,
          author,
          authorId,
        });
        successMessage = "تمت إضافة التعليق بنجاح.";
      }

      toast.success(successMessage);

      if (actionType !== "comment") {
        // Update the status locally without re-fetching
        setExpenses((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: actionType === "approve" ? "approved" : "rejected",
                }
              : item
          )
        );
      }
    } catch (err) {
      toast.error(`فشل الإجراء: ${err.message || "حدث خطأ ما"}`);
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(
        (item) => categoryFilter === "all" || item.category === categoryFilter
      )
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter(
        (item) =>
          search.trim() === "" ||
          (item.description || "")
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          (item.submittedBy || "")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
      );
  }, [expenses, categoryFilter, statusFilter, search]);

  if (!hasPermission("moderate_content")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-bold">غير مصرح بالوصول</h2>
            </div>
            <p className="text-sm">
              عذراً، هذه الصفحة متاحة فقط للمستخدمين المصرح لهم بعرض مستندات
              المنظمة.
            </p>
          </div>
          <button onClick={() => window.history.back()} className="btn-primary">
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen ">
      <div
        className="max-w-7xl mx-auto py-6 sm:py-8 px-2 sm:px-4 md:px-6 lg:px-8"
        dir="rtl"
      >
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            مراجعة المحتوى
          </h1>
          <small className="text-red-500 dark:text-gray-400 mt-1 text-sm">
            صفحة مراجعة حيث يمكن للمشرفين قبول أو رفض المعاملات ذات الحالة
            المعلقة في النظام.
          </small>
        </header>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="ابحث بالوصف أو اسم المُقدِّم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3 w-full md:w-auto">
            <select
              className="w-full text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">كل التصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameAr}
                </option>
              ))}
            </select>
            <select
              className="w-full text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">كل الحالات</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600 dark:text-gray-400">
              جاري تحميل المصروفات...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
              حدث خطأ
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد نتائج
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              لم يتم العثور على مصروفات مطابقة للبحث أو الفلاتر.
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards */}
            <div className="md:hidden">
              {filteredExpenses.map((item) => (
                <ExpenseCard
                  key={item.id}
                  item={item}
                  userNames={userNames}
                  onReview={setSelectedExpense}
                  getCategoryName={getCategoryName}
                />
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      التصنيف
                    </th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الإجراء
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExpenses.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="p-4 max-w-sm">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          بواسطة:{" "}
                          {userNames[item.submittedBy] ||
                            item.submittedBy ||
                            "غير معروف"}
                        </p>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {getCategoryName(item.category)}
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.amount
                          ? Number(item.amount).toLocaleString("ar-EG")
                          : "-"}{" "}
                        ج.س
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => setSelectedExpense(item)}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm transition"
                          >
                            مراجعة
                          </button>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ExpenseDetailModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}
