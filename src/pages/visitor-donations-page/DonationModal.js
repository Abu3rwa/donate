import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function DonationModal({ open, onClose, onSubmit, campaign }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    amount: "",
    notes: "",
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    } else {
      setReceiptFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Fraud detection if receipt file is present
    if (receiptFile) {
      // Fraud detection logic removed
      // if (fraudReport.fraudScore >= 40) {
      //   alert(
      //     "تم رفع الإيصال، لكن هناك مشكلة في صحة الإيصال. سيتم مراجعة تبرعك من قبل الإدارة قبل اعتماده."
      //   );
      //   setSubmitting(false);
      //   if (onSubmit) onSubmit({ ...form, receiptFile, fraudReport });
      //   if (onClose) onClose();
      //   return;
      // } else if (fraudReport.fraudScore > 0) {
      //   alert(
      //     "تم رفع الإيصال، لكن هناك بعض الملاحظات عليه. سيتم مراجعة تبرعك للتأكد من صحته."
      //   );
      //   setSubmitting(false);
      //   if (onSubmit) onSubmit({ ...form, receiptFile, fraudReport });
      //   if (onClose) onClose();
      //   return;
      // }
    }
    if (onSubmit) onSubmit({ ...form, receiptFile });
    setSubmitting(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} dir="rtl" maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          pr: 3,
          pl: 1,
          fontWeight: 900,
          fontFamily: "Tajawal, Cairo, sans-serif",
          color: "#198754",
          fontSize: "1.3rem",
        }}
      >
        تبرع لحملة {campaign?.name ? `- ${campaign.name}` : ""}
        <IconButton
          aria-label="إغلاق"
          onClick={onClose}
          sx={{ position: "absolute", left: 8, top: 8, color: "#888" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-right"
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              dir="ltr"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-right"
              placeholder="مثال: +249 123 456 789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-right"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              مبلغ التبرع (جنيه سوداني) <span className="text-red-500">*</span>
            </label>
            <input
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-right"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              ملاحظات إضافية
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none text-right"
              placeholder="أي تعليمات أو ملاحظات إضافية..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              إيصال التحويل البنكي <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              required
              className="w-full"
            />
            {receiptFile && (
              <div className="mt-2 text-right text-sm text-blue-700">
                {receiptFile.type && receiptFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(receiptFile)}
                    alt="إيصال التحويل"
                    className="inline-block max-h-32 rounded border mt-2"
                  />
                ) : (
                  <span>تم اختيار الملف: {receiptFile.name}</span>
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl mt-2"
          >
            {submitting ? "جاري الإرسال..." : "تبرع الآن"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
