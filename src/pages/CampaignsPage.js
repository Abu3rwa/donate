import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { CATEGORIES_AR, STATUS_TYPES } from "../constants";

// Import images
import { mockCampaigns } from "../data/campaignsData";

// Calculate progress percentage
const calculateProgress = (raised, goal) => {
  return Math.min((raised / goal) * 100, 100);
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "completed":
      return "bg-blue-500";
    case "planning":
      return "bg-yellow-500";
    case "paused":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Get urgency color
const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const CampaignsPage = () => {
  const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filtered = mockCampaigns;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.category === selectedCategory
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.status === selectedStatus
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          campaign.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredCampaigns(filtered);
  }, [selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            الحملات الخيرية
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            حملاتنا الخيرية المخصصة لمساعدة أهالي السعاتة الدومة في الخرطوم،
            السودان
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category and Status Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">جميع الفئات</option>
                {Object.entries(CATEGORIES_AR).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">جميع الحالات</option>
                {Object.entries(STATUS_TYPES).map(([key, status]) => (
                  <option key={key} value={key}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في الحملات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white w-64"
                dir="rtl"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCampaigns.length === 0 ? (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                لا توجد حملات
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                لم يتم العثور على حملات تطابق معايير البحث.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    {campaign.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          مميز
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {STATUS_TYPES[campaign.status]?.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getUrgencyColor(
                          campaign.urgency
                        )}`}
                      >
                        {campaign.urgency === "high"
                          ? "عاجل"
                          : campaign.urgency === "medium"
                          ? "متوسط"
                          : "منخفض"}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {campaign.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>التقدم</span>
                        <span>
                          {calculateProgress(
                            campaign.raised,
                            campaign.goal
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateProgress(
                              campaign.raised,
                              campaign.goal
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Campaign Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          الهدف
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(campaign.goal)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          المجمع
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(campaign.raised)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          المتبرعين
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {campaign.donors}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          المتبقي
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(campaign.goal - campaign.raised)}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {campaign.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="flex-1 text-center bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                      >
                        تفاصيل الحملة
                      </Link>
                      {campaign.status === "active" && (
                        <Link
                          to={`/donate?campaign=${campaign.id}`}
                          className="flex-1 text-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                        >
                          تبرع الآن
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ابدأ حملتك الخيرية
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            هل تريد إنشاء حملة خيرية لمساعدة أهالي السعاتة الدومة؟ تواصل معنا
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            تواصل معنا
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CampaignsPage;
