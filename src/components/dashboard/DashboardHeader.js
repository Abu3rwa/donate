import React, { useState, useEffect } from "react";
import { getOrgInfo } from "../../services/orgInfoService";

const DashboardHeader = ({ user }) => {
  const [orgInfo, setOrgInfo] = useState({});
  useEffect(() => {
    const fetchOrg = async () => {
      const info = await getOrgInfo();
      setOrgInfo(info || {});
    };
    fetchOrg();
  }, []);
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        padding: "10px",
        background: "#f8f9fa",
        borderBottom: "2px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(25,135,84,0.04)",
        marginBottom: 24,
        fontFamily:
          "'Tajawal', 'Cairo', 'Alexandria', 'Amiri', 'DM Serif Text', Tahoma, Arial, sans-serif",
      }}
    >
      <a
        href="/dashboard"
        style={{
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
          {orgInfo?.longName}
        </div>
      </a>
    </header>
  );
};

export default DashboardHeader;
