import React from "react";

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "donation":
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-lg">💰</span>
          </div>
        );
      case "campaign":
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-lg">🎯</span>
          </div>
        );
      case "volunteer":
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <span className="text-lg">👥</span>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-lg">📝</span>
          </div>
        );
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-4 right-4 -mr-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3 space-x-reverse">
                {getActivityIcon(activity.type)}
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 space-x-reverse">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.message}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    <time dateTime={activity.time}>{activity.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {activities.length === 0 && (
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            لا توجد نشاطات حديثة
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            ستظهر النشاطات الجديدة هنا
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
