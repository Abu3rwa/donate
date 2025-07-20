import React from "react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, fileName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">تأكيد الحذف</h2>
        <p className="text-gray-600 mb-6">
          هل أنت متأكد من أنك تريد حذف الملف:{" "}
          <strong className="font-medium text-gray-900">{fileName}</strong>؟ لا
          يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
