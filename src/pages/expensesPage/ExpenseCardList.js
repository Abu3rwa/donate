import React from 'react';
import PropTypes from 'prop-types';
import StatusBadge from './StatusBadge';
import ExpenseBills from './ExpenseBills';

const CATEGORY_LABELS = {
  operations: 'تشغيلية',
  purchase: 'شراء',
  salary: 'راتب',
  donation: 'تبرع',
  other: 'أخرى',
};

const ExpenseCardList = ({ expenses, onEdit, onDelete, hasPermission }) => {
  return (
    <div className="block md:hidden">
      {expenses.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2 mb-4"
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <div className="text-gray-700 dark:text-gray-200 text-sm break-words whitespace-pre-line">
            {item.description}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>المبلغ: {item.amount} ج.س</span>
            <span>المُقدِّم: {item.submittedBy || 'غير معروف'}</span>
            <span>
              بتاريخ:{" "}
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                : "-"}
            </span>
          </div>
          <ExpenseBills expenseId={item.id} />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => onEdit(item)}
              disabled={
                !hasPermission || !hasPermission("manage_finances")
              }
            >
              تفاصيل / تعديل
            </button>
            <button
              className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              onClick={() => onDelete(item.id)}
              disabled={
                !hasPermission || !hasPermission("manage_finances")
              }
            >
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

ExpenseCardList.propTypes = {
  expenses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

export default ExpenseCardList;
