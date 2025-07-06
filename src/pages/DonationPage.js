import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import DonationForm from "../components/DonationForm/DonationForm";
import { CATEGORIES } from "../constants";

const DonationPage = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get preselected campaign from URL
  const preselectedCampaign = searchParams.get("campaign");

  // Simulate campaigns data
  useEffect(() => {
    const mockCampaigns = [
      {
        id: "emergency-flood",
        name: "الإغاثة الطارئة - الفيضانات",
        description:
          "مساعدة الأسر المتأثرة بالفيضانات الأخيرة في السعاتة الدومة",
        targetAmount: 500000,
        currentAmount: 320000,
        category: "emergency",
        isEmergency: true,
        image: "/images/campaigns/flood-relief.jpg",
        beneficiaryCount: 150,
        location: "Assaatah Al-Doma, Khartoum",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-31"),
        status: "active",
      },
      {
        id: "education-school",
        name: "بناء مدرسة الأمل",
        description: "بناء مدرسة جديدة لتعليم 200 طفل محروم من التعليم",
        targetAmount: 800000,
        currentAmount: 450000,
        category: "education",
        isEmergency: false,
        image: "/images/campaigns/school-building.jpg",
        beneficiaryCount: 200,
        location: "Assaatah Al-Doma, Khartoum",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-30"),
        status: "active",
      },
      {
        id: "healthcare-clinic",
        name: "عيادة صحية متنقلة",
        description: "توفير الرعاية الصحية الأساسية للمناطق النائية",
        targetAmount: 300000,
        currentAmount: 180000,
        category: "healthcare",
        isEmergency: false,
        image: "/images/campaigns/health-clinic.jpg",
        beneficiaryCount: 500,
        location: "Assaatah Al-Doma, Khartoum",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-05-31"),
        status: "active",
      },
      {
        id: "water-wells",
        name: "حفر آبار المياه",
        description: "حفر آبار جديدة وتوفير المياه النظيفة",
        targetAmount: 400000,
        currentAmount: 220000,
        category: "water",
        isEmergency: false,
        image: "/images/campaigns/water-wells.jpg",
        beneficiaryCount: 300,
        location: "Assaatah Al-Doma, Khartoum",
        startDate: new Date("2024-01-20"),
        endDate: new Date("2024-04-30"),
        status: "active",
      },
    ];

    setCampaigns(mockCampaigns);

    // Set preselected campaign
    if (preselectedCampaign) {
      const campaign = mockCampaigns.find((c) => c.id === preselectedCampaign);
      if (campaign) {
        setSelectedCampaign(campaign);
      }
    }

    setIsLoading(false);
  }, [preselectedCampaign]);

  // Simulate recent donations
  useEffect(() => {
    const mockRecentDonations = [
      {
        id: 1,
        amount: 500,
        donorName: "أحمد محمد",
        message: "أتمنى أن يساعد هذا التبرع",
        country: "SD",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: 2,
        amount: 1000,
        donorName: "فاطمة علي",
        message: "من القلب إلى القلب",
        country: "SA",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        id: 3,
        amount: 250,
        donorName: "محمد حسن",
        message: "أدعو الله أن يقبل تبرعي",
        country: "AE",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: 4,
        amount: 750,
        donorName: "عائشة أحمد",
        message: "لأطفال السعاتة الدومة",
        country: "KW",
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      },
    ];

    setRecentDonations(mockRecentDonations);
  }, []);

  // Handle donation success
  const handleDonationSuccess = (donation) => {
    // showDonationSuccess(donation.amount, donation.currency); // Removed undefined function
    // Optionally, show a success message:
    // alert(`Donation of ${donation.amount} ${donation.currency} successful!`);
    // Add to recent donations
    setRecentDonations((prev) => [
      {
        id: Date.now(),
        amount: donation.amount,
        donorName: donation.isAnonymous ? "متبرع مجهول" : donation.donorName,
        message: donation.metadata?.dedicationMessage || "",
        country: donation.metadata?.country || "SD",
        timestamp: new Date(),
      },
      ...prev.slice(0, 3),
    ]);
  };

  // Handle donation error
  const handleDonationError = (error) => {
    console.error("Donation error:", error);
  };

  // Get progress percentage
  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  // Get time remaining
  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "انتهى";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} يوم متبقي`;
    } else {
      return `${hours} ساعة متبقية`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              تبرع الآن
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              ساعد أهالي السعاتة الدومة وكن جزءاً من التغيير الإيجابي في حياتهم
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Campaign Selection */}
            {!selectedCampaign && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  اختر الحملة
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="relative mb-4">
                        <img
                          src={campaign.image}
                          alt={campaign.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {campaign.isEmergency && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            طارئ
                          </span>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {CATEGORIES[campaign.category]?.name}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {campaign.name}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {campaign.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            التقدم:
                          </span>
                          <span className="font-semibold">
                            {getProgressPercentage(
                              campaign.currentAmount,
                              campaign.targetAmount
                            ).toFixed(1)}
                            %
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${getProgressPercentage(
                                campaign.currentAmount,
                                campaign.targetAmount
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {campaign.currentAmount.toLocaleString()} SDG
                          </span>
                          <span>
                            {campaign.targetAmount.toLocaleString()} SDG
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>👥 {campaign.beneficiaryCount} مستفيد</span>
                        <span>{getTimeRemaining(campaign.endDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donation Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <DonationForm
                initialAmount={selectedCampaign ? 100 : 0}
                preselectedCampaign={selectedCampaign?.id}
                showRecurring={true}
                onSuccess={handleDonationSuccess}
                onError={handleDonationError}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Selected Campaign Info */}
            {selectedCampaign && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="text-center mb-4">
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                  >
                    ← تغيير الحملة
                  </button>
                </div>

                <div className="relative mb-4">
                  <img
                    src={selectedCampaign.image}
                    alt={selectedCampaign.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {selectedCampaign.isEmergency && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      URGENT
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedCampaign.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {selectedCampaign.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      المبلغ المطلوب:
                    </span>
                    <span className="font-semibold">
                      {selectedCampaign.targetAmount.toLocaleString()} SDG
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      المبلغ المحقق:
                    </span>
                    <span className="font-semibold text-primary-600">
                      {selectedCampaign.currentAmount.toLocaleString()} SDG
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      المتبقي:
                    </span>
                    <span className="font-semibold">
                      {(
                        selectedCampaign.targetAmount -
                        selectedCampaign.currentAmount
                      ).toLocaleString()}{" "}
                      SDG
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${getProgressPercentage(
                          selectedCampaign.currentAmount,
                          selectedCampaign.targetAmount
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {getProgressPercentage(
                      selectedCampaign.currentAmount,
                      selectedCampaign.targetAmount
                    ).toFixed(1)}
                    % مكتمل
                  </div>
                </div>
              </div>
            )}

            {/* Recent Donations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                التبرعات الأخيرة
              </h3>

              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {donation.donorName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {donation.donorName}
                          </p>
                          {donation.message && (
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              "{donation.message}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">
                            {donation.amount} SDG
                          </p>
                          <p className="text-gray-500 text-xs">
                            {donation.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                لماذا تثق بنا؟
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      شفافية كاملة
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      نعرض جميع التقارير المالية
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      حماية البيانات
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      معلوماتك محمية ومشفرة
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600"
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
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      تأثير مباشر
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      نرى تأثير تبرعاتك مباشرة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                الأسئلة الشائعة
              </h3>

              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
                    كيف أعرف أن تبرعي وصل؟
                    <svg
                      className="w-4 h-4 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    نرسل لك تقريراً مفصلاً عن تأثير تبرعك مع الصور والتحديثات
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
                    هل التبرعات معفاة من الضرائب؟
                    <svg
                      className="w-4 h-4 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    نعم، التبرعات معفاة من الضرائب في السودان
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
                    كيف يمكنني إلغاء التبرع الشهري؟
                    <svg
                      className="w-4 h-4 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    يمكنك إلغاء التبرع الشهري من لوحة التحكم أو التواصل معنا
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
