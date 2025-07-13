import React from 'react';
import PropTypes from 'prop-types';

const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  approved: 'مقبول',
  rejected: 'مرفوض',
};

const StatusBadge = ({ status }) => {
  const color =
    status === 'approved'
      ? 'bg-green-100 text-green-700'
      : status === 'rejected'
      ? 'bg-red-100 text-red-700'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
