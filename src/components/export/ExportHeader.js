import React, { useState, useEffect } from "react";
import tempLogo from "../../assets/tempLogo.png";
import getBase64Image from "../../helpers/getBase64Image";

const ExportHeader = ({ orgInfo }) => {
  const [orgLogo, setOrgLogo] = useState(tempLogo);
  const orgName = orgInfo?.name || "اسم الجمعية";
  const orgLongName = orgInfo?.longName || "";

  useEffect(() => {
    let isMounted = true;
    const loadLogo = async () => {
      if (orgInfo?.logo) {
        try {
          const base64 = await getBase64Image(orgInfo.logo);
          if (isMounted) setOrgLogo(base64 || tempLogo);
        } catch {
          if (isMounted) setOrgLogo(tempLogo);
        }
      } else {
        setOrgLogo(tempLogo);
      }
    };
    loadLogo();
    return () => {
      isMounted = false;
    };
  }, [orgInfo?.logo]);

  const now = new Date();
  const currentDate = now.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="export-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
        padding: "24px 32px",
        borderBottom: "3px solid #198754",
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        direction: "rtl",
        minHeight: 120,
        position: "relative",
      }}
    >
      {/* Left side - Logo and Organization Info */}
      <div
        className="export-header-left"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          className="export-header-logo"
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {orgLogo && (
            <img
              src={orgLogo}
              alt="شعار الجمعية"
              crossOrigin="anonymous"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "2px solid #198754",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(25,135,84,0.2)",
                background: "#fff",
              }}
              onError={(e) => {
                e.target.src = tempLogo;
              }}
            />
          )}
        </div>

        <div
          className="export-header-info"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            className="export-header-org-name"
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#198754",
              lineHeight: 1.2,
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {orgName}
          </div>
          {orgLongName && (
            <div
              className="export-header-org-longname"
              style={{
                fontSize: "1rem",
                color: "#6c757d",
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {orgLongName}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Date and Time */}
      <div
        className="export-header-datetime"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flexShrink: 0,
          gap: "8px",
          padding: "12px 16px",
          background: "rgba(25,135,84,0.05)",
          borderRadius: "8px",
          border: "1px solid rgba(25,135,84,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "0.85rem",
            color: "#198754",
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          {`\u202Bتاريخ الإصدار\u202C`}
        </div>
        <div
          style={{
            fontSize: "1.1rem",
            color: "#198754",
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: "8px",
            direction: "rtl",
          }}
        >
          {currentDate}
        </div>
      </div>
    </div>
  );
};

export default ExportHeader;
