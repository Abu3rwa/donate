import React, { useState } from 'react';

const AboutUsForm = ({ initialData, onSave }) => {
  const [mission, setMission] = useState(initialData.mission);
  const [vision, setVision] = useState(initialData.vision);
  const [values, setValues] = useState(initialData.values);

  const handleValueChange = (index, field, value) => {
    const newValues = [...values];
    newValues[index][field] = value;
    setValues(newValues);
  };

  const handleSave = () => {
    onSave({ mission, vision, values });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mission & Vision</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="mission" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mission</label>
            <textarea id="mission" name="mission" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={mission} onChange={(e) => setMission(e.target.value)}></textarea>
          </div>
          <div>
            <label htmlFor="vision" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vision</label>
            <textarea id="vision" name="vision" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={vision} onChange={(e) => setVision(e.target.value)}></textarea>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Values</h2>
        <div className="space-y-4">
          {values.map((value, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{value.icon}</div>
                <div className="flex-1">
                  <div>
                    <label htmlFor={`value-title-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input type="text" id={`value-title-${index}`} name={`value-title-${index}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={value.title} onChange={(e) => handleValueChange(index, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`value-description-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea id={`value-description-${index}`} name={`value-description-${index}`} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={value.description} onChange={(e) => handleValueChange(index, 'description', e.target.value)}></textarea>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="btn-primary px-6 py-2" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default AboutUsForm;
