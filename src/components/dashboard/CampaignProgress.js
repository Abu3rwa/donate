import React from "react";

const CampaignProgress = ({ campaigns }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return "text-green-600 dark:text-green-400";
    if (progress >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (progress >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
              {campaign.name}
            </h3>
            <span
              className={`text-xs font-semibold ${getProgressTextColor(
                campaign.progress
              )}`}
            >
              {campaign.progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                campaign.progress
              )}`}
              style={{ width: `${campaign.progress}%` }}
            />
          </div>

          {/* Amount Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{campaign.raised.toLocaleString("ar-EG")} جنيه</span>
            <span>من {campaign.target.toLocaleString("ar-EG")} جنيه</span>
          </div>

          {/* Status Badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                campaign.status === "active"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              }`}
            >
              {campaign.status === "active" ? "نشط" : "غير نشط"}
            </span>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {campaigns.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            لا توجد حملات نشطة
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            ستظهر الحملات النشطة هنا
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignProgress;
