import React from "react";

const MEMBER_OFFICE_ROLE_AR = {
  president: "الرئيس",
  finance_manager: "الأمين المالي",
  communication_manager: "الأمين الإعلامي",
  consultant: "عضو استشاري",
  founding_member: "عضو مؤسس",
  honorary_member: "عضوية شرفية",
  member: "عضو",
};

const getMemberOfficeRoleColor = (role) => {
  switch (role) {
    case "president":
      return "bg-red-200 text-red-800 border-red-400";
    case "finance_manager":
      return "bg-green-200 text-green-800 border-green-400";
    case "communication_manager":
      return "bg-blue-200 text-blue-800 border-blue-400";
    case "consultant":
      return "bg-purple-200 text-purple-800 border-purple-400";
    case "founding_member":
      return "bg-yellow-200 text-yellow-800 border-yellow-400";
    case "honorary_member":
      return "bg-gray-200 text-gray-800 border-gray-400";
    case "member":
      return "bg-indigo-200 text-indigo-800 border-indigo-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function MemberOfficeRoleBadge({
  memberOfficeRole,
  className = "",
}) {
  if (!memberOfficeRole) return null;
  return (
    <span
      className={`ml-2 px-2 py-0.5 rounded-full border text-xs font-bold ${getMemberOfficeRoleColor(
        memberOfficeRole
      )} ${className}`}
      title={MEMBER_OFFICE_ROLE_AR[memberOfficeRole] || memberOfficeRole}
    >
      {MEMBER_OFFICE_ROLE_AR[memberOfficeRole] || memberOfficeRole}
    </span>
  );
}

export { MEMBER_OFFICE_ROLE_AR, getMemberOfficeRoleColor };
