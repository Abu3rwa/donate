import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { moderationService } from "./moderationService";

import { getAuth } from "firebase/auth";

function ModerationCommentThread({ expenseId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      // Default to 'expense' type for backward compatibility
      const data = await moderationService.getComments("expense", expenseId);
      setComments(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      setComments([]);
      toast.error("فشل في تحميل التعليقات.");
    } finally {
      setLoading(false);
    }
  }, [expenseId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (onCommentAdded) {
      fetchComments();
    }
  }, [onCommentAdded, fetchComments]);

  // Get current user info
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid;
  const currentUserEmail = currentUser?.email;

  // Only allow delete for admins or comment author
  const canDelete = (comment) => {
    if (!currentUser) return false;
    // Allow if author (now user id) matches current user id or user is admin
    return (
      comment.author === currentUserId ||
      (currentUserEmail && currentUserEmail.endsWith("@admin")) ||
      (currentUserEmail && currentUserEmail.endsWith("@superadmin"))
    );
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;
    setDeleting(commentId);
    try {
      await moderationService.deleteComment("expense", commentId);
      toast.success("تم حذف التعليق بنجاح");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      toast.error("فشل حذف التعليق");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="text-sm text-gray-400 py-4 text-center">
        جاري تحميل التعليقات...
      </div>
    );

  return (
    <div className="space-y-3 mt-2">
      {comments.length === 0 ? (
        <div className="text-sm text-gray-400 py-4 text-center">
          لا توجد تعليقات بعد.
        </div>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {c.author || "مشرف"}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString("ar-EG")
                  : "-"}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {c.text}
            </p>
            {c.type !== "comment" && (
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                  c.type === "approve"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {c.type === "approve" ? "موافقة" : "رفض"}
              </span>
            )}
            {canDelete(c) && (
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deleting === c.id}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold transition disabled:opacity-60"
              >
                {deleting === c.id ? "جاري الحذف..." : "حذف"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ModerationCommentThread;
