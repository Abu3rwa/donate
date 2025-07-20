import React from "react";
import { Typography, useTheme, Button } from "@mui/material";
import { Link } from "react-router-dom";
import HeroImageSlider from "../../components/HeroImageSlider";

// SVG pattern for background (subtle waves)
const SvgPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full z-10 opacity-30 pointer-events-none"
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      fill="#60a5fa"
      fillOpacity="0.12"
      d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    />
    <circle cx="1200" cy="60" r="80" fill="#3b82f6" fillOpacity="0.08" />
    <circle cx="300" cy="200" r="120" fill="#2563eb" fillOpacity="0.07" />
  </svg>
);

const HeroSection = () => {
  const theme = useTheme();
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fullscreen Image/Slider */}
      <div className="absolute inset-0 z-0">
        <HeroImageSlider />
      </div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-500/80 via-cyan-400/60 to-emerald-400/80" />
      {/* SVG Pattern Background */}
      <SvgPattern />
      {/* Semi-transparent dark overlay for text contrast */}
      {/* <div className="absolute inset-0 bg-black/50 z-20" /> */}
      {/* Content */}
      <div className="relative z-30 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-2 sm:px-0 py-10 sm:py-20">
        <Typography
          variant="h1"
          sx={{
            mb: 3,
            fontWeight: 800,
            color: theme.palette.common.white,
            textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 1.5px 0 #000",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          معاً نصنع الفرق
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 5,
            color: theme.palette.common.white,
            fontWeight: 500,
            textShadow: "0 2px 12px rgba(0,0,0,0.45), 0 1px 0 #000",
            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
          }}
        >
          نعمل يداً بيد لتقديم الدعم والإغاثة للأسر المتضررة في السعاتة الدومة.
          تبرعك يصنع أملاً جديداً.
        </Typography>
        <Button
          component={Link}
          to="/donate"
          color="success"
          variant="contained"
          size="large"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            px: { xs: 4, sm: 7 },
            py: { xs: 2, sm: 3 },
            borderRadius: 999,
            boxShadow: 6,
            mt: 3,
            textShadow: "0 1px 4px rgba(0,0,0,0.18)",
            background: "linear-gradient(90deg, #34d399 0%, #06b6d4 100%)",
            color: "#fff",
            transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
            "&:hover": {
              filter: "brightness(1.15)",
              transform: "scale(1.05)",
              background: "linear-gradient(90deg, #06b6d4 0%, #34d399 100%)",
              boxShadow: 10,
            },
          }}
        >
          تبرع الآن
        </Button>
      </div>
      {/* Animated Scroll Down Hand Icon */}
      <div
        className="absolute bottom-16 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center cursor-pointer hover:opacity-100 opacity-90 transition"
        onClick={() =>
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
        }
        tabIndex={0}
        role="button"
        aria-label="مرر للأسفل"
      >
        <span className="sr-only">مرر للأسفل</span>
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce drop-shadow-lg"
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

export default HeroSection;
