import React from "react";
import FileTypeIcon from "./FileTypeIcon";
import { formatDate } from "../utils/dateUtils";

const DocumentRow = ({ doc, onDeleteClick }) => (
  <tr className="border-t hover:bg-gray-50">
    <td className="py-3 px-4 flex items-center gap-3">
      <FileTypeIcon fileType={doc.name.split(".").pop()} />
      <span className="font-medium">{doc.name}</span>
    </td>
    <td className="py-3 px-4 text-gray-600">{doc.category || "غير مصنف"}</td>
    <td className="py-3 px-4 text-gray-600">{formatDate(doc.uploadDate)}</td>
    <td className="py-3 px-4 text-gray-600">{doc.uploadedBy}</td>
    <td className="py-3 px-4">
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-semibold"
      >
        تحميل
      </a>
      <button
        onClick={() => onDeleteClick(doc)}
        className="text-red-600 hover:underline font-semibold ml-4"
      >
        حذف
      </button>
    </td>
  </tr>
);

const DocumentTable = ({ documents, onDeleteClick }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-right">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 font-semibold text-gray-600">اسم الملف</th>
            <th className="py-3 px-4 font-semibold text-gray-600">الفئة</th>
            <th className="py-3 px-4 font-semibold text-gray-600">تاريخ الرفع</th>
            <th className="py-3 px-4 font-semibold text-gray-600">
              تم الرفع بواسطة
            </th>
            <th className="py-3 px-4 font-semibold text-gray-600">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onDeleteClick={onDeleteClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
