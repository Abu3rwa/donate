import React from "react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import tempLogo from "../../assets/tempLogo.png";
import "../../styles/Receipt.css";
import OrgInfo from "../../components/OrgInfo";
import AdminInfo from "../../components/AdminInfo";
import ReactDOMServer from "react-dom/server";
import ExportHeader from "../../components/export/ExportHeader";

// Helper to get CSS content for export
async function getReceiptCssContent() {
  const response = await fetch("/Receipt.css");
  if (response.ok) {
    return await response.text();
  }
  return "";
}

function getBase64Image(imageSrc) {
  if (imageSrc && imageSrc.startsWith("data:image")) {
    return imageSrc;
  }
  return tempLogo;
}

async function getUserById(userId) {
  return {
    name: "اسم المسؤول",
    email: "admin@email.com",
  };
}

export async function generateReceiptHtml({
  donation,
  campaigns,
  getStatusText,
  orgInfo,
}) {
  const campaignObj =
    donation.campaign && donation.campaign !== "general"
      ? (campaigns || []).find(
          (c) => c.id === donation.campaign || c.name === donation.campaign
        )
      : null;
  const adminInfo = donation.createdBy
    ? await getUserById(donation.createdBy)
    : null;
  const receiptData = {
    receiptNumber: donation.receiptNumber || donation.id || "N/A",
    donorName: donation.isAnonymous ? "فاعل خير" : donation.donorName,
    donorPhone: donation.donorPhone || "غير متوفر",
    donorEmail: donation.donorEmail || "غير متوفر",
    amount: new Intl.NumberFormat("ar-SD", {
      style: "currency",
      currency: donation.currency || "SDG",
    }).format(donation.amount || 0),
    campaignName: campaignObj
      ? campaignObj.name
      : donation.campaign === "general"
      ? "تبرع عام"
      : "غير محدد",
    paymentMethod:
      donation.paymentMethod === "manual_entry"
        ? "إدخال يدوي"
        : donation.paymentMethod || "غير محدد",
    date: new Date(
      donation.createdAt?.seconds * 1000 || donation.createdAt || Date.now()
    ).toLocaleDateString("ar-EG"),
    status: getStatusText ? getStatusText(donation.status) : donation.status,
    notes: donation.notes || "لا يوجد",
    recurringAmount: donation.recurringAmount,
    recurringInterval: donation.recurringInterval,
    recurringDonation: donation.recurringDonation,
  };
  const logoUrl = getBase64Image(orgInfo?.logo);
  const orgName = orgInfo?.name || "منظمة السعاتة";
  const longName = orgInfo?.longName || "";
  const orgDescription = orgInfo?.description || "";
  const orgLocation = orgInfo?.location || "";
  const website = orgInfo?.website || "";
  const phones = orgInfo?.contacts?.phones || [];
  const emails = orgInfo?.contacts?.emails || [];
  const socials = orgInfo?.social || [];
  // Render OrgInfo and AdminInfo as static HTML
  const orgSection = ReactDOMServer.renderToStaticMarkup(
    <OrgInfo orgInfo={orgInfo} showLogo={false} />
  );
  const adminSection = adminInfo
    ? ReactDOMServer.renderToStaticMarkup(<AdminInfo adminInfo={adminInfo} />)
    : "";
  const campaignSection = campaignObj
    ? `
      <div class="receipt-section-box">
        <div class="receipt-section-title">تفاصيل الحملة</div>
        <div class="item"><strong>اسم الحملة:</strong> ${campaignObj.name}</div>
        <div class="item"><strong>الهدف:</strong> ${new Intl.NumberFormat(
          "ar-SD"
        ).format(campaignObj.goal || 0)} ج.س</div>
        <div class="item"><strong>المبلغ المحصّل:</strong> ${new Intl.NumberFormat(
          "ar-SD"
        ).format(campaignObj.raised || 0)} ج.س</div>
              </div>
    `
    : "";
  const notesSection =
    receiptData.notes && receiptData.notes !== "لا يوجد"
      ? `<div class="receipt-section-box"><div class="receipt-section-title">ملاحظات</div><div class="item">${receiptData.notes}</div></div>`
      : "";
  const verificationUrl = `${window.location.origin}/verify-receipt/${donation.id}`;
  const qrCodeUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "H",
  });
  const cssContent = await getReceiptCssContent();
  // Render ExportHeader as static HTML
  const exportHeader = ReactDOMServer.renderToStaticMarkup(
    <ExportHeader orgInfo={orgInfo} />
  );
  let html = `
      <style>${cssContent}</style>
      <div class="receipt-container" style="background:#fff;max-width:800px;margin:32px auto;padding:32px 24px;border-radius:12px;box-shadow:0 0 10px rgba(0,0,0,0.07);font-family:'Tajawal','Cairo','Arial',sans-serif;direction:rtl;">
        ${exportHeader}
        <div class="receipt-details" style="margin-bottom:24px;">
          <h2 style="font-size:1.7rem;color:#198754;margin-bottom:10px;font-weight:700;">إيصال تبرع</h2>
          <div style="font-size:1rem;color:#444;"><strong>رقم الإيصال:</strong> ${
            receiptData.receiptNumber
          }</div>
          <div style="font-size:1rem;color:#444;"><strong>التاريخ:</strong> ${
            receiptData.date
          }</div>
            </div>
        <table class="receipt-table" style="width:100%;border-collapse:collapse;margin-bottom:32px;">
          <thead>
            <tr>
              <th style="background:#f8f8f8;color:#198754;font-weight:700;padding:12px;border:1px solid #eee;">اسم المتبرع</th>
              <th style="background:#f8f8f8;color:#198754;font-weight:700;padding:12px;border:1px solid #eee;">المبلغ</th>
              <th style="background:#f8f8f8;color:#198754;font-weight:700;padding:12px;border:1px solid #eee;">الحملة</th>
              <th style="background:#f8f8f8;color:#198754;font-weight:700;padding:12px;border:1px solid #eee;">طريقة الدفع</th>
              <th style="background:#f8f8f8;color:#198754;font-weight:700;padding:12px;border:1px solid #eee;">الحالة</th>
            </tr>
          </thead>
              <tbody>
            <tr>
              <td style="padding:12px;border:1px solid #eee;">${
                receiptData.donorName
              }</td>
              <td style="padding:12px;border:1px solid #eee;font-weight:700;color:#198754;">${
                receiptData.amount
              }</td>
              <td style="padding:12px;border:1px solid #eee;">${
                receiptData.campaignName
              }</td>
              <td style="padding:12px;border:1px solid #eee;">${
                receiptData.paymentMethod
              }</td>
              <td style="padding:12px;border:1px solid #eee;">
                <span class="receipt-status-badge ${
                  receiptData.status === "مشبوه"
                    ? "suspicious"
                    : receiptData.status === "خطأ"
                    ? "error"
                    : receiptData.status === "مكتمل"
                    ? "success"
                    : ""
                }" style="display:inline-block;padding:6px 14px;border-radius:6px;font-weight:700;color:#fff;background:${
    receiptData.status === "مكتمل"
      ? "#198754"
      : receiptData.status === "مشبوه"
      ? "#ffc107"
      : receiptData.status === "خطأ"
      ? "#dc3545"
      : "#6c757d"
  };">${receiptData.status}</span>
              </td>
            </tr>
              </tbody>
            </table>
        ${campaignSection}
        ${adminSection}
        ${orgSection}
        ${notesSection}
        <div class="receipt-qr-code-section" style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px dashed #eee;">
          <img src="${qrCodeUrl}" alt="رمز QR للتحقق" style="width:120px;height:120px;border:1px solid #eee;padding:5px;border-radius:8px;"/>
          <div style="font-size:14px;color:#777;margin-top:8px;">امسح الرمز للتحقق من صحة الإيصال</div>
        </div>
        <footer class="receipt-footer" style="text-align:center;margin-top:40px;padding-top:20px;border-top:2px solid #198754;font-size:15px;color:#555;">
          <p style="margin:5px 0;font-weight:600;">شكراً لدعمكم. تبرعكم يصنع فرقاً.</p>
          <p style="margin:5px 0;">${orgName} | ${emails.join(
    " | "
  )} | ${phones.join(" | ")}</p>
          ${
            website
              ? `<p style='margin:5px 0;'><a href="${website}" class='receipt-link' style='color:#198754;text-decoration:underline;'>${website}</a></p>`
              : ""
          }
        </footer>
      </div>
    `;
  return html;
}

export async function generateReceiptExportHtml({
  donation,
  campaigns,
  getStatusText,
  orgInfo,
}) {
  const html = await generateReceiptHtml({
    donation,
    campaigns,
    getStatusText,
    orgInfo,
  });
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إيصال تبرع</title>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin:0;padding:0;background:#fff;">
      ${html}
      </body>
      </html>
    `;
}

const ReceiptGenerator = ({ donation, campaigns, getStatusText, orgInfo }) => {
  // Download as image (no modal, no preview)
  const handleDownload = async () => {
    const htmlContent = await generateReceiptHtml({
      donation,
      campaigns,
      getStatusText,
      orgInfo,
    });
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "800px";
    tempContainer.style.background = "white";
    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);

    const canvas = await html2canvas(tempContainer, {
      width: 800,
      height: tempContainer.scrollHeight,
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
    });

    document.body.removeChild(tempContainer);

    canvas.toBlob((blob) => {
      if (!blob) {
        alert("حدث خطأ أثناء إنشاء صورة الإيصال.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${donation.id}_${
        new Date().toISOString().split("T")[0]
      }.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // Download as HTML file
  const handleDownloadHtml = async () => {
    const htmlContent = await generateReceiptHtml({
      donation,
      campaigns,
      getStatusText,
      orgInfo,
    });
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt_${donation.id}_${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-[#198754] hover:bg-[#146c43] text-white rounded-lg font-medium"
      >
        تحميل الإيصال (صورة)
      </button>
      <button
        onClick={handleDownloadHtml}
        className="px-4 py-2 bg-[#3cc400] hover:bg-[#216c00] text-white rounded-lg font-medium"
      >
        تحميل الإيصال (ملف HTML)
      </button>
    </div>
  );
};

export default ReceiptGenerator;
