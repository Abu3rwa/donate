import React from "react";
import { Link } from "react-router-dom";

import { useHomePageData } from "../hooks/useHomePageData";
import HeroSection from "../components/HeroSection/HeroSection";
import AnimatedCounter from "../components/AnimatedCounter/AnimatedCounter";
import { CATEGORIES } from "../constants";

// Import images

import { auth } from "../config/firebase";
import { testimonials, partners, statistics, featuredStories } from "../data/homePageData";

console.log("Current Firebase user:", auth.currentUser);
const HomePage = () => {
  const { emergencyAlert, featuredStories, testimonials, partners, statistics } = useHomePageData();

  

  

  return (
    <div
      className="min-h-screen bg-[var(--background-color)] text-[var(--text-primary)]"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Emergency Alert Banner */}
      {emergencyAlert && (
        <div
          className="bg-[var(--accent-color)] text-[var(--text-primary)] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="font-semibold">{emergencyAlert.message}</span>
            </div>
            <Link
              to="/donate"
              className="bg-[var(--paper-color)] text-[var(--accent-color)] px-4 py-2 rounded-lg font-semibold"
            >
              تبرع الآن
            </Link>
          </div>
        </div>
      )}

      {/* Impact Statistics Section */}
      <section
        className="py-16 relative overflow-hidden bg-[var(--background-color)]"
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 bg-pattern-light"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]"
            >
              تأثيرنا على أرض الواقع
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto text-[var(--text-secondary)]"
            >
              من خلال تبرعاتكم الكريمة، استطعنا مساعدة آلاف الأسر في منطقة
              السعاتة الدومة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              className="text-center stat-card-secondary bg-[var(--secondary-color)] text-white rounded-2xl"
            >
              <div className="mb-4">
                <AnimatedCounter
                  end={statistics.totalDonations}
                  suffix=" SDG"
                />
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-white"
              >
                إجمالي التبرعات
              </h3>
              <p className="text-[var(--text-secondary)] opacity-90">
                تم جمعها منذ بداية المشروع
              </p>
            </div>

            <div
              className="text-center stat-card bg-[var(--primary-color)] text-white rounded-2xl"
            >
              <div className="mb-4">
                <AnimatedCounter end={statistics.familiesHelped} />
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-white"
              >
                الأسر المساعدة
              </h3>
              <p className="text-[var(--text-secondary)] opacity-90">
                أسر استفادت من برامجنا
              </p>
            </div>

            <div
              className="text-center stat-card-secondary bg-[var(--secondary-color)] text-white rounded-2xl"
            >
              <div className="mb-4 ">
                <AnimatedCounter end={statistics.activeProjects} />
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-white"
              >
                المشاريع النشطة
              </h3>
              <p className="text-[var(--text-secondary)] opacity-90">
                مشاريع قيد التنفيذ حالياً
              </p>
            </div>

            <div
              className="text-center stat-card bg-[var(--primary-color)] text-white rounded-2xl"
            >
              <div className="mb-4">
                <AnimatedCounter end={statistics.volunteers} />
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-white"
              >
                المتطوعين
              </h3>
              <p className="text-[var(--text-secondary)] opacity-90">
                متطوع يساعدون في الميدان
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10"></div>
      </section>

      {/* How We Help Section */}
      <section className="py-16 bg-[var(--paper-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]"
            >
              كيف نساعد
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto text-[var(--text-secondary)]"
            >
              نركز على أربعة مجالات رئيسية لمساعدة أهالي السعاتة الدومة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <div
                key={key}
                style={{
                  background: "var(--background-color)",
                  color: "var(--text-primary)",
                  borderRadius: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.07)",
                }}
                className="p-6 hover:shadow-xl transition-shadow duration-300 bg-[var(--background-color)] text-[var(--text-primary)] rounded-2xl shadow-md"
              >
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-[var(--accent-color)]"
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{category.name}</h3>
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                  {category.description}
                </p>
                <Link
                  to={`/campaigns?category=${key}`}
                  className="text-[var(--primary-color)] font-semibold"
                >
                  تعرف على المزيد →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-16 bg-[var(--paper-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]"
              >
                القصص المؤثرة
              </h2>
              <p className="text-xl text-[var(--text-secondary)]">
                قصص حقيقية عن التغيير الإيجابي في حياة الناس
              </p>
            </div>
            <Link to="/stories" className="btn-primary px-6 py-3">
              عرض جميع القصص
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredStories.map((story) => (
              <div
                key={story.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-[var(--background-color)] text-[var(--text-primary)] rounded-2xl shadow-md"
              >
                <div className="relative h-48">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-2xl text-sm font-semibold"
                    >
                      {CATEGORIES[story.category]?.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold mb-2 line-clamp-2 text-[var(--text-primary)]"
                  >
                    {story.title}
                  </h3>
                  <p
                    className="mb-4 line-clamp-3 text-[var(--text-secondary)]"
                  >
                    {story.excerpt}
                  </p>
                  <div
                    className="flex items-center justify-between text-sm mb-4 text-[var(--text-secondary)]"
                  >
                    <span>{story.publishedAt.toLocaleDateString()}</span>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span>👁️ {story.viewCount}</span>
                      <span>❤️ {story.likes}</span>
                    </div>
                  </div>
                  <Link
                    to={`/stories/${story.id}`}
                    className="text-[var(--primary-color)] font-semibold"
                  >
                    اقرأ القصة كاملة →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-16 bg-[var(--background-color)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]"
            >
              ماذا يقول الناس
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              آراء المتبرعين والمتطوعين والمستفيدين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-6 shadow-lg bg-[var(--paper-color)] text-[var(--text-primary)] rounded-2xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 rtl:ml-4 object-cover"
                  />
                  <div>
                    <h4
                      className="font-semibold text-[var(--text-primary)]"
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-sm text-[var(--text-secondary)]"
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p
                  className="italic text-[var(--text-secondary)]"
                >
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-[var(--paper-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]"
            >
              شركاؤنا
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              نعمل مع منظمات موثوقة لتحقيق أقصى تأثير
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:shadow-lg transition-colors duration-200 bg-[var(--background-color)] rounded-2xl flex items-center justify-center p-6"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 opacity-60 hover:opacity-100 transition-opacity duration-200"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section
        className="py-16 bg-gradient-to-br from-[var(--secondary-color)] to-[var(--secondary-dark)]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            ابق على اطلاع
          </h2>
          <p className="text-xl mb-8 text-white">
            اشترك في نشرتنا الإخبارية لتصلك آخر الأخبار والتحديثات
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary-600"
              required
            />
            <button
              type="submit"
              className="bg-white text-[var(--secondary-color)] px-6 py-3 rounded-lg font-semibold"
            >
              اشتراك
            </button>
          </form>

          <p className="text-sm mt-4 text-white">
            نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي طرف ثالث.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
