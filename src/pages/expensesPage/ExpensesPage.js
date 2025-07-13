import React, { useEffect, useState, useMemo } from "react";
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expensesService";
import toast from "react-hot-toast";
import Modal from "../../components/dashboard/Modal";
import { useAuth } from "../../contexts/AuthContext";
import FiltersBar from "./FiltersBar";
import ExpenseCardList from "./ExpenseCardList";
import ExpenseTable from "./ExpenseTable";
import AddExpenseForm from "./AddExpenseForm";

// Default expense categories
const DEFAULT_CATEGORIES = [
  {
    id: "operations",
    nameAr: "تشغيلية",
    nameEn: "Operations",
    description: "مصاريف تشغيلية عامة",
    active: true,
  },
  {
    id: "purchase",
    nameAr: "شراء",
    nameEn: "Purchase",
    description: "مشتريات ومعدات",
    active: true,
  },
  {
    id: "salary",
    nameAr: "راتب",
    nameEn: "Salary",
    description: "رواتب وبدلات",
    active: true,
  },
  {
    id: "donation",
    nameAr: "تبرع",
    nameEn: "Donation",
    description: "تبرعات ومكافآت",
    active: true,
  },
  {
    id: "other",
    nameAr: "أخرى",
    nameEn: "Other",
    description: "مصاريف أخرى",
    active: true,
  },
];

export default function ExpensesPage() {
  // Auth and permissions
  const { user, hasPermission } = useAuth();

  // Main expenses state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Modal states
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Category management states
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    active: true,
  });

  // Load expenses on component mount
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

  // Filter expenses based on current filters
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

  // ===== EXPENSE MANAGEMENT FUNCTIONS =====

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

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setShowAddEdit(true);
  };

  const handleAddExpense = () => {
    setEditExpense(null);
    setShowAddEdit(true);
  };

  // ===== CATEGORY MANAGEMENT FUNCTIONS =====

  const handleAddCategory = () => {
    if (!categoryForm.nameAr.trim() || !categoryForm.nameEn.trim()) {
      toast.error("يرجى إدخال اسم التصنيف بالعربية والإنجليزية");
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      ...categoryForm,
    };

    setCategories((prev) => [...prev, newCategory]);
    setCategoryForm({ nameAr: "", nameEn: "", description: "", active: true });
    setShowCategoryForm(false);
    toast.success("تم إضافة التصنيف بنجاح");
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      description: category.description,
      active: category.active,
    });
    setShowCategoryForm(true);
  };

  const handleUpdateCategory = () => {
    if (!categoryForm.nameAr.trim() || !categoryForm.nameEn.trim()) {
      toast.error("يرجى إدخال اسم التصنيف بالعربية والإنجليزية");
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, ...categoryForm } : cat
      )
    );

    setEditingCategory(null);
    setCategoryForm({ nameAr: "", nameEn: "", description: "", active: true });
    setShowCategoryForm(false);
    toast.success("تم تحديث التصنيف بنجاح");
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      toast.success("تم حذف التصنيف بنجاح");
    }
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryForm({ nameAr: "", nameEn: "", description: "", active: true });
  };

  const handleOpenCategoryModal = () => {
    setShowCategoryForm(true);
  };

  // ===== RENDER FUNCTIONS =====

  const renderLoadingState = () => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="mr-3 text-gray-600 dark:text-gray-400">
        جاري تحميل المصروفات...
      </span>
    </div>
  );

  const renderErrorState = () => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">خطأ</h3>
      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16">
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
        لا يوجد مصروفات
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        لم يتم العثور على مصروفات مطابقة للبحث أو الفلاتر.
      </p>
    </div>
  );

  const renderExpensesList = () => (
    <div className="space-y-4">
      <ExpenseCardList
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        hasPermission={hasPermission}
      />
      <ExpenseTable
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        hasPermission={hasPermission}
      />
    </div>
  );

  const renderCategoryModal = () => (
    <Modal isOpen={showCategoryForm} onClose={handleCloseCategoryModal}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          {editingCategory ? "تعديل تصنيف" : "إضافة تصنيف جديد"}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم التصنيف (عربي)
              </label>
              <input
                type="text"
                value={categoryForm.nameAr}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    nameAr: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="مثال: تشغيلية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم التصنيف (إنجليزي)
              </label>
              <input
                type="text"
                value={categoryForm.nameEn}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    nameEn: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="مثال: Operations"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الوصف
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
              placeholder="وصف التصنيف..."
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="categoryActive"
              checked={categoryForm.active}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
              className="ml-2"
            />
            <label
              htmlFor="categoryActive"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              نشط
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={handleCloseCategoryModal}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              onClick={
                editingCategory ? handleUpdateCategory : handleAddCategory
              }
              className="rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {editingCategory ? "تحديث" : "إضافة"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 lg:px-0" dir="rtl">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            المصروفات
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            إدارة جميع المصروفات والفواتير في المنصة.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={handleOpenCategoryModal}
            className="py-2 px-4 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
          >
            إضافة تصنيف
          </button>
          <button
            className="py-2 px-4 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
            onClick={handleAddExpense}
            disabled={!hasPermission || !hasPermission("manage_finances")}
          >
            إضافة مصروف
          </button>
        </div>
      </header>

      {/* Filters */}
      <FiltersBar
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
        hasPermission={hasPermission}
      />

      {/* Main Content */}
      {loading
        ? renderLoadingState()
        : error
        ? renderErrorState()
        : filteredExpenses.length === 0
        ? renderEmptyState()
        : renderExpensesList()}

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setEditExpense(null);
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          {editExpense ? "تعديل مصروف" : "إضافة مصروف"}
        </h2>
        <AddExpenseForm
          initialData={editExpense}
          onSubmit={handleAddEditExpense}
          onCancel={() => {
            setShowAddEdit(false);
            setEditExpense(null);
          }}
          user={user}
        />
      </Modal>

      {/* Category Management Modal */}
      {renderCategoryModal()}
    </div>
  );
}
