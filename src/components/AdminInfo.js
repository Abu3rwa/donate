import React from "react";
import "../styles/Receipt.css";

const AdminInfo = ({ adminInfo, className = "" }) => {
  if (!adminInfo) return null;

  return (
    <div className={`receipt-section-box ${className}`} dir="rtl">
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
        معلومات المسؤول
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          className="item"
          style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
        >
          <strong
            style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
          >
            اسم المسؤول:
          </strong>
          <span style={{ flex: 1, color: "#6c757d" }}>
            {adminInfo.name || "غير متوفر"}
          </span>
        </div>
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
            {adminInfo.email || "غير متوفر"}
          </span>
        </div>
        <div
          className="item"
          style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
        >
          <strong
            style={{ color: "#495057", minWidth: "120px", fontWeight: 600 }}
          >
            الدور:
          </strong>
          <span style={{ flex: 1, color: "#6c757d" }}>
            {adminInfo.role || "غير متوفر"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
