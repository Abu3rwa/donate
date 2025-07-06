// App Configuration
export const APP_CONFIG = {
  name: "صدقة السعاتة الدومة",
  nameEn: "Assaatah Al-Doma Charity",
  version: "1.0.0",
  description: "موقع خيري لمساعدة أهالي منطقة السعاتة الدومة",
  descriptionEn: "Charity website to help the people of Assaatah Al-Doma area",
  url: process.env.REACT_APP_APP_URL || "http://localhost:3000",
  apiUrl: process.env.REACT_APP_API_URL || "https://api.assaatah.org",
  supportEmail: "support@assaatah.org",
  contactPhone: "+249 123 456 789",
  area: "السعاتة الدومة",
  areaEn: "Assaatah Al-Doma",
  location: {
    name: "السعاتة الدومة",
    nameEn: "Assaatah Al-Doma",
    coordinates: [15.5007, 32.5599], // Approximate coordinates for the area
    region: "الخرطوم",
    regionEn: "Khartoum",
    country: "السودان",
    countryEn: "Sudan",
  },
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  bankak: {
    name: "Bankak (Bank of Khartoum)",
    info: "Use Bankak app or Bank of Khartoum for payment.",
  },
  sudaneseApp: {
    name: "Sudanese Payment App",
    info: "Use a supported Sudanese payment app.",
  },
  cash: {
    name: "Cash",
    info: "Pay in cash at our office or to an authorized representative.",
  },
};

// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: [15.5007, 32.5599], // Assaatah Al-Doma area
  defaultZoom: 12, // Closer zoom for local area
  maxZoom: 18,
  minZoom: 10, // Higher minimum zoom for local focus
  tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "© OpenStreetMap contributors",
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  focusArea: {
    name: "السعاتة الدومة",
    nameEn: "Assaatah Al-Doma",
    bounds: [
      [15.45, 32.5], // Southwest
      [15.55, 32.6], // Northeast
    ],
    center: [15.5007, 32.5599],
  },
};

// Categories and Types
export const CATEGORIES = {
  EMERGENCY: "emergency",
  EDUCATION: "education",
  HEALTHCARE: "healthcare",
  WATER: "water",
  FOOD: "food",
  SHELTER: "shelter",
  VOLUNTEER: "volunteer",
};

export const CATEGORIES_AR = {
  emergency: "الإغاثة الطارئة",
  education: "التعليم",
  healthcare: "الرعاية الصحية",
  water: "المياه النظيفة",
  food: "الأمن الغذائي",
  shelter: "المأوى",
  volunteer: "التطوع",
};

export const DONATION_FREQUENCIES = {
  ONE_TIME: "one-time",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
};

export const DONATION_FREQUENCIES_AR = {
  "one-time": "مرة واحدة",
  monthly: "شهرياً",
  quarterly: "ربع سنوي",
  yearly: "سنوياً",
};

export const PAYMENT_METHODS = {
  BANKAK: "bankak",
  SUDANESE_APP: "sudaneseApp",
  CASH: "cash",
};

export const PAYMENT_METHODS_AR = {
  bankak: "بنكك (بنك الخرطوم)",
  sudaneseApp: "تطبيق دفع سوداني",
  cash: "نقدًا",
};

export const USER_ROLES = {
  DONOR: "donor",
  VOLUNTEER: "volunteer",
  ADMIN: "admin",
  BENEFICIARY: "beneficiary",
};

export const USER_ROLES_AR = {
  donor: "متبرع",
  volunteer: "متطوع",
  admin: "مدير",
  beneficiary: "مستفيد",
};

export const STATUS_TYPES = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  PAUSED: "paused",
  DRAFT: "draft",
  FAILED: "failed",
  REFUNDED: "refunded",
  VERIFIED: "verified",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
  INACTIVE: "inactive",
};

export const STATUS_TYPES_AR = {
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
};

// Local Areas within Assaatah Al-Doma
export const LOCAL_AREAS = [
  {
    id: "assaatah-center",
    name: "وسط السعاتة",
    nameEn: "Assaatah Center",
    coordinates: [15.5007, 32.5599],
  },
  {
    id: "al-doma",
    name: "الدومة",
    nameEn: "Al-Doma",
    coordinates: [15.51, 32.56],
  },
  {
    id: "al-nahda",
    name: "النهضة",
    nameEn: "Al-Nahda",
    coordinates: [15.49, 32.55],
  },
  {
    id: "al-salam",
    name: "السلام",
    nameEn: "Al-Salam",
    coordinates: [15.52, 32.57],
  },
  {
    id: "al-aman",
    name: "الأمان",
    nameEn: "Al-Aman",
    coordinates: [15.48, 32.54],
  },
  {
    id: "al-karama",
    name: "الكرامة",
    nameEn: "Al-Karama",
    coordinates: [15.53, 32.58],
  },
];

// Impact Areas specific to Assaatah Al-Doma
export const IMPACT_AREAS = [
  {
    id: "emergency-relief",
    name: "الإغاثة الطارئة",
    nameEn: "Emergency Relief",
    icon: "🚨",
  },
  { id: "education", name: "التعليم", nameEn: "Education", icon: "📚" },
  {
    id: "healthcare",
    name: "الرعاية الصحية",
    nameEn: "Healthcare",
    icon: "🏥",
  },
  {
    id: "clean-water",
    name: "المياه النظيفة",
    nameEn: "Clean Water",
    icon: "💧",
  },
  {
    id: "food-security",
    name: "الأمن الغذائي",
    nameEn: "Food Security",
    icon: "🍽️",
  },
  { id: "shelter", name: "المأوى", nameEn: "Shelter", icon: "🏠" },
  { id: "livelihood", name: "سبل العيش", nameEn: "Livelihood", icon: "💼" },
  {
    id: "women-empowerment",
    name: "تمكين المرأة",
    nameEn: "Women Empowerment",
    icon: "👩‍💼",
  },
  { id: "children", name: "الأطفال", nameEn: "Children", icon: "👶" },
  { id: "elderly", name: "رعاية المسنين", nameEn: "Elderly Care", icon: "👴" },
];

// Navigation
export const NAVIGATION = {
  HOME: "/",
  ABOUT: "/about",
  CAMPAIGNS: "/campaigns",
  STORIES: "/stories",
  DONATE: "/donate",
  VOLUNTEER: "/volunteer",
  IMPACT: "/impact",
  CONTACT: "/contact",
  MAP: "/map",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
};

export const NAVIGATION_AR = {
  HOME: "الرئيسية",
  ABOUT: "من نحن",
  CAMPAIGNS: "الحملات",
  STORIES: "القصص",
  DONATE: "تبرع",
  VOLUNTEER: "تطوع",
  IMPACT: "التأثير",
  CONTACT: "اتصل بنا",
  MAP: "الخريطة",
  DASHBOARD: "لوحة التحكم",
  LOGIN: "تسجيل الدخول",
  REGISTER: "إنشاء حساب",
};

// Social Media
export const SOCIAL_MEDIA = {
  facebook: "https://facebook.com/assaatah",
  twitter: "https://twitter.com/assaatah",
  instagram: "https://instagram.com/assaatah",
  youtube: "https://youtube.com/assaatah",
  linkedin: "https://linkedin.com/company/assaatah",
};

// Contact Information
export const CONTACT_INFO = {
  email: "info@assaatah.org",
  phone: "+249 123 456 789",
  address: "السعاتة الدومة، الخرطوم، السودان",
  addressEn: "Assaatah Al-Doma, Khartoum, Sudan",
  workingHours: "الأحد - الخميس: 9:00 ص - 6:00 م",
  workingHoursEn: "Sunday - Thursday: 9:00 AM - 6:00 PM",
  emergencyContact: "+249 911 123 456",
  localOffice: "مكتب السعاتة الدومة",
  localOfficeEn: "Assaatah Al-Doma Office",
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === "true",
  ENABLE_OFFLINE_MODE: process.env.REACT_APP_ENABLE_OFFLINE_MODE === "true",
  ENABLE_PWA: process.env.REACT_APP_ENABLE_PWA === "true",
  USE_EMULATORS: process.env.REACT_APP_USE_EMULATORS === "true",
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === "true",
};

// Localization - Arabic only
export const LANGUAGES = {
  AR: "ar",
};

export const DEFAULT_LANGUAGE = LANGUAGES.AR;

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#CE1126", // Sudan red
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    secondary: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#FF6B35", // Hope orange
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#2C3E50",
    },
    status: {
      success: "#27AE60",
      warning: "#F7931E",
      error: "#E74C3C",
      info: "#4A90E2",
    },
  },
  fonts: {
    sans: ["Inter", "system-ui", "sans-serif"],
    arabic: ["Noto Sans Arabic", "Arial", "sans-serif"],
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  donation: {
    minAmount: 1,
    maxAmount: 1000000,
  },
};

// Error Messages - Arabic only
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "هذا الحقل مطلوب",
  INVALID_EMAIL: "يرجى إدخال عنوان بريد إلكتروني صحيح",
  INVALID_PHONE: "يرجى إدخال رقم هاتف صحيح",
  PASSWORD_TOO_SHORT: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
  PASSWORD_MISMATCH: "كلمات المرور غير متطابقة",
  INVALID_AMOUNT: "يرجى إدخال مبلغ صحيح",
  NETWORK_ERROR: "خطأ في الشبكة. يرجى المحاولة مرة أخرى.",
  UNAUTHORIZED: "غير مصرح لك بتنفيذ هذا الإجراء",
  NOT_FOUND: "المورد المطلوب غير موجود",
  SERVER_ERROR: "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.",
};

// Success Messages - Arabic only
export const SUCCESS_MESSAGES = {
  DONATION_SUCCESS: "شكراً لك على تبرعك لأهالي السعاتة الدومة!",
  REGISTRATION_SUCCESS: "تم التسجيل بنجاح!",
  LOGIN_SUCCESS: "تم تسجيل الدخول بنجاح!",
  PROFILE_UPDATED: "تم تحديث الملف الشخصي بنجاح!",
  MESSAGE_SENT: "تم إرسال الرسالة بنجاح!",
  VOLUNTEER_APPLIED: "تم تقديم طلب التطوع بنجاح!",
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  MAX_FILES: 10,
};

// Cache Configuration
export const CACHE_CONFIG = {
  STORIES_TTL: 5 * 60 * 1000, // 5 minutes
  CAMPAIGNS_TTL: 10 * 60 * 1000, // 10 minutes
  STATISTICS_TTL: 30 * 60 * 1000, // 30 minutes
  USER_DATA_TTL: 60 * 60 * 1000, // 1 hour
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  DONATIONS: {
    CREATE: "/donations",
    LIST: "/donations",
    GET: "/donations/:id",
    UPDATE: "/donations/:id",
    DELETE: "/donations/:id",
  },
  CAMPAIGNS: {
    LIST: "/campaigns",
    GET: "/campaigns/:id",
    CREATE: "/campaigns",
    UPDATE: "/campaigns/:id",
    DELETE: "/campaigns/:id",
  },
  STORIES: {
    LIST: "/stories",
    GET: "/stories/:id",
    CREATE: "/stories",
    UPDATE: "/stories/:id",
    DELETE: "/stories/:id",
  },
  VOLUNTEERS: {
    LIST: "/volunteers",
    GET: "/volunteers/:id",
    APPLY: "/volunteers/apply",
    UPDATE: "/volunteers/:id",
  },
  STATISTICS: {
    OVERVIEW: "/statistics/overview",
    IMPACT: "/statistics/impact",
    DONATIONS: "/statistics/donations",
  },
  MAP: {
    OPERATIONS: "/map/operations",
    CENTERS: "/map/centers",
    LOCAL_AREAS: "/map/local-areas",
  },
};

const constants = {
  APP_CONFIG,
  FIREBASE_CONFIG,
  PAYMENT_CONFIG,
  MAP_CONFIG,
  CATEGORIES,
  CATEGORIES_AR,
  DONATION_FREQUENCIES,
  DONATION_FREQUENCIES_AR,
  PAYMENT_METHODS,
  PAYMENT_METHODS_AR,
  USER_ROLES,
  USER_ROLES_AR,
  STATUS_TYPES,
  STATUS_TYPES_AR,
  LOCAL_AREAS,
  IMPACT_AREAS,
  NAVIGATION,
  NAVIGATION_AR,
  SOCIAL_MEDIA,
  CONTACT_INFO,
  FEATURE_FLAGS,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  THEME_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  PAGINATION,
  FILE_UPLOAD,
  CACHE_CONFIG,
  API_ENDPOINTS,
};

export default constants;
