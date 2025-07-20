import React, { useState } from "react";
import { Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EmergencyAlertBanner = ({ alert }) => {
  const [visible, setVisible] = useState(true);
  if (!alert || !visible) return null;
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-xl animate-fadeIn">
      <div className="bg-red-600/95 text-white rounded-2xl shadow-xl flex items-center justify-between px-6 py-4 gap-4 relative">
        <div className="flex items-center gap-3">
          <svg
            className="w-10 h-10 animate-pulse"
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
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.15rem" },
              color: "white",
            }}
          >
            {alert.message}
          </Typography>
        </div>
        {/* Material UI Close Icon as clickable span, no button */}
        <span
          onClick={() => setVisible(false)}
          className="ml-2 text-white/80 hover:text-white cursor-pointer select-none"
          aria-label="إغلاق التنبيه"
          style={{ display: "flex", alignItems: "center" }}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setVisible(false);
          }}
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </span>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;
