import React, { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/488256335_9483793145034770_3893820036335481734_n.jpg";
import { Typography, useTheme, Button } from "@mui/material";
import HeroImageSlider from "../components/HeroImageSlider";
import ImpactStatisticsSection from "./home/ImpactStatisticsSection";
import HomeNavigation from "./home/HomeNavigation";
import HeroSection from "./home/HeroSection";
import EmergencyAlertBanner from "./home/EmergencyAlertBanner";

const HomePage = () => {
  const emergencyAlert = {
    message: "نداء عاجل: حاجة ماسة للمساعدات في منطقة السعاتة الدومة.",
  };
  return (
    <div className="min-h-screen  text-gray-800 dark:text-gray-200 relative">
      {/* <HomeNavigation /> */}
      <EmergencyAlertBanner alert={emergencyAlert} />
      {/* <HeroImageSlider /> */}
      <HeroSection />
      <ImpactStatisticsSection />
    </div>
  );
};

export default HomePage;
