import React from "react";
import { ADMIN_PERMISSIONS } from "../../contexts/AuthContext";

const ExportFooter = ({ orgInfo, user }) => {
  const socialLinks = orgInfo?.social || [];
  const phones = orgInfo?.contacts?.phones || [];
  const emails = orgInfo?.contacts?.emails || [];
  const name = user?.displayName || user?.name || "-";
  const email = user?.email || "-";
  const phone = user?.phone || "-";
  const roleInArabic = user?.adminType
    ? ADMIN_PERMISSIONS[user.adminType]?.name || user?.role || "-"
    : user?.role || "-";

  return (
    <div
      className="footer"
      style={{
        marginTop: "30px",
        paddingTop: "20px",
        marginBottom: "50px",
        borderTop: "2px solid #198754",
        textAlign: "center",
        fontSize: "14px",
        color: "#6c757d",
      }}
    >
      {user && (
        <div
          style={{
            marginTop: "5px",
            fontSize: "13px",
            color: "gray",
            textAlign: "center",
            background: "#f8f9fa",
            borderRadius: "8px",
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
            direction: "rtl",
            minWidth: "220px",
            marginBottom: "30px",
            minHeight: "56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span style={{ color: "#198754", fontWeight: 600, marginLeft: 4 }}>
              صُدِّر بواسطة:
            </span>
            {name || "-"} /{" "}
            <span style={{ color: "#198754", fontWeight: 600, marginLeft: 4 }}>
              {roleInArabic}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span style={{ color: "#198754", marginLeft: 4 }}>
              البريد الإلكتروني:
            </span>
            {email || "-"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span style={{ color: "#198754", marginLeft: 4 }}>رقم الجوال:</span>
            {phone || "-"}
          </div>
        </div>
      )}
      <p style={{ margin: "10px 0", fontWeight: "600", color: "#198754" }}>
        شكراً لدعمكم. تبرعكم يصنع فرقاً.
      </p>
      <div>
        {orgInfo?.name && (
          <span style={{ margin: "0 10px" }}>{orgInfo.name}</span>
        )}
        {emails.length > 0 && (
          <span style={{ margin: "0 10px", direction: "ltr" }}>
            {emails.join(" | ")}
          </span>
        )}
        {phones.length > 0 && (
          <span style={{ margin: "0 10px", direction: "ltr" }}>
            {phones.join(" | ")}
          </span>
        )}
      </div>
      {socialLinks.length > 0 && (
        <div>
          {socialLinks.map((social, idx) => (
            <a
              key={social?.link || social?.url || idx}
              href={social.url}
              style={{
                margin: "0 10px",
                color: "#198754",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              {social.url}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportFooter;
