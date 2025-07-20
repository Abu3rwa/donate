import React, { useState, useEffect } from "react";
import { getOrgInfo } from "../../services/orgInfoService";

const DashboardHeader = ({ onMenuClick, user, logout, hasPermission }) => {
  const [orgInfo, setOrgInfo] = useState({});
  useEffect(() => {
    const fetchOrg = async () => {
      const info = await getOrgInfo();
      setOrgInfo(info || {});
    };
    fetchOrg();
  }, []);
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[var(--paper-color)] border-b border-[var(--divider)] shadow-sm sticky top-0 z-30">
      {/* Hamburger menu for mobile */}

      <a
        href="/dashboard"
        style={{
          maxWidth: "200px",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {orgInfo?.logo && (
              <img
                src={orgInfo.logo}
                alt="شعار الجمعية"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#198754",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              {orgInfo?.name || "اسم الجمعية"}
            </h1>
          </div>
          <small>{orgInfo?.longName}</small>
        </div>
      </a>
      <button
        className="lg:hidden p-2 text-gray-700 dark:text-gray-200"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </header>
  );
};

export default DashboardHeader;
