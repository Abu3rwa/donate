import React from "react";
import FileTypeIcon from "./FileTypeIcon";
import { formatDate } from "../utils/dateUtils";

const DocumentCard = ({ doc, onDeleteClick }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-transform transform hover:scale-105">
    <div className="flex items-center mb-3">
      <FileTypeIcon fileType={doc.name.split(".").pop()} />
      <h3 className="font-bold text-gray-800 mr-3 truncate">{doc.name}</h3>
    </div>
    <div className="text-sm text-gray-500 space-y-1">
      <p>
        <strong>الفئة:</strong> {doc.category || "غير مصنف"}
      </p>
      <p>
        <strong>تاريخ الرفع:</strong> {formatDate(doc.uploadDate)}
      </p>
      <p>
        <strong>تم الرفع بواسطة:</strong> {doc.uploadedBy}
      </p>
    </div>
    <div className="mt-4 flex justify-end gap-2">
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline px-3 py-1 rounded-md bg-blue-100 text-sm"
      >
        تحميل
      </a>
      <button
        onClick={() => onDeleteClick(doc)}
        className="text-red-600 hover:underline px-3 py-1 rounded-md bg-red-100 text-sm"
      >
        حذف
      </button>
    </div>
  </div>
);

export default DocumentCard;
