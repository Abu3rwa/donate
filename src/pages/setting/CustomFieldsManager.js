import { Box } from "@mui/material";
import React, { useState } from "react";

const CustomFieldsManager = () => {
  const [customFields, setCustomFields] = useState([
    { name: "", type: "text", options: "" },
  ]);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);

  const handleFieldChange = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };

  const addField = () => {
    setCustomFields([...customFields, { name: "", type: "text", options: "" }]);
  };

  return (
    <div className="setting-form-parent">
      <h2 className="settings-section-title">
        Custom Fields & Advanced Settings
      </h2>
      <form className="settings-form">
        <div className="mb-6">
          <h3 className="settings-label">Custom Fields</h3>
          {customFields.map((field, index) => (
            <div
              key={index}
              className="settings-form-row mb-4 p-4 border border-gray-200 rounded-md"
            >
              <input
                type="text"
                placeholder="Field Name"
                value={field.name}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
                className="settings-input"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
                className="settings-select"
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="checkbox">Checkbox</option>
                <option value="select">Select</option>
              </select>
              <input
                type="text"
                placeholder="Options (comma-separated)"
                value={field.options}
                onChange={(e) =>
                  handleFieldChange(index, "options", e.target.value)
                }
                className="settings-input"
              />
            </div>
          ))}
          <button type="button" onClick={addField} className="settings-button">
            Add Field
          </button>
        </div>

        <div>
          <h3 className="settings-label">Advanced Settings</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="experimentalFeatures"
              checked={experimentalFeatures}
              onChange={(e) => setExperimentalFeatures(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="experimentalFeatures"
              className="ml-2 block text-gray-900"
            >
              Enable Experimental Features
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomFieldsManager;
