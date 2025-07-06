import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const MapPage = () => {
  const { isArabic } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {isArabic() ? "خريطة المشاريع" : "Projects Map"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {isArabic()
              ? "شاهد مواقع مشاريعنا في منطقة السعاتة الدومة"
              : "View the locations of our projects in Assaatah Al-Doma area"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {isArabic()
              ? "هذه الصفحة قيد التطوير. سيتم إضافة المحتوى قريباً."
              : "This page is under development. Content will be added soon."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
