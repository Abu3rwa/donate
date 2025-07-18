import React, { useState, useEffect } from "react";
import { getContacts, updateContacts } from "../../services/orgInfoService";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactInfoForm = () => {
  const [emails, setEmails] = useState([""]);
  const [phones, setPhones] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const c = await getContacts();
        setEmails(
          Array.isArray(c?.emails) && c.emails.length ? c.emails : [""]
        );
        setPhones(
          Array.isArray(c?.phones) && c.phones.length ? c.phones : [""]
        );
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load contact information. Please try again later.",
        });
      }
    };
    fetchContacts();
  }, []);

  const handleEmailChange = (i, v) =>
    setEmails((e) => e.map((item, idx) => (idx === i ? v : item)));
  const handlePhoneChange = (i, v) =>
    setPhones((p) => p.map((item, idx) => (idx === i ? v : item)));
  const addEmail = () => setEmails((e) => [...e, ""]);
  const addPhone = () => setPhones((p) => [...p, ""]);
  const removeEmail = (i) => setEmails((e) => e.filter((_, idx) => idx !== i));
  const removePhone = (i) => setPhones((p) => p.filter((_, idx) => idx !== i));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateContacts({
        emails: emails.filter(Boolean),
        phones: phones.filter(Boolean),
      });
      setMessage({
        type: "success",
        text: "Contact information updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update contact information. Please check your entries and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-form-parent">
      <h2 className="settings-section-title">Contact Information</h2>
      <p className="text-sm text-gray-500 mb-8">
        Update your organization's public contact details.
      </p>
      <form onSubmit={handleSave} className="settings-form">
        {/* Emails Section */}
        <fieldset className="space-y-4">
          <legend className="settings-label">Email Addresses</legend>
          {emails.map((email, i) => (
            <div key={i} className="flex items-center gap-3">
              <label className="settings-label relative w-full">
                <EmailIcon
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="email"
                  aria-label={`Email ${i + 1}`}
                  value={email}
                  onChange={(e) => handleEmailChange(i, e.target.value)}
                  className="settings-input pl-12 pr-4 py-3"
                  placeholder="you@example.com"
                />
              </label>
              {emails.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove email ${i + 1}`}
                  onClick={() => removeEmail(i)}
                  className="settings-button p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEmail}
            className="settings-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <AddIcon fontSize="small" /> Add Email
          </button>
        </fieldset>
        {/* Phones Section */}
        <fieldset className="space-y-4">
          <legend className="settings-label">Phone Numbers</legend>
          {phones.map((phone, i) => (
            <div key={i} className="flex items-center gap-3">
              <label className="settings-label relative w-full">
                <PhoneIcon
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="tel"
                  aria-label={`Phone ${i + 1}`}
                  value={phone}
                  onChange={(e) => handlePhoneChange(i, e.target.value)}
                  className="settings-input pl-12 pr-4 py-3"
                  placeholder="+1 (555) 123-4567"
                />
              </label>
              {phones.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove phone ${i + 1}`}
                  onClick={() => removePhone(i)}
                  className="settings-button p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPhone}
            className="settings-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <AddIcon fontSize="small" /> Add Phone
          </button>
        </fieldset>
        {/* Messages */}
        {message && (
          <div
            role="alert"
            className={`p-4 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
            }`}
          >
            {message.text}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="settings-button px-8 py-3"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfoForm;
