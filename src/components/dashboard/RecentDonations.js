import React, { useMemo } from "react";

const RecentDonations = ({ donations, onLoadMore, hasMore }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد المعالجة";
      case "failed":
        return "فشل";
      default:
        return "غير محدد";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Memoize the rendered list for performance
  const donationList = useMemo(
    () =>
      donations.map((donation) => (
        <div
          key={donation.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {donation.donorName.charAt(0)}
              </span>
            </div>

            {/* Donation Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {donation.donorName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {donation.campaign}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {donation.amount.toLocaleString("ar-EG")} جنيه
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(donation.date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mr-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                donation.status
              )}`}
            >
              {getStatusText(donation.status)}
            </span>
          </div>
        </div>
      )),
    [donations]
  );

  return (
    <div className="space-y-4">
      {donationList}
      {/* Empty State */}
      {donations.length === 0 && (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            لا توجد تبرعات حديثة
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            ستظهر التبرعات الجديدة هنا
          </p>
        </div>
      )}
      {/* Pagination: Load More Button */}
      {hasMore && (
        <div className="text-center mt-4">
          <button
            className="btn-primary px-6 py-2 rounded"
            onClick={onLoadMore}
          >
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(RecentDonations);
