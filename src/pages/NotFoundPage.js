import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const NotFoundPage = () => {
  const { isArabic } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-500">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {isArabic() ? "الصفحة غير موجودة" : "Page Not Found"}
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {isArabic()
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة."
            : "Sorry, the page you are looking for does not exist."}
        </p>

        <Link to="/" className="btn-primary px-8 py-3 text-lg">
          {isArabic() ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
