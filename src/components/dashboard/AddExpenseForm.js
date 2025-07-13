import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllCampaigns } from '../../services/compaignService';
import { fetchDonations } from '../../services/donationsService';

const CATEGORY_LABELS = {
  operations: 'تشغيلية',
  purchase: 'شراء',
  salary: 'راتب',
  donation: 'تبرع',
  other: 'أخرى',
};

const AddExpenseForm = ({ initialData, onSubmit, onCancel, user }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(initialData?.campaignId || '');
  const [totalDonations, setTotalDonations] = useState(0);
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    category: initialData?.category || 'operations',
    submittedBy: user?.displayName || 'غير معروف',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAllCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchCampaignDonations = async () => {
      if (selectedCampaign) {
        try {
          const { donations } = await fetchDonations({ campaign: selectedCampaign });
          const total = donations.reduce((acc, curr) => acc + curr.amount, 0);
          setTotalDonations(total);
        } catch (error) {
          console.error("Error fetching donations:", error);
          setTotalDonations(0);
        }
      }
    };
    fetchCampaignDonations();
  }, [selectedCampaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount > totalDonations) {
      alert('Expense amount cannot exceed total donations for the campaign.');
      return;
    }
    onSubmit({ ...formData, campaignId: selectedCampaign });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحملة</label>
        <select
          id="campaign"
          name="campaign"
          value={selectedCampaign}
          onChange={handleCampaignChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">اختر حملة</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.title}
            </option>
          ))}
        </select>
        {selectedCampaign && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            إجمالي التبرعات لهذه الحملة: {totalDonations} ج.س
          </p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">المبلغ</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">التصنيف</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {initialData ? 'حفظ التعديلات' : 'إضافة مصروف'}
        </button>
      </div>
    </form>
  );
};

AddExpenseForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default AddExpenseForm;
