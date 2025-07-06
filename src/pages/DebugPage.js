import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugPage = () => {
  const {
    user,
    loading,
    isAdmin,
    getAdminLevel,
    getAdminTypeInfo,
    hasPermission,
  } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Debug Information
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Data
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>User exists:</strong> {user ? "Yes" : "No"}
              </p>
              <p>
                <strong>UID:</strong> {user?.uid}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Display Name:</strong> {user?.displayName}
              </p>
              <p>
                <strong>Admin Type:</strong> {user?.adminType || "null"}
              </p>
              <p>
                <strong>Admin Level:</strong> {user?.adminLevel || "null"}
              </p>
              <p>
                <strong>Permissions:</strong>{" "}
                {JSON.stringify(user?.permissions || [])}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
            </div>
          </div>

          {/* Admin Functions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Admin Function Results
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>isAdmin():</strong> {isAdmin() ? "true" : "false"}
              </p>
              <p>
                <strong>getAdminLevel():</strong> {getAdminLevel()}
              </p>
              <p>
                <strong>hasPermission("all"):</strong>{" "}
                {hasPermission("all") ? "true" : "false"}
              </p>
              <p>
                <strong>hasPermission("manage_donations"):</strong>{" "}
                {hasPermission("manage_donations") ? "true" : "false"}
              </p>
            </div>

            {/* Admin Type Info */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Admin Type Info:
              </h3>
              <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {JSON.stringify(getAdminTypeInfo(), null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Actions
          </h2>
          <div className="space-x-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Dashboard
            </button>
            <button
              onClick={() => (window.location.href = "/admin-fix")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
            >
              Admin Fix Page
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
