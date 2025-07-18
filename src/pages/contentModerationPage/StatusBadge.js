import React from 'react';
import { STATUS_LABELS } from './labels';

function StatusBadge({ status }) {
  const statusStyles = {
    approved:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        statusStyles[status] || ''
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default StatusBadge;
