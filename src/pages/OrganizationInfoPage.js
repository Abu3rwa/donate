import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getOrgInfo, setOrgInfo } from "../services/orgInfoService";
import { uploadLogo } from "../services/fileUploadService";
import { APP_CONFIG } from "../constants";
import { useTheme } from "../contexts/ThemeContext";

const defaultOrgInfo = {
  name: APP_CONFIG.name,
  longName: APP_CONFIG.nameEn,
  logo: require("../assets/tempLogo.png"),
  contacts: { 
    phones: [APP_CONFIG.contactPhone], 
    emails: [APP_CONFIG.supportEmail] 
  },
  social: [
    { name: "الموقع الإلكتروني", url: APP_CONFIG.url }
  ],
};

const OrganizationInfoPage = () => {
  const { user } = useAuth();
  const isAdmin = user && user.adminType;
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  const [orgInfo, setOrgInfoState] = useState(defaultOrgInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(defaultOrgInfo);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getOrgInfo()
      .then((data) => {
        if (data) {
          setOrgInfoState(data);
        } else {
          // If no data in Firestore, use default data from APP_CONFIG
          console.log("No organization data in Firestore, using default data");
          setOrgInfoState(defaultOrgInfo);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading organization data:", e);
        // Use default data on error
        setOrgInfoState(defaultOrgInfo);
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setForm(orgInfo);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Contacts and social links handlers
  const handleArrayChange = (type, idx, value) => {
    setForm((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [type]: prev.contacts[type].map((v, i) => (i === idx ? value : v)),
      },
    }));
  };
  const handleAddContact = (type) => {
    setForm((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [type]: [...prev.contacts[type], ""],
      },
    }));
  };
  const handleRemoveContact = (type, idx) => {
    setForm((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [type]: prev.contacts[type].filter((_, i) => i !== idx),
      },
    }));
  };
  const handleSocialChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      social: prev.social.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      ),
    }));
  };
  const handleAddSocial = () => {
    setForm((prev) => ({ ...prev, social: [...prev.social, { name: "", url: "" }] }));
  };
  const handleRemoveSocial = (idx) => {
    setForm((prev) => ({ ...prev, social: prev.social.filter((_, i) => i !== idx) }));
  };

  const handleLogoChange = (e) => {
    // For now, just use URL. For file upload, integrate with Firebase Storage.
    setForm((prev) => ({ ...prev, logo: e.target.value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploadingLogo(true);
    setError('');
    
    try {
      const downloadURL = await uploadLogo(file);
      setForm((prev) => ({ ...prev, logo: downloadURL }));
    } catch (err) {
      setError('فشل رفع الشعار: ' + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      console.log("Saving organization data:", form);
      await setOrgInfo(form);
      console.log("Organization data saved successfully");
      setOrgInfoState(form);
      setEditMode(false);
    } catch (e) {
      console.error("Error saving organization data:", e);
      
      // Check if it's a permission error
      if (e.message && e.message.includes('permission')) {
        setError("فشل حفظ البيانات: لا توجد صلاحيات كافية. تأكد من أنك مسجل دخول كمدير.");
      } else {
        setError(`فشل حفظ البيانات: ${e.message || 'خطأ غير معروف'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[var(--background-color)] p-2 sm:p-4 lg:p-8 flex flex-col items-center" dir="rtl">
      {/* Theme Switcher */}
      <div className="w-full max-w-4xl flex justify-end mb-2">
        <select
          className="rounded-lg border px-2 py-1 text-sm bg-[var(--paper-color)] text-[var(--text-primary)]"
          value={currentTheme}
          onChange={e => changeTheme(e.target.value)}
        >
          {Object.entries(availableThemes).map(([key, t]) => (
            <option key={key} value={key}>{t.icon} {t.name}</option>
          ))}
        </select>
      </div>
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            معلومات الجمعية
          </h1>
          <p className="text-[var(--text-secondary)]">
            عرض وتعديل معلومات جمعية السعاتة الدومة الخيرية
          </p>
        </div>
        {/* Main Content Card */}
        <div className="bg-[var(--paper-color)] rounded-2xl shadow-xl border border-[var(--divider)] overflow-hidden">
          {/* Organization Header */}
          <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Logo Section */}
              <div className="relative mb-2 sm:mb-0 flex flex-col items-center">
                <div
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg flex items-center justify-center bg-white/10 ${editMode ? 'cursor-pointer border-dashed border-2 border-[var(--primary-color)]' : ''}`}
                  onClick={editMode ? triggerFileUpload : undefined}
                  onDragOver={e => { if (editMode) { e.preventDefault(); e.stopPropagation(); } }}
                  onDrop={e => {
                    if (editMode) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleLogoUpload({ target: { files: e.dataTransfer.files } });
                      }
                    }
                  }}
                  title={editMode ? 'اضغط أو اسحب صورة هنا لتغيير الشعار' : ''}
                >
                  <img
                    src={editMode ? form.logo : orgInfo.logo || require("../assets/tempLogo.png")}
                    alt="شعار الجمعية"
                    className="w-full h-full object-cover"
                  />
                  {editMode && uploadingLogo && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm">جاري الرفع...</span>
                    </div>
                  )}
                </div>
                {editMode && (
                  <>
                    <button
                      onClick={triggerFileUpload}
                      disabled={uploadingLogo}
                      className="mt-2 bg-[var(--primary-color)] text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors w-full"
                      type="button"
                    >
                      {uploadingLogo ? "جاري الرفع..." : "رفع/تغيير الشعار"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-300 mt-1">PNG, JPG, JPEG • حتى 5MB</span>
                  </>
                )}
              </div>
              {/* Organization Info */}
              <div className="flex-1 text-center sm:text-right">
                <div className="space-y-2">
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="text-xl sm:text-2xl font-bold bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full"
                      placeholder="اسم الجمعية"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-bold">{orgInfo.name}</h2>
                  )}
                  {editMode ? (
                    <input
                      type="text"
                      name="longName"
                      value={form.longName}
                      onChange={handleChange}
                      className="text-base sm:text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white/90 placeholder-white/50 w-full"
                      placeholder="الاسم الطويل"
                    />
                  ) : (
                    <p className="text-base sm:text-lg text-white/90">{orgInfo.longName}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Logo URL Input */}
            {editMode && (
              <div className="mt-3">
                <input
                  type="text"
                  name="logo"
                  value={form.logo}
                  onChange={handleLogoChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 text-sm"
                  placeholder="أو أدخل رابط الشعار"
                />
              </div>
            )}
          </div>
          {/* Content Sections */}
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">وسائل التواصل</h3>
              </div>
              <div className="space-y-4">
                {/* Phones */}
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">أرقام الهاتف</h4>
                  <div className="space-y-2">
                    {(editMode ? form.contacts.phones : orgInfo.contacts.phones).map((phone, i) => (
                      <div key={i} className="flex items-center gap-3 flex-wrap">
                        <div className="w-7 h-7 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        {editMode ? (
                          <div className="flex-1 flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={phone}
                              onChange={e => handleArrayChange("phones", i, e.target.value)}
                              className="flex-1 input input-bordered text-sm"
                              placeholder="رقم الهاتف"
                              dir="ltr"
                              style={{fontFamily: 'monospace'}}
                            />
                            <button 
                              onClick={() => handleRemoveContact("phones", i)}
                              className="btn btn-error btn-sm w-full sm:w-auto"
                            >
                              حذف
                            </button>
                          </div>
                        ) : (
                          <span dir="ltr" style={{fontFamily: 'monospace'}} className="text-gray-900 dark:text-white font-medium">{phone}</span>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button 
                        onClick={() => handleAddContact("phones")}
                        className="btn btn-outline btn-sm text-green-600 border-green-600 hover:bg-green-600 hover:text-white w-full sm:w-auto"
                      >
                        + إضافة رقم
                      </button>
                    )}
                  </div>
                </div>
                {/* Emails */}
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">البريد الإلكتروني</h4>
                  <div className="space-y-2">
                    {(editMode ? form.contacts.emails : orgInfo.contacts.emails).map((email, i) => (
                      <div key={i} className="flex items-center gap-3 flex-wrap">
                        <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {editMode ? (
                          <div className="flex-1 flex flex-col sm:flex-row gap-2">
                            <input
                              type="email"
                              value={email}
                              onChange={e => handleArrayChange("emails", i, e.target.value)}
                              className="flex-1 input input-bordered text-sm"
                              placeholder="البريد الإلكتروني"
                              dir="ltr"
                            />
                            <button 
                              onClick={() => handleRemoveContact("emails", i)}
                              className="btn btn-error btn-sm w-full sm:w-auto"
                            >
                              حذف
                            </button>
                          </div>
                        ) : (
                          <span dir="ltr" className="text-gray-900 dark:text-white font-medium">{email}</span>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button 
                        onClick={() => handleAddContact("emails")}
                        className="btn btn-outline btn-sm text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white w-full sm:w-auto"
                      >
                        + إضافة بريد
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Social Links */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">روابط التواصل الاجتماعي</h3>
              </div>
              <div className="space-y-3">
                {(editMode ? form.social : orgInfo.social).map((link, i) => (
                  <div key={i} className="flex items-center gap-3 flex-wrap">
                    <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    {editMode ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={link.name}
                          onChange={e => handleSocialChange(i, "name", e.target.value)}
                          className="input input-bordered w-full sm:w-32 text-sm"
                          placeholder="اسم الرابط"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={e => handleSocialChange(i, "url", e.target.value)}
                          className="flex-1 input input-bordered text-sm"
                          placeholder="رابط"
                          dir="ltr"
                        />
                        <button 
                          onClick={() => handleRemoveSocial(i)}
                          className="btn btn-error btn-sm w-full sm:w-auto"
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium break-all"
                        dir="ltr"
                      >
                        {link.name || link.url}
                      </a>
                    )}
                  </div>
                ))}
                {editMode && (
                  <button 
                    onClick={handleAddSocial}
                    className="btn btn-outline btn-sm text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white w-full sm:w-auto"
                  >
                    + إضافة رابط
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            {isAdmin && !editMode ? (
              <div className="text-center">
                <button 
                  onClick={handleEdit}
                  className="btn btn-primary btn-lg"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل المعلومات
                </button>
              </div>
            ) : editMode ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="btn btn-success btn-lg w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      حفظ التغييرات
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCancel} 
                  disabled={saving}
                  className="btn btn-secondary btn-lg w-full sm:w-auto"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  إلغاء
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationInfoPage; 