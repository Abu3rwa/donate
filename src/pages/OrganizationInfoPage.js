import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

import { uploadLogo } from "../services/fileUploadService";

import { useOrganizationInfo } from "../contexts/OrganizationInfoContext";
import { useTheme } from "../contexts/ThemeContext";

const OrganizationInfoPage = () => {
  const { user } = useAuth();
  const isAdmin = user && user.adminType;
  const { orgInfo: orgInfoState, saveOrgInfo, loading: orgInfoLoading } = useOrganizationInfo();
  const [orgInfo, setOrgInfoState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!orgInfoLoading) {
      setOrgInfoState(orgInfoState);
      setForm(orgInfoState);
      setLoading(false);
    }
  }, [orgInfoState, orgInfoLoading]);

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
      await saveOrgInfo(form);
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

  if (loading || !orgInfo) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[var(--background-color)] flex flex-col items-center pb-20" dir="rtl">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-bold text-display-1 text-[var(--text-primary)] mb-2 leading-tight">معلومات الجمعية</h1>
          <p className="text-heading-2 text-[var(--text-secondary)]">عرض وتعديل معلومات جمعية السعاتة الدومة الخيرية</p>
        </div>
        {/* Main Content Card */}
        <div className="bg-[var(--paper-color)] rounded-3xl shadow-2xl border border-[var(--divider)] overflow-hidden backdrop-blur-md">
          {/* Organization Header */}
          <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-6 sm:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 text-white">
            {/* Logo Section */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 relative mb-4 lg:mb-0 flex flex-col items-center justify-center">
              <div
                className={`w-full h-full rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg flex items-center justify-center bg-white/10 ${editMode ? 'cursor-pointer border-dashed border-2 border-[var(--primary-color)]' : ''}`}
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
                  src={editMode && form ? form.logo : orgInfo.logo || require("../assets/tempLogo.png")}
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
            <div className="flex-1 text-center lg:text-right space-y-2 lg:space-y-4">
              {editMode && form ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-display-2 font-bold bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/70 w-full"
                  placeholder="اسم الجمعية"
                />
              ) : (
                <h2 className="text-display-2 font-bold">{orgInfo.name}</h2>
              )}
              {editMode && form ? (
                <input
                  type="text"
                  name="longName"
                  value={form.longName}
                  onChange={handleChange}
                  className="text-heading-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white/90 placeholder-white/50 w-full"
                  placeholder="الاسم الطويل"
                />
              ) : (
                <p className="text-heading-1 text-white/90">{orgInfo.longName}</p>
              )}
              {editMode && form ? (
                <input
                  type="text"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className="text-body bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white/90 placeholder-white/50 w-full"
                  placeholder="وصف الجمعية"
                />
              ) : (
                <p className="text-body text-white/80 mt-1">{orgInfo.description}</p>
              )}
              {editMode && form ? (
                <input
                  type="text"
                  name="location"
                  value={form.location || ""}
                  onChange={handleChange}
                  className="text-body bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white/90 placeholder-white/50 w-full"
                  placeholder="موقع الجمعية (العنوان)"
                />
              ) : (
                <p className="text-body text-white/80 mt-1">{orgInfo.location}</p>
              )}
            </div>
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
                    {(editMode && form ? form.contacts.phones : orgInfo.contacts.phones).map((phone, i) => (
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
                            />
                            <button 
                              onClick={() => handleRemoveContact("phones", i)}
                              className="btn btn-error btn-sm w-full sm:w-auto"
                            >
                              حذف
                            </button>
                          </div>
                        ) : (
                          <span dir="ltr" className="text-gray-900 dark:text-white font-medium">{phone}</span>
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
                    {(editMode && form ? form.contacts.emails : orgInfo.contacts.emails).map((email, i) => (
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
                {(editMode && form ? form.social : orgInfo.social).map((link, i) => (
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
            {/* Recurring Donation Section */}
            {editMode && form ? (
              <section className="mt-8">
                <div className="bg-green-50/80 dark:bg-green-900/30 rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-200 dark:border-green-700 shadow-2xl backdrop-blur-md">
                  <h4 className="text-heading-1 font-bold text-green-800 dark:text-green-200 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    خيارات التبرع المتكرر
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Monthly Recurring */}
                    <div className="group bg-white/80 dark:bg-green-950/80 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-800 flex flex-col items-center transition-all duration-200 hover:shadow-2xl hover:scale-[1.03] focus-within:ring-2 focus-within:ring-green-400">
                      <label className="flex items-center gap-3 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          name="recurringMonthlyEnabled"
                          checked={form.recurring?.monthly?.enabled || false}
                          onChange={e => setForm(prev => ({
                            ...prev,
                            recurring: {
                              ...prev.recurring,
                              monthly: {
                                ...prev.recurring?.monthly,
                                enabled: e.target.checked,
                                amount: prev.recurring?.monthly?.amount || ''
                              }
                            }
                          }))}
                          className="form-checkbox h-6 w-6 text-green-600 focus:ring-green-500 border-green-300 rounded transition-all duration-150"
                          aria-label="تفعيل التبرع الشهري"
                        />
                        <span className="text-lg font-semibold text-green-900 dark:text-green-200">تبرع شهري</span>
                        {form.recurring?.monthly?.amount && (
                          <span className="ml-2 px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-bold">
                            الحالي: {form.recurring?.monthly?.amount} جنيه
                          </span>
                        )}
                      </label>
                      <div className="relative w-full">
                        <input
                          type="number"
                          name="recurringMonthlyAmount"
                          id="recurringMonthlyAmount"
                          value={form.recurring?.monthly?.amount || ''}
                          onChange={e => setForm(prev => ({
                            ...prev,
                            recurring: {
                              ...prev.recurring,
                              monthly: {
                                ...prev.recurring?.monthly,
                                amount: e.target.value
                              }
                            }
                          }))}
                          className="peer input input-bordered w-full text-green-900 dark:text-green-100 bg-green-50/80 dark:bg-green-950/80 border-green-300 dark:border-green-700 focus:ring-green-500 focus:border-green-500 rounded-lg shadow-sm text-lg py-3 px-4 transition-all duration-150 disabled:opacity-60"
                          placeholder=" "
                          disabled={!form.recurring?.monthly?.enabled}
                          aria-label="مبلغ التبرع الشهري"
                        />
                        <label htmlFor="recurringMonthlyAmount" className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-300 text-base pointer-events-none transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-xs bg-white/80 dark:bg-green-950/80 px-1 rounded">المبلغ الشهري (جنيه)</label>
                      </div>
                    </div>
                    {/* Yearly Recurring */}
                    <div className="group bg-white/80 dark:bg-green-950/80 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-800 flex flex-col items-center transition-all duration-200 hover:shadow-2xl hover:scale-[1.03] focus-within:ring-2 focus-within:ring-green-400">
                      <label className="flex items-center gap-3 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          name="recurringYearlyEnabled"
                          checked={form.recurring?.yearly?.enabled || false}
                          onChange={e => setForm(prev => ({
                            ...prev,
                            recurring: {
                              ...prev.recurring,
                              yearly: {
                                ...prev.recurring?.yearly,
                                enabled: e.target.checked,
                                amount: prev.recurring?.yearly?.amount || ''
                              }
                            }
                          }))}
                          className="form-checkbox h-6 w-6 text-green-600 focus:ring-green-500 border-green-300 rounded transition-all duration-150"
                          aria-label="تفعيل التبرع السنوي"
                        />
                        <span className="text-lg font-semibold text-green-900 dark:text-green-200">تبرع سنوي</span>
                        {form.recurring?.yearly?.amount && (
                          <span className="ml-2 px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-bold">
                            الحالي: {form.recurring?.yearly?.amount} جنيه
                          </span>
                        )}
                      </label>
                      <div className="relative w-full">
                        <input
                          type="number"
                          name="recurringYearlyAmount"
                          id="recurringYearlyAmount"
                          value={form.recurring?.yearly?.amount || ''}
                          onChange={e => setForm(prev => ({
                            ...prev,
                            recurring: {
                              ...prev.recurring,
                              yearly: {
                                ...prev.recurring?.yearly,
                                amount: e.target.value
                              }
                            }
                          }))}
                          className="peer input input-bordered w-full text-green-900 dark:text-green-100 bg-green-50/80 dark:bg-green-950/80 border-green-300 dark:border-green-700 focus:ring-green-500 focus:border-green-500 rounded-lg shadow-sm text-lg py-3 px-4 transition-all duration-150 disabled:opacity-60"
                          placeholder=" "
                          disabled={!form.recurring?.yearly?.enabled}
                          aria-label="مبلغ التبرع السنوي"
                        />
                        <label htmlFor="recurringYearlyAmount" className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-300 text-base pointer-events-none transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-xs bg-white/80 dark:bg-green-950/80 px-1 rounded">المبلغ السنوي (جنيه)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="mt-8">
                <div className="bg-green-50/80 dark:bg-green-900/30 rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-200 dark:border-green-700 shadow-2xl backdrop-blur-md">
                  <h4 className="text-heading-1 font-bold text-green-800 dark:text-green-200 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    خيارات التبرع المتكرر
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orgInfo.recurring?.monthly?.enabled && (
                      
                      <div className="bg-white/80 dark:bg-green-950/80 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-800 flex flex-col items-center">
                        <span className="block text-lg font-semibold text-green-900 dark:text-green-200 mb-2">تبرع شهري</span>
                        <span className="text-xl text-green-900 dark:text-green-100 font-bold">{orgInfo.recurring?.monthly?.amount} <span className="text-base font-normal">جنيه</span></span>
                      </div>
                    )}
                    {orgInfo.recurring?.yearly?.enabled && (
                      <div className="bg-white/80 dark:bg-green-950/80 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-800 flex flex-col items-center">
                        <span className="block text-lg font-semibold text-green-900 dark:text-green-200 mb-2">تبرع سنوي</span>
                        <span className="text-xl text-green-900 dark:text-green-100 font-bold">{orgInfo.recurring?.yearly?.amount} <span className="text-base font-normal">جنيه</span></span>
                      </div>
                    )}
                    {!(orgInfo.recurring?.monthly?.enabled || orgInfo.recurring?.yearly?.enabled) && (
                      <div className="text-gray-500 col-span-full">لا توجد تبرعات متكررة محددة</div>
                    )}
                  </div>
                </div>
              </section>
            )}
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