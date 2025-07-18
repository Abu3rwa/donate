import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModerationCommentThread from "./ModerationCommentThread";
import { CATEGORY_LABELS } from "./labels";

function ModerationDetailModal({ expense, onClose, onAction }) {
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [commentAdded, setCommentAdded] = useState(0);

  const handleAction = async (actionType) => {
    if (actionType !== "comment" && !comment.trim()) {
      toast.error("التعليق مطلوب عند الرفض أو الموافقة.");
      return;
    }
    setActionLoading(true);
    try {
      await onAction(actionType, expense.id, comment);
      setComment("");
      if (actionType === "comment") {
        setCommentAdded((c) => c + 1);
      } else {
        onClose();
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!expense) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              تفاصيل المصروف
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              مراجعة واتخاذ إجراء
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <main className="p-4 sm:p-5 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                المبلغ
              </label>
              <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                {expense.amount.toLocaleString("ar-EG")} ج.س
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                التصنيف
              </label>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {CATEGORY_LABELS[expense.category] || expense.category}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                المُقدِّم
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {expense.submittedBy || "غير معروف"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                تاريخ التقديم
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {expense.createdAt
                  ? new Date(expense.createdAt).toLocaleDateString("ar-EG")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg mb-4">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              الوصف
            </label>
            <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">
              {expense.description}
            </p>
          </div>

          {expense.files && expense.files.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                المرفقات
              </h4>
              <div className="flex flex-wrap gap-2">
                {expense.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {file.name || `مرفق ${idx + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              سجل التعليقات
            </h4>
            <ModerationCommentThread
              expenseId={expense.id}
              onCommentAdded={commentAdded}
            />
          </div>
        </main>

        {expense.status === "pending" && (
          <footer className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col gap-3">
              <textarea
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="أضف تعليقًا (مطلوب عند الموافقة أو الرفض)..."
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={actionLoading}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleAction("approve")}
                  disabled={actionLoading || !comment.trim()}
                  className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "..." : "موافقة"}
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionLoading || !comment.trim()}
                  className="w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "..." : "رفض"}
                </button>
                <button
                  onClick={() => handleAction("comment")}
                  disabled={actionLoading || !comment.trim()}
                  className="w-full py-2.5 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "..." : "إضافة تعليق فقط"}
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default ModerationDetailModal;