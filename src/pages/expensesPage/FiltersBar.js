import React from "react";
import PropTypes from "prop-types";

const STATUS_LABELS = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

const FiltersBar = ({
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  onAdd,
  hasPermission,
  categories = [],
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <select
          className="rounded-lg border text-center px-7 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">كل التصنيفات</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameAr}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg text-center px-7 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">كل الحالات</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          placeholder="ابحث في الوصف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

FiltersBar.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nameAr: PropTypes.string.isRequired,
    })
  ),
};

export default FiltersBar;
