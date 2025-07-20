import React from "react";

const LoadingSpinner = ({ message }) => {
  return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-2xl">{message || "جاري تحميل الملفات..."}</p>
      {/* You can add a visual spinner here if you like */}
      <div className="mt-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
