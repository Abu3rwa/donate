import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const VolunteerPage = () => {
  const { isArabic } = useLanguage();

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--background-color)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {isArabic() ? "تطوع معنا" : "Volunteer With Us"}
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {isArabic()
              ? "انضم إلى فريق المتطوعين وساعد في إحداث التغيير"
              : "Join our volunteer team and help create change"}
          </p>
        </div>

        <div
          style={{
            background: "var(--paper-color)",
            borderRadius: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.07)",
          }}
          className="rounded-lg shadow-lg p-8"
        >
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {isArabic()
              ? "هذه الصفحة قيد التطوير. سيتم إضافة المحتوى قريباً."
              : "This page is under development. Content will be added soon."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
