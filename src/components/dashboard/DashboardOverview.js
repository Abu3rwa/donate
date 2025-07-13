import React from 'react';
import QuickActions from './QuickActions';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleAddDonation = () => {
    navigate('/dashboard/add-donation');
  };

  const handleShowFinancialReports = () => {
    navigate('/dashboard/financial-reports');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[var(--text-color)]">نظرة عامة على لوحة التحكم</h2>
      <QuickActions
        user={user}
        hasPermission={hasPermission}
        onAddDonation={handleAddDonation}
        onShowFinancialReports={handleShowFinancialReports}
      />
      {/* You can add more overview components here later */}
    </div>
  );
};

export default DashboardOverview;