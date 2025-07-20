import React from "react";

const EmptyState = ({ message, subMessage }) => {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-2xl font-semibold mb-2">
        {message || "لم يتم العثور على ملفات"}
      </p>
      <p>{subMessage || "حاول تغيير معايير البحث أو قم برفع ملف جديد."}</p>
    </div>
  );
};

export default EmptyState;
