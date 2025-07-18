import React, { useEffect, useState } from "react";
import { Typography, useTheme, CircularProgress } from "@mui/material";
import { db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const statIcons = [
  <svg
    className="w-8 h-8 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>,
  <svg
    className="w-8 h-8 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 6v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a6 6 0 0112 0z"
    />
  </svg>,
  <svg
    className="w-8 h-8 text-yellow-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>,
  <svg
    className="w-8 h-8 text-purple-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>,
];

const statLabels = [
  "إجمالي التبرعات (SDG)",
  "المستفيدون",
  "حملات نشطة",
  "متطوع",
];

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
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
  return <span>{display.toLocaleString("en-US")}</span>;
};

const ImpactStatisticsSection = () => {
  const theme = useTheme();
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // 1. Total Donations
      let totalDonations = 0;
      let familySet = new Set();
      const donationsSnap = await getDocs(
        query(collection(db, "donations"), where("status", "==", "completed"))
      );
      donationsSnap.forEach((doc) => {
        const data = doc.data();
        let amount = data.amount;
        if (typeof amount === "string") amount = parseFloat(amount);
        if (!isNaN(amount)) totalDonations += amount;
        if (data.donorId) familySet.add(data.donorId);
        else if (data.createdBy) familySet.add(data.createdBy);
      });
      // 2. Beneficiary Families
      const beneficiaries = familySet.size;
      // 3. Projects (now: all campaigns)
      let activeProjects = 0;
      const campaignsSnap = await getDocs(collection(db, "campaigns"));
      activeProjects = campaignsSnap.size;
      // 4. Volunteers (now: all users)
      let volunteers = 0;
      const usersSnap = await getDocs(collection(db, "users"));
      volunteers = usersSnap.size;
      setStats([
        Math.round(totalDonations),
        beneficiaries,
        activeProjects,
        volunteers,
      ]);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <section className="py-10 sm:py-16 bg-transparent">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 5,
            color: theme.palette.primary.main,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          تأثيرنا
        </Typography>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress color="primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={statLabels[i]}
                className="bg-white/80 dark:bg-gray-700/80 rounded-2xl shadow-lg p-5 sm:p-8 flex flex-col items-center hover:scale-105 transition-transform duration-200 group min-w-0"
              >
                <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
                  {statIcons[i]}
                </div>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    mb: 1,
                    fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  <AnimatedNumber value={stat} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {statLabels[i]}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactStatisticsSection;
