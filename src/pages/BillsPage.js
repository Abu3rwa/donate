import React, { useEffect, useState, useMemo } from "react";
import { getAllExpenses } from "../services/expensesService";
import { getBillsForExpense, addBillToExpense, deleteBillFromExpense } from "../services/billsService";
import toast from "react-hot-toast";
import AddBillForm from "../components/dashboard/AddBillForm";
import Modal from "../components/dashboard/Modal";
import { useAuth } from "../contexts/AuthContext";

export default function BillsPage() {
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedExpense, setSelectedExpense] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const { user, hasPermission } = useAuth();

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

  const handleAddBill = async (data) => {
    if (!hasPermission || !hasPermission("manage_finances")) {
      toast.error("غير مصرح لك برفع الفواتير.");
      return;
    }
    try {
      const { expenseId, file, description } = data;
      const bill = await addBillToExpense(expenseId, { file, description, uploadedBy: user?.displayName || user?.email });
      setBills((prev) => [
        { ...bill, expense: expenses.find((e) => e.id === expenseId) },
        ...prev,
      ]);
      toast.success("تم رفع الفاتورة بنجاح.");
      setShowUpload(false);
    } catch (err) {
      toast.error("فشل في رفع الفاتورة.");
    }
  };

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
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600 dark:text-gray-400">جاري تحميل الفواتير...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">خطأ</h3>
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">لا يوجد فواتير</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم العثور على فواتير مطابقة للبحث.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile: Cards, Desktop: Table */}
          <div className="block md:hidden">
            {filteredBills.map((bill) => (
              <div key={bill.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{bill.expense.description}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{bill.expense.amount} ج.س</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-sm break-words whitespace-pre-line">{bill.description}</div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>المُرفق: <a href={bill.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">عرض</a></span>
                  <span>المُقدِّم: {bill.uploadedBy || "غير معروف"}</span>
                  <span>بتاريخ: {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString("ar-EG") : "-"}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    onClick={() => handleDelete(bill)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <thead>
                <tr>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">الوصف</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">المبلغ</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">المُرفق</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">المُقدِّم</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">التاريخ</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">{bill.expense.description}</td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-200">{bill.expense.amount} ج.س</td>
                    <td className="p-3 text-xs text-blue-600 underline"><a href={bill.fileUrl} target="_blank" rel="noopener noreferrer">عرض</a></td>
                    <td className="p-3 text-xs text-gray-500 dark:text-gray-400">{bill.uploadedBy || "غير معروف"}</td>
                    <td className="p-3 text-xs text-gray-500 dark:text-gray-400">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString("ar-EG") : "-"}</td>
                    <td className="p-3">
                      <button
                        className="py-1 px-3 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        onClick={() => handleDelete(bill)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)}>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">رفع فاتورة</h2>
        <AddBillForm
          expenses={expenses}
          onSubmit={handleAddBill}
          onCancel={() => setShowUpload(false)}
        />
      </Modal>
    </div>
  );
} 