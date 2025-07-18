import React, { useState, useEffect } from "react";
import { getSocial, updateSocial } from "../../services/orgInfoService";
import DeleteIcon from "@mui/icons-material/Delete";

const SocialLinksEditor = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const social = await getSocial();
        if (social && Array.isArray(social)) {
          setSocialLinks(social);
        } else {
          setSocialLinks([
            { name: "فيسبوك", url: "" },
            { name: "تويتر", url: "" },
            { name: "انستغرام", url: "" },
          ]);
        }
      } catch (error) {
        setMessage({ type: "error", text: "فشل تحميل روابط التواصل." });
      }
    };
    fetchSocial();
  }, []);

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const addLink = () => {
    setSocialLinks([...socialLinks, { name: "", url: "" }]);
  };

  const removeLink = (index) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Filter out empty links before saving
      const linksToSave = socialLinks.filter((link) => link.name && link.url);
      await updateSocial(linksToSave);
      setMessage({
        type: "success",
        text: "تم تحديث روابط التواصل بنجاح!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "فشل تحديث روابط التواصل. حاول مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="py-5 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-6 px-2 sm:px-6 py-4 max-w-2xl mx-auto w-full"
      dir="rtl"
    >
      <h2 className="settings-section-title">روابط التواصل الاجتماعي</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        {socialLinks.map((link, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 gap-2 sm:gap-0"
          >
            <input
              type="text"
              placeholder="المنصة (مثال: فيسبوك)"
              value={link.name}
              onChange={(e) => handleLinkChange(index, "name", e.target.value)}
              className="settings-input w-full sm:w-1/3 mb-2 sm:mb-0 sm:mr-2"
            />
            <input
              type="text"
              placeholder="الرابط"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="settings-input w-full sm:w-2/3 mb-2 sm:mb-0 sm:mr-2"
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="settings-button bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
            >
              حذف
            </button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-2 sm:gap-0">
          <button
            type="button"
            onClick={addLink}
            className="settings-button px-4 delete-btn py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 w-full sm:w-auto"
          >
            إضافة رابط
          </button>
          <button
            type="submit"
            disabled={loading}
            className="settings-button px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
        {message && (
          <div
            className={`mt-4 text-sm font-medium p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default SocialLinksEditor;
