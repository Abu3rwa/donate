import React, { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../constants";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Move translationKeys outside the component
const translationKeys = {
  ar: {
    // Navigation
    home: "الرئيسية",
    about: "من نحن",
    campaigns: "الحملات",
    stories: "القصص",
    donate: "تبرع",
    volunteer: "تطوع",
    impact: "التأثير",
    contact: "اتصل بنا",
    map: "الخريطة",
    dashboard: "لوحة التحكم",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",

    // Common
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    success: "تم بنجاح",
    cancel: "إلغاء",
    save: "حفظ",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض",
    more: "المزيد",
    less: "أقل",
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    submit: "إرسال",
    reset: "إعادة تعيين",

    // Forms
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    required: "مطلوب",
    optional: "اختياري",
    invalidEmail: "بريد إلكتروني غير صحيح",
    invalidPhone: "رقم هاتف غير صحيح",
    passwordMismatch: "كلمات المرور غير متطابقة",
    passwordTooShort: "كلمة المرور قصيرة جداً",

    // Donation
    donationAmount: "مبلغ التبرع",
    donationFrequency: "تكرار التبرع",
    oneTime: "مرة واحدة",
    monthly: "شهرياً",
    quarterly: "ربع سنوي",
    yearly: "سنوياً",
    customAmount: "مبلغ مخصص",
    anonymousDonation: "تبرع مجهول",
    dedicationMessage: "رسالة إهداء",
    taxReceipt: "إيصال ضريبي",
    paymentMethod: "طريقة الدفع",
    creditCard: "بطاقة ائتمان",
    paypal: "باي بال",
    bankTransfer: "تحويل بنكي",

    // Impact
    totalDonations: "إجمالي التبرعات",
    familiesHelped: "الأسر المساعدة",
    activeProjects: "المشاريع النشطة",
    emergencyResponses: "الاستجابات الطارئة",
    peopleHelped: "الأشخاص المساعدين",
    projectsCompleted: "المشاريع المكتملة",
    volunteers: "المتطوعين",
    partners: "الشركاء",

    // Categories
    emergency: "الإغاثة الطارئة",
    education: "التعليم",
    healthcare: "الرعاية الصحية",
    water: "المياه النظيفة",
    food: "الأمن الغذائي",
    shelter: "المأوى",
    livelihood: "سبل العيش",
    womenEmpowerment: "تمكين المرأة",
    children: "الأطفال",
    elderly: "رعاية المسنين",

    // Status
    pending: "قيد الانتظار",
    active: "نشط",
    completed: "مكتمل",
    paused: "متوقف مؤقتاً",
    draft: "مسودة",
    failed: "فشل",
    refunded: "مسترد",
    verified: "متحقق",
    rejected: "مرفوض",
    suspended: "معلق",
    inactive: "غير نشط",

    // Messages
    donationSuccess: "شكراً لك على تبرعك لأهالي السعاتة الدومة!",
    registrationSuccess: "تم التسجيل بنجاح!",
    loginSuccess: "تم تسجيل الدخول بنجاح!",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح!",
    messageSent: "تم إرسال الرسالة بنجاح!",
    volunteerApplied: "تم تقديم طلب التطوع بنجاح!",

    // Errors
    networkError: "خطأ في الشبكة. يرجى المحاولة مرة أخرى.",
    unauthorized: "غير مصرح لك بتنفيذ هذا الإجراء",
    notFound: "المورد المطلوب غير موجود",
    serverError: "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.",

    // App specific
    appName: "صدقة السعاتة الدومة",
    appDescription: "موقع خيري لمساعدة أهالي منطقة السعاتة الدومة",
    areaName: "السعاتة الدومة",
    regionName: "الخرطوم",
    countryName: "السودان",
  },
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  // Use translationKeys directly
  const translations = translationKeys;

  // Get translation
  const t = (key, params = {}) => {
    const translation = translations[currentLanguage]?.[key] || key;

    // Replace parameters in translation
    return Object.keys(params).reduce((str, param) => {
      return str.replace(`{${param}}`, params[param]);
    }, translation);
  };

  // Get current language
  const getCurrentLanguage = () => {
    return currentLanguage;
  };

  // Check if current language is Arabic
  const isArabic = () => {
    return currentLanguage === "ar";
  };

  // Get text direction
  const getDirection = () => {
    return "rtl";
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return Object.keys(LANGUAGES);
  };

  // Get language name
  const getLanguageName = (languageCode) => {
    const languageNames = {
      ar: "العربية",
    };
    return languageNames[languageCode] || languageCode;
  };

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || DEFAULT_LANGUAGE;
    setCurrentLanguage(savedLanguage);
  }, []);

  const value = {
    currentLanguage,
    translations,
    t,
    getCurrentLanguage,
    isArabic,
    getDirection,
    getAvailableLanguages,
    getLanguageName,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
