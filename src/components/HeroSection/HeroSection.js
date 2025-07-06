import React from "react";
import { Link } from "react-router-dom";


// Import hero image
import heroImage from "../../assets/468742514_8766108773469881_4524514268323846924_n.jpg";

const HeroSection = () => {

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          ساعد أهالي السعاتة الدومة
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto">
          منظمة خيرية مخصصة لمساعدة أهالي منطقة السعاتة الدومة في الخرطوم،
          السودان. نساعد في توفير الغذاء، المأوى، التعليم، والرعاية الصحية
          للمحتاجين.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/donate"
            className="btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-100 transition-colors duration-200"
          >
            تبرع الآن
          </Link>
          <Link
            to="/about"
            className="btn-outline text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-colors duration-200"
          >
            تعرف علينا
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">2,500+</div>
            <div className="text-sm md:text-base text-white">أسرة مساعدة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">15</div>
            <div className="text-sm md:text-base text-white">مشروع نشط</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">180</div>
            <div className="text-sm md:text-base text-white">متطوع</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">1.25M</div>
            <div className="text-sm md:text-base text-white">جنيه سوداني</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
