// OrgInfo.js
import React from "react";
import tempLogo from "../assets/tempLogo.png";
import "../styles/Receipt.css";

const OrgInfo = ({ orgInfo, showLogo = true, className = "" }) => {
  if (!orgInfo) return null;

  const logoUrl = orgInfo.logo || tempLogo;
  const orgName = orgInfo.name || "اسم الجمعية";
  const longName = orgInfo.longName || "";
  const registrationNumber = orgInfo.registrationNumber || "";
  const orgDescription = orgInfo.description || "";
  const orgLocation = orgInfo.location || "";
  const website = orgInfo.website || "";
  const phones = orgInfo.contacts?.phones || [];
  const emails = orgInfo.contacts?.emails || [];
  const socials = orgInfo.social || [];

  return (
    <div className={`receipt-section-box ${className}`} dir="rtl">
      {showLogo && (
        <div
          className="receipt-logo-section"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            padding: "16px 0",
            borderBottom: "2px solid #e9ecef",
          }}
        >
          <img
            src={logoUrl}
            alt="شعار الجمعية"
            className="receipt-logo"
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              border: "3px solid #198754",
              marginLeft: 20,
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(25,135,84,0.15)",
            }}
          />
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "1.75rem",
                color: "#198754",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: 4,
              }}
            >
              {orgName}
            </h1>
            {longName && (
              <p
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  color: "#6c757d",
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {longName}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        className="receipt-section-title"
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#198754",
          marginBottom: 20,
          padding: "0 0 8px 0",
          borderBottom: "2px solid #198754",
        }}
      >
        عن الجمعية
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {longName && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              الاسم الكامل:
            </strong>
            <span style={{ flex: 1, color: "#6c757d" }}>{longName}</span>
          </div>
        )}
        {registrationNumber && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              رقم التسجيل:
            </strong>
            <span style={{ flex: 1, color: "#6c757d" }}>
              {registrationNumber}
            </span>
          </div>
        )}
        {orgDescription && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              الوصف:
            </strong>
            <span style={{ flex: 1, color: "#6c757d", lineHeight: 1.5 }}>
              {orgDescription}
            </span>
          </div>
        )}
        {orgLocation && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              الموقع:
            </strong>
            <span style={{ flex: 1, color: "#6c757d" }}>{orgLocation}</span>
          </div>
        )}
        {phones.length > 0 && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              الهاتف:
            </strong>
            <span
              style={{
                flex: 1,
                color: "#6c757d",
                direction: "ltr",
                textAlign: "right",
              }}
            >
              {phones.join(" | ")}
            </span>
          </div>
        )}
        {emails.length > 0 && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              البريد الإلكتروني:
            </strong>
            <span
              style={{
                flex: 1,
                color: "#6c757d",
                direction: "ltr",
                textAlign: "right",
              }}
            >
              {emails.join(" | ")}
            </span>
          </div>
        )}
        {website && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              الموقع الإلكتروني:
            </strong>
            <a
              href={website}
              className="receipt-link"
              style={{
                flex: 1,
                color: "#198754",
                textDecoration: "none",
                fontWeight: 500,
                direction: "ltr",
                textAlign: "right",
              }}
            >
              {website}
            </a>
          </div>
        )}
        {socials.length > 0 && (
          <div
            className="item"
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <strong
              style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
            >
              روابط التواصل:
            </strong>
            <div
              style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "8px" }}
            >
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  className="receipt-link"
                  style={{
                    color: "#198754",
                    textDecoration: "none",
                    fontWeight: 500,
                    padding: "4px 8px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    border: "1px solid #e9ecef",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgInfo;
