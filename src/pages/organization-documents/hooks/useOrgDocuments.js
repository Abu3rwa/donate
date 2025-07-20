import { useState, useEffect, useMemo } from "react";
import {
  fetchOrgDocuments,
  uploadOrgDocument,
  deleteOrgDocument,
} from "../../../services/orgFilesService";
import { useAuth } from "../../../contexts/AuthContext";
import { getFileType } from "../utils/fileUtils";

export const useOrgDocuments = (showSuccess, showError) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();

  const loadDocs = async () => {
    setLoading(true);
    try {
      const docs = await fetchOrgDocuments();
      setDocuments(docs);
    } catch (err) {
      showError("فشل تحميل الملفات. يرجى المحاولة مرة أخرى.");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (selectedFile, uploadCategory) => {
    if (!selectedFile || !user) return;
    setUploading(true);
    try {
      await uploadOrgDocument(selectedFile, {
        category: uploadCategory || "Uncategorized",
        uploadedBy: user.displayName || user.email,
      });
      await loadDocs(); // Refresh list
      showSuccess("تم رفع الملف بنجاح!");
      return true; // Indicate success
    } catch (err) {
      showError("فشل رفع الملف. تأكد من أن الملف ليس كبيرًا جدًا.");
      return false; // Indicate failure
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!doc || !doc.id || !doc.storagePath) {
      showError("معلومات الملف غير كاملة. لا يمكن الحذف.");
      return;
    }
    try {
      await deleteOrgDocument(doc.id, doc.storagePath);
      await loadDocs(); // Refresh list
      showSuccess("تم حذف الملف بنجاح!");
    } catch (err) {
      showError(`فشل حذف الملف. ${err.message}`);
    }
  };

  const categories = useMemo(
    () =>
      Array.from(new Set(documents.map((doc) => doc.category).filter(Boolean))),
    [documents]
  );

  const filteredDocs = useMemo(
    () =>
      documents.filter(
        (doc) =>
          (category === "" || doc.category === category) &&
          (doc.name.toLowerCase().includes(search.toLowerCase()) ||
            (doc.category &&
              doc.category.toLowerCase().includes(search.toLowerCase())))
      ),
    [documents, search, category]
  );

  const groupedDocs = useMemo(() => {
    return filteredDocs.reduce((acc, doc) => {
      const fileType = getFileType(doc.name);
      if (!acc[fileType]) {
        acc[fileType] = [];
      }
      acc[fileType].push(doc);
      return acc;
    }, {});
  }, [filteredDocs]);

  return {
    documents,
    loading,
    uploading,
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filteredDocs,
    groupedDocs,
    handleUpload,
    handleDelete,
  };
};
