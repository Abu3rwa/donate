import React from "react";

// Mock file type icons - in a real app, you might use an icon library
const FileTypeIcon = ({ fileType }) => {
  const iconMap = {
    pdf: "📄",
    docx: "📝",
    xlsx: "📊",
    png: "🖼️",
    jpg: "🖼️",
    default: "📁",
  };
  const icon =
    iconMap[fileType] || iconMap[fileType.toLowerCase()] || iconMap.default;
  return <span className="text-2xl">{icon}</span>;
};

export default FileTypeIcon;
