import React, { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from '../assets/488256335_9483793145034770_3893820036335481734_n.jpg';
import { Typography, useTheme, Button } from '@mui/material';

const HeroSection = () => {
  const theme = useTheme();
  return (
    <div
      className="relative text-center flex flex-col items-center justify-center min-h-screen h-screen w-full px-4 -mt-14"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(13,5,5,0.7) 0%, rgba(0,0,0,0.5) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700/40 to-secondary-700/30 animate-pulse-slow z-0" />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center">
        <Typography variant="h1" sx={{ mb: 3, fontWeight: 800, color: theme.palette.common.white, textShadow: '0 4px 24px rgba(0,0,0,0.55), 0 1.5px 0 #000' }}>
          معاً نصنع الفرق
        </Typography>
        <Typography variant="h5" sx={{ mb: 5, color: theme.palette.common.white, fontWeight: 500, textShadow: '0 2px 12px rgba(0,0,0,0.45), 0 1px 0 #000' }}>
          نعمل يداً بيد لتقديم الدعم والإغاثة للأسر المتضررة في السعاتة الدومة. تبرعك يصنع أملاً جديداً.
        </Typography>
        <Button
          component={Link}
          to="/donate"
          color="primary"
          variant="contained"
          size="large"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.25rem' },
            px: 5,
            py: 2.5,
            borderRadius: 999,
            boxShadow: 3,
            mt: 2,
            textShadow: '0 1px 4px rgba(0,0,0,0.18)',
          }}
        >
          تبرع الآن
        </Button>
      </div>
      {/* Animated Scroll Down Hand Icon */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer hover:opacity-100 opacity-90 transition"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        tabIndex={0}
        role="button"
        aria-label="مرر للأسفل"
      >
        <span className="sr-only">مرر للأسفل</span>
        <svg
          className="w-10 h-10 text-white animate-bounce drop-shadow-lg"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.75 2.75a.75.75 0 00-1.5 0v8.19l-1.72-1.72a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V2.75z" />
          <path d="M4.75 15.25a.75.75 0 01.75-.75h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75z" />
        </svg>
      </div>
    </div>
  );
};

const EmergencyAlertBanner = ({ alert }) => {
  const [visible, setVisible] = useState(true);
  if (!alert || !visible) return null;
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-xl animate-fadeIn">
      <div className="bg-red-600/95 text-white rounded-2xl shadow-xl flex items-center justify-between px-6 py-4 gap-4 relative">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.15rem' } }}>
            {alert.message}
          </Typography>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 text-white/80 hover:text-white focus:outline-none"
          aria-label="إغلاق التنبيه"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const stats = [
  { label: "إجمالي التبرعات (SDG)", value: 7500000, icon: (
    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
  ) },
  { label: "أسرة مستفيدة", value: 1200, icon: (
    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 6v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a6 6 0 0112 0z" /></svg>
  ) },
  { label: "مشاريع نشطة", value: 5, icon: (
    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ) },
  { label: "متطوع", value: 85, icon: (
    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
  ) },
];

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const duration = 1200;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const increment = value / totalFrames;
    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(counter);
      } else {
        setDisplay(Math.ceil(start));
      }
    }, frameRate);
    return () => clearInterval(counter);
  }, [value]);
  return <span>{display.toLocaleString('ar-EG')}</span>;
};

const ImpactStatisticsSection = () => {
  const theme = useTheme();
    return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-5xl mx-auto px-4">
        <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: 5, color: theme.palette.primary.main }}>
          تأثيرنا
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 group"
            >
              <div className="mb-3 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1 }}>
                <AnimatedNumber value={stat.value} />
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </div>
          ))}
            </div>
        </div>
    </section>
);
};

const FacebookLink = () => (
  <div className="flex justify-center mt-10">
    <a
      href="https://www.facebook.com/groups/396995197043591/media"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg"
      aria-label="صفحة الفيسبوك"
    >
      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
      </svg>
      تابعنا على فيسبوك
                                </a>
                            </div>
);

const HomePage = () => {
  const emergencyAlert = { message: "نداء عاجل: حاجة ماسة للمساعدات في منطقة السعاتة الدومة." };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative">
      <EmergencyAlertBanner alert={emergencyAlert} />
      <HeroSection />
      <ImpactStatisticsSection />
      <FacebookLink />
    </div>
  );
};

export default HomePage;
