import React, { useEffect, useState, useMemo } from "react";
import { getAllExpenses } from "../services/expensesService";
import { getBillsForExpense, addBillToExpense, deleteBillFromExpense } from "../services/billsService";
import toast from "react-hot-toast";
import Modal from "../components/dashboard/Modal";
import { useAuth } from "../contexts/AuthContext";

export default function BillsPage() {
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const { hasPermission } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const expensesData = await getAllExpenses();
        setExpenses(expensesData);
        // Fetch all bills for all expenses
        let allBills = [];
        for (const exp of expensesData) {
          const billsForExp = await getBillsForExpense(exp.id);
          allBills = allBills.concat(
            billsForExp.map((b) => ({ ...b, expense: exp }))
          );
        }
        setBills(allBills);
      } catch (err) {
        setError("فشل في تحميل الفواتير.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter((bill) =>
      search.trim() === ""
        ? true
        : (bill.description || "").toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [bills, search]);

  

  const handleDelete = async (bill) => {
    if (!hasPermission || !hasPermission("manage_finances")) {
      toast.error("غير مصرح لك بحذف الفواتير.");
      return;
    }
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الفاتورة؟")) return;
    try {
      await deleteBillFromExpense(bill.expense.id, bill.id);
      setBills((prev) => prev.filter((b) => b.id !== bill.id));
      toast.success("تم حذف الفاتورة.");
    } catch (err) {
      toast.error("فشل في حذف الفاتورة.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 lg:px-0" dir="rtl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">الفواتير</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">إدارة جميع الفواتير والإيصالات المرفقة بالمصروفات.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <input
            type="text"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            placeholder="ابحث في الوصف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="py-2 px-4 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
            onClick={() => setShowUpload(true)}
          >
            رفع فاتورة
          </button>
        </div>
      </header>

      {loading && <p className="text-center text-gray-500 dark:text-gray-400">جاري تحميل الفواتير...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}

      {!loading && !error && filteredBills.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">لا توجد فواتير لعرضها.</p>
      )}

      {!loading && !error && filteredBills.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المصروف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الوصف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاريخ الرفع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{bill.expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{bill.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(bill.uploadedAt.seconds * 1000).toLocaleDateString("ar-EG")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={bill.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 ml-2">عرض</a>
                    {hasPermission("manage_finances") && (
                      <button
                        onClick={() => handleDelete(bill)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        حذف
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="رفع فاتورة جديدة">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const file = e.target.elements.billFile.files[0];
            const expenseId = e.target.elements.expenseId.value;
            const description = e.target.elements.description.value;

            if (!file || !expenseId) {
              toast.error("الرجاء اختيار ملف وتحديد المصروف.");
              return;
            }

            try {
              await addBillToExpense(expenseId, file, description);
              toast.success("تم رفع الفاتورة بنجاح!");
              setShowUpload(false);
              // Refresh bills list
              const expensesData = await getAllExpenses();
              setExpenses(expensesData);
              let allBills = [];
              for (const exp of expensesData) {
                const billsForExp = await getBillsForExpense(exp.id);
                allBills = allBills.concat(
                  billsForExp.map((b) => ({ ...b, expense: exp }))
                );
              }
              setBills(allBills);
            } catch (err) {
              toast.error("فشل في رفع الفاتورة.");
            }
          }}
        >
          <div className="mb-4">
            <label htmlFor="expenseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">المصروف</label>
            <select
              id="expenseId"
              name="expenseId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue=""
            >
              <option value="" disabled>اختر مصروف</option>
              {expenses.map((exp) => (
                <option key={exp.id} value={exp.id}>{exp.description}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">وصف الفاتورة (اختياري)</label>
            <input
              type="text"
              id="description"
              name="description"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="billFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ملف الفاتورة</label>
            <input
              type="file"
              id="billFile"
              name="billFile"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="py-2 px-4 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
            >
              رفع
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 