import React from "react";

const DashboardStats = ({ data }) => {
  // Prevent crash if data is null or undefined
  if (!data) {
    return;
  }

  // All hooks must be called unconditionally after the above return

  const getColorClasses = (color) => {
    const colors = {
      primary:
        "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400",
      secondary:
        "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400",
      accent:
        "bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400",
      success:
        "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    };
    return colors[color] || colors.primary;
  };

  return (
    <>
      {data.map((stat, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              {stat.icon}
            </div>
            <div className="mr-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.changeType === "positive"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default React.memo(DashboardStats);
