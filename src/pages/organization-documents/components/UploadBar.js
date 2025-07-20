import React from "react";
import CategoryDropdown from "./CategoryDropdown";
import { documentCategories } from "../utils/categories";

const UploadBar = ({
  selectedFile,
  onFileChange,
  uploadCategory,
  onUploadCategoryChange,
  onUpload,
  uploading,
  availableCategories,
}) => {
  const allCategories = React.useMemo(() => {
    return Array.from(new Set([...documentCategories, ...availableCategories]));
  }, [availableCategories]);

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 border-t pt-4">
      <div className="w-full sm:w-auto flex-grow">
        <input
          type="file"
          onChange={onFileChange}
          className="file-input"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="file-input-label">
          {selectedFile ? selectedFile.name : "اختر ملفًا للرفع"}
        </label>
      </div>
      <div className="w-full sm:w-48">
        <CategoryDropdown
          categories={allCategories}
          selectedCategory={uploadCategory}
          onChange={onUploadCategoryChange}
          aria-label="اختر فئة الرفع"
          disabled={uploading}
          defaultOption="اختر فئة..."
        />
      </div>
      <div className="w-full sm:w-auto">
        <button
          onClick={onUpload}
          className="button-primary w-full"
          disabled={!selectedFile || uploading}
        >
          {uploading ? "جاري الرفع..." : "رفع الملف"}
        </button>
      </div>
    </div>
  );
};

export default UploadBar;
