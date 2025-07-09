import React, { useEffect, useState, useMemo } from "react";
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/expensesService";
import { getBillsForExpense } from "../services/billsService";
import toast from "react-hot-toast";
import AddExpenseForm from "../components/dashboard/AddExpenseForm";
import Modal from "../components/dashboard/Modal";
import { useAuth } from "../contexts/AuthContext";

const STATUS_LABELS = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

const CATEGORY_LABELS = {
  operations: "تشغيلية",
  purchase: "شراء",
  salary: "راتب",
  donation: "تبرع",
  other: "أخرى",
};

function StatusBadge({ status }) {
  const color =
    status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function ExpenseBills({ expenseId }) {
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
  if (!bills.length) return <div className="text-xs text-gray-400">لا توجد فواتير</div>;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {bills.map((bill, idx) => (
        <a key={bill.id} href={bill.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">مرفق {idx + 1}</a>
      ))}
    </div>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllExpenses();
        setExpenses(data);
      } catch (err) {
        setError("فشل في تحميل المصروفات.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) =>
        categoryFilter === "all" ? true : item.category === categoryFilter
      )
      .filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      )
      .filter((item) =>
        search.trim() === ""
          ? true
          : (item.description || "")
              .toLowerCase()
              .includes(search.trim().toLowerCase())
      );
  }, [expenses, categoryFilter, statusFilter, search]);

  const handleDelete = async (id) => {
    if (!hasPermission || !hasPermission("manage_finances")) {
      toast.error("غير مصرح لك بحذف المصروفات.");
      return;
    }
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المصروف؟")) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("تم حذف المصروف.");
    } catch (err) {
      toast.error("فشل في حذف المصروف.");
    }
  };

  const handleAddEditExpense = async (data) => {
    if (!hasPermission || !hasPermission("manage_finances")) {
      toast.error("غير مصرح لك بإضافة أو تعديل المصروفات.");
      return;
    }
    try {
      if (editExpense) {
        await updateExpense(editExpense.id, data);
        setExpenses((prev) =>
          prev.map((e) => (e.id === editExpense.id ? { ...e, ...data } : e))
        );
        toast.success("تم تعديل المصروف بنجاح.");
      } else {
        const newExpense = await addExpense(data);
        setExpenses((prev) => [newExpense, ...prev]);
        toast.success("تمت إضافة المصروف بنجاح.");
      }
      setShowAddEdit(false);
      setEditExpense(null);
    } catch (err) {
      toast.error("حدث خطأ أثناء حفظ المصروف.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 lg:px-0" dir="rtl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">المصروفات</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">إدارة جميع المصروفات والفواتير في المنصة.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <select
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">كل التصنيفات</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            placeholder="ابحث في الوصف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="py-2 px-4 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
            onClick={() => { setShowAddEdit(true); setEditExpense(null); }}
            disabled={!hasPermission || !hasPermission("manage_finances")}
          >
            إضافة مصروف
          </button>
        </div>
      </header>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600 dark:text-gray-400">جاري تحميل المصروفات...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">خطأ</h3>
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">لا يوجد مصروفات</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم العثور على مصروفات مطابقة للبحث أو الفلاتر.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile: Cards, Desktop: Table */}
          <div className="block md:hidden">
            {filteredExpenses.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{CATEGORY_LABELS[item.category] || item.category}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-sm break-words whitespace-pre-line">{item.description}</div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>المبلغ: {item.amount} ج.س</span>
                  <span>المُقدِّم: {item.submittedBy || "غير معروف"}</span>
                  <span>بتاريخ: {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}</span>
                </div>
                <ExpenseBills expenseId={item.id} />
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => { setEditExpense(item); setShowAddEdit(true); }}
                    disabled={!hasPermission || !hasPermission("manage_finances")}
                  >
                    تفاصيل / تعديل
                  </button>
                  <button
                    className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    onClick={() => handleDelete(item.id)}
                    disabled={!hasPermission || !hasPermission("manage_finances")}
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
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">التصنيف</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">الوصف</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">المبلغ</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">المُقدِّم</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">التاريخ</th>
                  <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">الحالة</th>
                  <th className="p-3 text-right">الفواتير</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">{CATEGORY_LABELS[item.category] || item.category}</td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-200 break-words whitespace-pre-line max-w-xs">{item.description}</td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-200">{item.amount} ج.س</td>
                    <td className="p-3 text-xs text-gray-500 dark:text-gray-400">{item.submittedBy || "غير معروف"}</td>
                    <td className="p-3 text-xs text-gray-500 dark:text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}</td>
                    <td className="p-3"><StatusBadge status={item.status} /></td>
                    <td className="p-3"><ExpenseBills expenseId={item.id} /></td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="py-1 px-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                          onClick={() => { setEditExpense(item); setShowAddEdit(true); }}
                          disabled={!hasPermission || !hasPermission("manage_finances")}
                        >
                          تفاصيل / تعديل
                        </button>
                        <button
                          className="py-1 px-3 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                          onClick={() => handleDelete(item.id)}
                          disabled={!hasPermission || !hasPermission("manage_finances")}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Add/Edit modal would go here */}
      <Modal isOpen={showAddEdit} onClose={() => { setShowAddEdit(false); setEditExpense(null); }}>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          {editExpense ? "تعديل مصروف" : "إضافة مصروف"}
        </h2>
        <AddExpenseForm
          initialData={editExpense}
          onSubmit={handleAddEditExpense}
          onCancel={() => { setShowAddEdit(false); setEditExpense(null); }}
          user={user}
        />
      </Modal>
    </div>
  );
} 