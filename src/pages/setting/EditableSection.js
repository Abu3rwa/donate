
import React, { useState } from 'react';

const EditableSection = ({ title, children, renderEditForm }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Add save logic here
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </div>
      <div className="p-6">
        {isEditing ? (
          <div>
            {renderEditForm()}
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsEditing(false)} className="text-gray-600 dark:text-gray-300 mr-4">Cancel</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Save</button>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default EditableSection;
