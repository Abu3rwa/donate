import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import AddCampaignForm from "./dashboard/AddCampaignForm";
import {
  getAllCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign
} from "../services/compaignService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const StatusBadge = ({ status }) => {
  const statusStyles = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    paused:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    planning: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  const statusText = {
    active: "نشطة",
    completed: "مكتملة",
    paused: "متوقفة",
    planning: "قيد التخطيط",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status]}`}
    >
      {statusText[status]}
    </span>
  );
};

const ProgressBar = ({ raised, goal }) => {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const color = percentage >= 100 ? "bg-emerald-500" : "bg-blue-500";
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-300"}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Modal = ({ children, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const { user } = useAuth();

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message || "فشل في تحميل الحملات.");
      toast.error(err.message || "فشل في تحميل الحملات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Add campaign handler
  const handleAddCampaign = async (data) => {
    try {
      setLoading(true);
      await addCampaign(data);
      toast.success("تمت إضافة الحملة بنجاح!");
      setIsModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      toast.error(err.message || "فشل في إضافة الحملة.");
    } finally {
      setLoading(false);
    }
  };

  // Edit campaign handler
  const handleEditCampaign = async (id, data) => {
    try {
      setLoading(true);
      await updateCampaign(id, data);
      toast.success("تم تحديث الحملة بنجاح!");
      setEditCampaign(null);
      fetchCampaigns();
    } catch (err) {
      toast.error(err.message || "فشل في تحديث الحملة.");
    } finally {
      setLoading(false);
    }
  };

  // Delete campaign handler
  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الحملة؟")) return;
    try {
      setLoading(true);
      await deleteCampaign(id);
      toast.success("تم حذف الحملة بنجاح!");
      fetchCampaigns();
    } catch (err) {
      toast.error(err.message || "فشل في حذف الحملة.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => statusFilter === "all" || c.status === statusFilter)
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [campaigns, statusFilter, searchQuery]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-0 font-sans" dir="rtl">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">إدارة الحملات</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">عرض وتعديل وإنشاء الحملات الخيرية.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
        >
          <Plus size={20} />
          <span className="font-semibold hidden xs:inline">إنشاء حملة</span>
        </button>
      </header>

      {/* Filters & Search */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          <div className="flex-1 flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              id="search-campaign"
              type="text"
              placeholder="ابحث عن حملة بالاسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-200 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
          <div className="w-full md:w-56">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشطة</option>
              <option value="completed">مكتملة</option>
              <option value="paused">متوقفة</option>
              <option value="planning">قيد التخطيط</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="mr-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">جاري تحميل الحملات...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8 flex items-center gap-4">
            <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-base font-medium text-red-800 dark:text-red-200">خطأ في تحميل البيانات</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</div>
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 gap-y-6">
            {filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-200 group relative min-h-[220px] flex flex-col"
              >
                <div className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{campaign.name}</h3>
                    <StatusBadge status={campaign.status} />
                  </div>
                   <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-xs mb-1 gap-1 sm:gap-0">
                        <span className="text-gray-500 dark:text-gray-400">التقدم</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(campaign.raised || 0)} / {formatCurrency(campaign.goal || 0)}</span>
                      </div>
                      <ProgressBar raised={campaign.raised || 0} goal={campaign.goal || 0} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">تاريخ البدء:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(campaign.startDate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">تاريخ الانتهاء:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(campaign.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-auto pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      className="p-2 sm:p-2.5 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                      title="تعديل الحملة"
                      aria-label="تعديل الحملة"
                      onClick={() => setEditCampaign(campaign)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="p-2 sm:p-2.5 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                      title="حذف الحملة"
                      aria-label="حذف الحملة"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {/* Card hover effect */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/10 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCampaigns.length === 0 && (
          <div className="text-center py-24">
            <svg
              className="mx-auto h-14 w-14 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">لا توجد حملات</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== "all"
                ? "لا توجد حملات تطابق معايير البحث."
                : "لم يتم إنشاء أي حملات بعد."}
            </p>
          </div>
        )}
      </main>

      {/* Add/Edit Campaign Modal */}
      <Modal isOpen={isModalOpen || !!editCampaign} onClose={() => { setIsModalOpen(false); setEditCampaign(null); }}>
        <AddCampaignForm
          onCancel={() => { setIsModalOpen(false); setEditCampaign(null); }}
          onSubmit={editCampaign ? (data) => handleEditCampaign(editCampaign.id, data) : handleAddCampaign}
          initialData={editCampaign}
        />
      </Modal>
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
} 