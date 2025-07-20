import React from "react";

export default function NoPermission({
  title = "غير مصرح بالوصول",
  message = "عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة.",
  showBack = true,
  backText = "العودة للصفحة السابقة",
  readOnly = false,
  readOnlyMessage = "لديك صلاحية عرض فقط. لا يمكنك إضافة أو تعديل أو حذف العناصر في هذه الصفحة.",
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        {readOnly ? (
          <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg mb-6">
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
              <h2 className="text-xl font-bold">عرض فقط</h2>
            </div>
            <p className="text-sm">{readOnlyMessage}</p>
          </div>
        ) : (
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
              <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <p className="text-sm">{message}</p>
          </div>
        )}
        {showBack && (
          <button onClick={() => window.history.back()} className="btn-primary">
            {backText}
          </button>
        )}
      </div>
    </div>
  );
}
