import React, { useState } from "react";

const ThemeSelector = () => {
  const [theme, setTheme] = useState("light");
  const [favicon, setFavicon] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const handleFaviconChange = (e) => {
    if (e.target.files[0]) {
      setFavicon(e.target.files[0]);
    }
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg mt-6" dir="rtl">
      <h2 className="settings-section-title">المظهر والثيم</h2>
      <form className="settings-form">
        <div className="mb-4">
          <label htmlFor="theme" className="settings-label">
            الثيم
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="settings-select"
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
            <option value="custom">مخصص</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="favicon" className="settings-label">
            أيقونة الموقع (Favicon)
          </label>
          <input
            type="file"
            id="favicon"
            onChange={handleFaviconChange}
            className="settings-input"
          />
        </div>
        <div>
          <label htmlFor="mainImage" className="settings-label">
            الصورة الرئيسية
          </label>
          <input
            type="file"
            id="mainImage"
            onChange={handleMainImageChange}
            className="settings-input"
          />
        </div>
      </form>
    </div>
  );
};

export default ThemeSelector;
