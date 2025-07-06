import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const DonationForm = ({
  initialAmount = 0,
  preselectedCampaign = null,
  showRecurring = true,
  customAmounts = [25, 50, 100, 250, 500],
  onSuccess,
  onError,
}) => {
  const { t, isArabic } = useLanguage();
  const { currentUser } = useAuth();
  const { showDonationSuccess, showError } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: initialAmount,
    frequency: "one-time",
    campaign: preselectedCampaign,
    isAnonymous: false,
    newsletterSignup: false,
    taxReceipt: true,
    dedicationMessage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser?.displayName || "",
      email: currentUser?.email || "",
      phone: "",
      country: "SD",
      amount: initialAmount,
      frequency: "one-time",
      campaign: preselectedCampaign,
      isAnonymous: false,
      newsletterSignup: false,
      taxReceipt: true,
      dedicationMessage: "",
    },
  });

  const watchedAmount = watch("amount");
  const watchedFrequency = watch("frequency");

  // Impact calculator
  const getImpactMessage = (amount, frequency) => {
    const monthlyAmount = frequency === "monthly" ? amount : amount / 12;

    if (monthlyAmount >= 500) {
      return isArabic()
        ? `تبرعك الشهري سيغطي تكاليف تعليم طفلين لمدة شهر كامل`
        : "Your monthly donation will cover education costs for two children for a full month";
    } else if (monthlyAmount >= 250) {
      return isArabic()
        ? `تبرعك الشهري سيوفر المياه النظيفة لعائلة كاملة لمدة شهر`
        : "Your monthly donation will provide clean water for a full family for a month";
    } else if (monthlyAmount >= 100) {
      return isArabic()
        ? `تبرعك الشهري سيغطي تكاليف الرعاية الصحية لشخص واحد`
        : "Your monthly donation will cover healthcare costs for one person";
    } else {
      return isArabic()
        ? `تبرعك سيساعد في توفير وجبة طعام لشخص محتاج`
        : "Your donation will help provide a meal for someone in need";
    }
  };

  // Handle amount selection
  const handleAmountSelect = (amount) => {
    setValue("amount", amount);
    setFormData((prev) => ({ ...prev, amount }));
  };

  // Handle custom amount input
  const handleCustomAmount = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setValue("amount", amount);
    setFormData((prev) => ({ ...prev, amount }));
  };

  // Handle frequency change
  const handleFrequencyChange = (frequency) => {
    setValue("frequency", frequency);
    setFormData((prev) => ({ ...prev, frequency }));
  };

  // Handle campaign selection
  const handleCampaignSelect = (campaign) => {
    setValue("campaign", campaign);
    setFormData((prev) => ({ ...prev, campaign }));
  };

  // Next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create donation record
      const donation = {
        id: Date.now().toString(),
        amount: data.amount,
        currency: "SDG",
        donorEmail: data.email,
        donorName: data.isAnonymous ? "Anonymous" : data.name,
        isAnonymous: data.isAnonymous,
        paymentMethod: paymentMethod,
        transactionId: `TXN_${Date.now()}`,
        campaign: data.campaign,
        createdAt: new Date(),
        status: "completed",
        impactArea: "Assaatah Al-Doma",
        recurringDonation: data.frequency !== "one-time",
        recurringInterval: data.frequency,
        metadata: {
          country: data.country,
          phone: data.phone,
          newsletterSignup: data.newsletterSignup,
          taxReceipt: data.taxReceipt,
          dedicationMessage: data.dedicationMessage,
        },
      };

      // Show success message
      showDonationSuccess(data.amount, "SDG");

      // Call success callback
      if (onSuccess) {
        onSuccess(donation);
      }

      // Reset form
      setCurrentStep(1);
      setFormData({
        amount: 0,
        frequency: "one-time",
        campaign: null,
        isAnonymous: false,
        newsletterSignup: false,
        taxReceipt: true,
        dedicationMessage: "",
      });
    } catch (error) {
      console.error("Donation error:", error);
      showError("حدث خطأ في معالجة التبرع. يرجى المحاولة مرة أخرى.");

      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Campaigns data
  const campaigns = [
    {
      id: "emergency",
      name: isArabic() ? "الإغاثة الطارئة" : "Emergency Relief",
      isEmergency: true,
    },
    {
      id: "education",
      name: isArabic() ? "التعليم" : "Education",
      isEmergency: false,
    },
    {
      id: "healthcare",
      name: isArabic() ? "الرعاية الصحية" : "Healthcare",
      isEmergency: false,
    },
    {
      id: "water",
      name: isArabic() ? "المياه النظيفة" : "Clean Water",
      isEmergency: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Progress Indicator */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? "bg-primary-500 text-white"
                    : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep
                      ? "bg-primary-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{isArabic() ? "اختر المبلغ" : "Choose Amount"}</span>
          <span>{isArabic() ? "المعلومات الشخصية" : "Personal Info"}</span>
          <span>{isArabic() ? "الدفع" : "Payment"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Step 1: Amount Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {isArabic() ? "اختر مبلغ التبرع" : "Choose Donation Amount"}
              </h3>

              {/* Preset Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {customAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-lg border-2 text-lg font-semibold transition-all duration-200 ${
                      watchedAmount === amount
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                        : "border-gray-300 text-gray-700 hover:border-primary-300 dark:border-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {amount} SDG
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic() ? "مبلغ مخصص" : "Custom Amount"}
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={watchedAmount || ""}
                  onChange={handleCustomAmount}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={isArabic() ? "أدخل المبلغ" : "Enter amount"}
                />
              </div>

              {/* Frequency Selection */}
              {showRecurring && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {isArabic() ? "تكرار التبرع" : "Donation Frequency"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "one-time",
                        label: isArabic() ? "مرة واحدة" : "One-time",
                      },
                      {
                        value: "monthly",
                        label: isArabic() ? "شهرياً" : "Monthly",
                      },
                      {
                        value: "quarterly",
                        label: isArabic() ? "ربع سنوي" : "Quarterly",
                      },
                      {
                        value: "yearly",
                        label: isArabic() ? "سنوياً" : "Yearly",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleFrequencyChange(option.value)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                          watchedFrequency === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                            : "border-gray-300 text-gray-700 hover:border-primary-300 dark:border-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaign Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {isArabic() ? "اختر الحملة" : "Choose Campaign"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {campaigns.map((campaign) => (
                    <button
                      key={campaign.id}
                      type="button"
                      onClick={() => handleCampaignSelect(campaign.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        formData.campaign === campaign.id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
                          : "border-gray-300 hover:border-primary-300 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </span>
                        {campaign.isEmergency && (
                          <span className="text-red-500 text-sm font-semibold">
                            {isArabic() ? "طارئ" : "URGENT"}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Calculator */}
              {watchedAmount > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <svg
                      className="w-6 h-6 text-green-500 mt-0.5"
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
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        {getImpactMessage(watchedAmount, watchedFrequency)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={!watchedAmount || watchedAmount < 1}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isArabic() ? "التالي" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {isArabic() ? "المعلومات الشخصية" : "Personal Information"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("name")} *
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={isArabic() ? "الاسم الكامل" : "Full Name"}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{t("required")}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("email")} *
                  </label>
                  <input
                    {...register("email", {
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={
                      isArabic() ? "البريد الإلكتروني" : "Email Address"
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.type === "required"
                        ? t("required")
                        : t("invalidEmail")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("phone")} ({t("optional")})
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={isArabic() ? "رقم الهاتف" : "Phone Number"}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isArabic() ? "البلد" : "Country"}
                  </label>
                  <select
                    {...register("country")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="SD">السودان - Sudan</option>
                    <option value="SA">السعودية - Saudi Arabia</option>
                    <option value="AE">الإمارات - UAE</option>
                    <option value="KW">الكويت - Kuwait</option>
                    <option value="QA">قطر - Qatar</option>
                    <option value="BH">البحرين - Bahrain</option>
                    <option value="OM">عمان - Oman</option>
                    <option value="JO">الأردن - Jordan</option>
                    <option value="LB">لبنان - Lebanon</option>
                    <option value="EG">مصر - Egypt</option>
                    <option value="US">الولايات المتحدة - United States</option>
                    <option value="GB">المملكة المتحدة - United Kingdom</option>
                    <option value="CA">كندا - Canada</option>
                    <option value="AU">أستراليا - Australia</option>
                  </select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    {...register("isAnonymous")}
                    type="checkbox"
                    id="anonymous"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="anonymous"
                    className="mr-3 rtl:ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {isArabic() ? "تبرع مجهول" : "Anonymous Donation"}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register("newsletterSignup")}
                    type="checkbox"
                    id="newsletter"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="newsletter"
                    className="mr-3 rtl:ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {isArabic()
                      ? "اشترك في النشرة الإخبارية"
                      : "Subscribe to Newsletter"}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register("taxReceipt")}
                    type="checkbox"
                    id="taxReceipt"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="taxReceipt"
                    className="mr-3 rtl:ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {isArabic() ? "أريد إيصال ضريبي" : "I want a tax receipt"}
                  </label>
                </div>
              </div>

              {/* Dedication Message */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic()
                    ? "رسالة إهداء (اختياري)"
                    : "Dedication Message (Optional)"}
                </label>
                <textarea
                  {...register("dedicationMessage")}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={
                    isArabic()
                      ? "اكتب رسالة إهداء أو تذكار..."
                      : "Write a dedication or memorial message..."
                  }
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary px-8 py-3"
              >
                {isArabic() ? "السابق" : "Previous"}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary px-8 py-3"
              >
                {isArabic() ? "التالي" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {isArabic() ? "إتمام الدفع" : "Complete Payment"}
              </h3>

              {/* Payment Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {isArabic() ? "ملخص التبرع" : "Donation Summary"}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {isArabic() ? "المبلغ:" : "Amount:"}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {watchedAmount} SDG
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {isArabic() ? "التكرار:" : "Frequency:"}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {watchedFrequency === "one-time"
                        ? isArabic()
                          ? "مرة واحدة"
                          : "One-time"
                        : watchedFrequency === "monthly"
                        ? isArabic()
                          ? "شهرياً"
                          : "Monthly"
                        : watchedFrequency === "quarterly"
                        ? isArabic()
                          ? "ربع سنوي"
                          : "Quarterly"
                        : isArabic()
                        ? "سنوياً"
                        : "Yearly"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {isArabic() ? "الحملة:" : "Campaign:"}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {campaigns.find((c) => c.id === formData.campaign)?.name}
                    </span>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-600" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">
                      {isArabic() ? "الإجمالي:" : "Total:"}
                    </span>
                    <span className="text-primary-600">
                      {watchedAmount} SDG
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {isArabic() ? "اختر طريقة الدفع" : "Choose Payment Method"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      value: "card",
                      label: isArabic() ? "بطاقة ائتمان" : "Credit Card",
                      icon: "💳",
                    },
                    { value: "paypal", label: "PayPal", icon: "🔵" },
                    {
                      value: "bank",
                      label: isArabic() ? "تحويل بنكي" : "Bank Transfer",
                      icon: "🏦",
                    },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                        paymentMethod === method.value
                          ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                          : "border-gray-300 text-gray-700 hover:border-primary-300 dark:border-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="font-medium">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse mb-6">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>{isArabic() ? "آمن 100%" : "100% Secure"}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 text-blue-500"
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
                  <span>{isArabic() ? "مشفر" : "Encrypted"}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 text-purple-500"
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
                  <span>{isArabic() ? "متحقق" : "Verified"}</span>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 rtl:space-x-reverse mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {isArabic()
                    ? "أوافق على الشروط والأحكام وسياسة الخصوصية"
                    : "I agree to the Terms and Conditions and Privacy Policy"}
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary px-8 py-3"
              >
                {isArabic() ? "السابق" : "Previous"}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>
                      {isArabic() ? "جاري المعالجة..." : "Processing..."}
                    </span>
                  </div>
                ) : (
                  <span>
                    {isArabic() ? "إتمام التبرع" : "Complete Donation"}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DonationForm;
