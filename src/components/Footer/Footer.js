import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

import {
  APP_CONFIG,
  SOCIAL_MEDIA,
  CONTACT_INFO,
} from "../../constants";

const Footer = () => {
  const { isArabic } = useLanguage();

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "عن المنظمة",
      links: [
        { name: "من نحن", href: "/about" },
        { name: "مهمتنا", href: "/about#mission" },
        { name: "فريق العمل", href: "/about#team" },
        {
          name: "الشهادات",
          href: "/about#certificates",
        },
      ],
    },
    {
      title: "عملنا",
      links: [
        {
          name: "الإغاثة الطارئة",
          href: "/campaigns?category=emergency",
        },
        {
          name: "التعليم",
          href: "/campaigns?category=education",
        },
        {
          name: "الرعاية الصحية",
          href: "/campaigns?category=healthcare",
        },
        {
          name: "المياه النظيفة",
          href: "/campaigns?category=water",
        },
      ],
    },
    {
      title: "المساعدة",
      links: [
        { name: "تبرع الآن", href: "/donate" },
        { name: "تطوع معنا", href: "/volunteer" },
        {
          name: "كن شريكاً",
          href: "/contact",
        },
        {
          name: "انشر الكلمة",
          href: "/stories",
        },
      ],
    },
    {
      title: "الشفافية",
      links: [
        {
          name: "التقارير المالية",
          href: "/transparency#financial",
        },
        { name: "تأثيرنا", href: "/impact" },
        {
          name: "المراجعة",
          href: "/transparency#audit",
        },
        {
          name: "الشفافية",
          href: "/transparency",
        },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ص</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {APP_CONFIG.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {APP_CONFIG.description}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              نحن منظمة خيرية مكرسة لمساعدة أهالي منطقة السعاتة الدومة في الخرطوم،
              السودان. نعمل على توفير الإغاثة الطارئة والتعليم والرعاية الصحية
              والمياه النظيفة للمحتاجين.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span dir="ltr">{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                © {currentYear} {APP_CONFIG.name}.{" "}
                جميع الحقوق محفوظة.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                تابعنا على:
              </span>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <a
                  href={SOCIAL_MEDIA.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_MEDIA.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_MEDIA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_MEDIA.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start space-x-6 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                <Link
                  to="/privacy"
                  className="hover:text-primary-500 transition-colors duration-200"
                >
                  {isArabic() ? "سياسة الخصوصية" : "Privacy Policy"}
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-primary-500 transition-colors duration-200"
                >
                  {isArabic() ? "شروط الاستخدام" : "Terms of Service"}
                </Link>
                <Link
                  to="/cookies"
                  className="hover:text-primary-500 transition-colors duration-200"
                >
                  {isArabic() ? "ملفات تعريف الارتباط" : "Cookies Policy"}
                </Link>
                <Link
                  to="/accessibility"
                  className="hover:text-primary-500 transition-colors duration-200"
                >
                  {isArabic() ? "إمكانية الوصول" : "Accessibility"}
                </Link>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isArabic()
                  ? "مطور بواسطة فريق السعاتة الدومة"
                  : "Developed by Assaatah Al-Doma Team"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
