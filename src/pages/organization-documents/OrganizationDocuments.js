import React, { useState } from "react";
import { useOrgDocuments } from "./hooks/useOrgDocuments";
import { useNotification } from "../../contexts/NotificationContext";

import SearchBar from "./components/SearchBar";
import CategoryDropdown from "./components/CategoryDropdown";
import UploadBar from "./components/UploadBar";
import DocumentCard from "./components/DocumentCard";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

import { fileTypeDisplayOrder } from "./utils/categories";

export default function OrganizationDocuments() {
  const { showSuccess, showError } = useNotification();
  const {
    loading,
    uploading,
    search,
    setSearch,
    category,
    setCategory,
    categories,
    groupedDocs,
    filteredDocs,
    handleUpload,
    handleDelete,
  } = useOrgDocuments(showSuccess, showError);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("");
  const [docToDelete, setDocToDelete] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    const success = await handleUpload(selectedFile, uploadCategory);
    if (success) {
      setSelectedFile(null);
      setUploadCategory("");
    }
  };

  const handleDeleteClick = (doc) => {
    setDocToDelete(doc);
  };

  const handleConfirmDelete = () => {
    if (docToDelete) {
      handleDelete(docToDelete);
      setDocToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 text-right">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          ملفات المنظمة
        </h1>
        <p className="text-gray-500 text-lg">
          جميع المستندات والملفات الهامة الخاصة بالمنظمة في مكان واحد.
        </p>
      </header>

      <div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200 rounded-lg shadow-sm p-4 mb-6"
        dir="rtl"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto flex-grow">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث عن ملف..."
              aria-label="بحث"
            />
          </div>
          <div className="w-full sm:w-auto">
            <CategoryDropdown
              categories={categories}
              selectedCategory={category}
              onChange={(e) => setCategory(e.target.value)}
              defaultOption="كل الفئات"
              aria-label="تصفية حسب الفئة"
            />
          </div>
        </div>
        <UploadBar
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          uploadCategory={uploadCategory}
          onUploadCategoryChange={(e) => setUploadCategory(e.target.value)}
          onUpload={handleUploadClick}
          uploading={uploading}
          availableCategories={categories}
        />
      </div>

      <main className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <LoadingSpinner />
        ) : filteredDocs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {fileTypeDisplayOrder.map(
              (fileType) =>
                groupedDocs[fileType] && (
                  <section key={fileType}>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2 text-right">
                      {fileType}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedDocs[fileType].map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          doc={doc}
                          onDeleteClick={handleDeleteClick}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        )}
      </main>

      <DeleteConfirmModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        fileName={docToDelete?.name}
      />
    </div>
  );
}
