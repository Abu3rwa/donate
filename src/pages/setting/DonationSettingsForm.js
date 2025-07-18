import React, { useState, useEffect } from "react";
import { getRecurring, updateRecurring } from "../../services/orgInfoService";
import { Box } from "@mui/material";

const DonationSettingsForm = () => {
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [monthlyEnabled, setMonthlyEnabled] = useState(false);
  const [yearlyAmount, setYearlyAmount] = useState("");
  const [yearlyEnabled, setYearlyEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchRecurring = async () => {
      try {
        const recurring = await getRecurring();
        if (recurring) {
          setMonthlyAmount(recurring.monthly?.amount || "");
          setMonthlyEnabled(!!recurring.monthly?.enabled);
          setYearlyAmount(recurring.yearly?.amount || "");
          setYearlyEnabled(!!recurring.yearly?.enabled);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load recurring donation settings.",
        });
      }
    };
    fetchRecurring();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateRecurring({
        monthly: { amount: monthlyAmount, enabled: monthlyEnabled },
        yearly: { amount: yearlyAmount, enabled: yearlyEnabled },
      });
      setMessage({
        type: "success",
        text: "Recurring donation settings updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update recurring donation settings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-form-parent">
      <h2 className="settings-section-title">Recurring Donation Settings</h2>
      <form onSubmit={handleSave} className="settings-form">
        <div className="mb-6">
          <h3 className="settings-label">Monthly Recurring</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="monthlyEnabled"
              checked={monthlyEnabled}
              onChange={(e) => setMonthlyEnabled(e.target.checked)}
              className="settings-input h-4 w-4"
            />
            <label htmlFor="monthlyEnabled" className="settings-label ml-2">
              Enable Monthly Donations
            </label>
          </div>
          <input
            type="number"
            id="monthlyAmount"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            className="settings-input"
            placeholder="Monthly Amount"
          />
        </div>
        <div className="mb-6">
          <h3 className="settings-label">Yearly Recurring</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="yearlyEnabled"
              checked={yearlyEnabled}
              onChange={(e) => setYearlyEnabled(e.target.checked)}
              className="settings-input h-4 w-4"
            />
            <label htmlFor="yearlyEnabled" className="settings-label ml-2">
              Enable Yearly Donations
            </label>
          </div>
          <input
            type="number"
            id="yearlyAmount"
            value={yearlyAmount}
            onChange={(e) => setYearlyAmount(e.target.value)}
            className="settings-input"
            placeholder="Yearly Amount"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="settings-button px-6 py-2"
          >
            {loading ? "Saving..." : "Save"}
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

export default DonationSettingsForm;
