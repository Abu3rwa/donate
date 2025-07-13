import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getBillsForExpense } from '../../services/billsService';

const ExpenseBills = ({ expenseId }) => {
  const [bills, setBills] = useState([]);
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBillsForExpense(expenseId);
        setBills(data);
      } catch (err) {
        setBills([]);
      }
    };
    fetchBills();
  }, [expenseId]);

  if (!bills.length)
    return <div className="text-xs text-gray-400">لا توجد فواتير</div>;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {bills.map((bill, idx) => (
        <a
          key={bill.id}
          href={bill.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-xs"
        >
          مرفق {idx + 1}
        </a>
      ))}
    </div>
  );
};

ExpenseBills.propTypes = {
  expenseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ExpenseBills;
