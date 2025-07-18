import { Box } from "@mui/material";
import React, { useState } from "react";

const PrivacyPolicyEditor = () => {
  const [policyLink, setPolicyLink] = useState("");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState("");

  return (
    <div className="setting-form-parent">
      <h2 className="settings-section-title">Privacy & Security</h2>
      <form className="settings-form">
        <div className="mb-4">
          <label htmlFor="policyLink" className="settings-label">
            Privacy Policy Link
          </label>
          <input
            type="text"
            id="policyLink"
            value={policyLink}
            onChange={(e) => setPolicyLink(e.target.value)}
            className="settings-input"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="twoFactorAuth"
            checked={twoFactorAuth}
            onChange={(e) => setTwoFactorAuth(e.target.checked)}
            className="settings-input h-4 w-4"
          />
          <label htmlFor="twoFactorAuth" className="settings-label ml-2">
            Enable Two-Factor Authentication
          </label>
        </div>
        <div>
          <label htmlFor="passwordRequirements" className="settings-label">
            Password Requirements
          </label>
          <textarea
            id="passwordRequirements"
            value={passwordRequirements}
            onChange={(e) => setPasswordRequirements(e.target.value)}
            rows="4"
            className="settings-textarea"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default PrivacyPolicyEditor;
