import tempLogo from "../../assets/tempLogo.png";
import React from "react";
import ReactDOMServer from "react-dom/server";
import ExportHeader from "../../components/export/ExportHeader";
import ExportFooter from "../../components/export/ExportFooter";

export default async function generateDonationDetailsHtml({
  donation,
  orgInfo,
  campaigns,
  getStatusText,
  user,
}) {
  // Find campaign name
  const campaignObj =
    donation.campaign && donation.campaign !== "general"
      ? (campaigns || []).find(
          (c) => c.id === donation.campaign || c.name === donation.campaign
        )
      : null;

  // Format date
  let date = donation.createdAt || donation.date;
  if (date && date.toDate) date = date.toDate();
  if (typeof date === "string" || typeof date === "number")
    date = new Date(date);
  if (!(date instanceof Date) || isNaN(date.getTime())) date = new Date();
  const formattedDate = date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Logo logic: always use remote logo if available, else fallback
  const remoteLogo =
    orgInfo?.logo ||
    "https://firebasestorage.googleapis.com/v0/b/shoply-31172.firebasestorage.app/o/logos%2F1752131902280_tempLogo.png?alt=media&token=b5608068-d7a8-4383-afe7-4282e0b25c82";

  // Donation details as table rows
  const tableRows = [
    { label: "رقم الإيصال", value: donation.receiptNumber || donation.id },
    {
      label: "اسم المتبرع",
      value: donation.isAnonymous ? "فاعل خير" : donation.donorName,
    },
    { label: "رقم الجوال", value: donation.donorPhone || "-" },
    { label: "المبلغ", value: `${donation.amount} ريال` },
    {
      label: "الحالة",
      value: getStatusText ? getStatusText(donation.status) : donation.status,
    },
    { label: "الحملة", value: campaignObj ? campaignObj.name : "تبرع عام" },
    { label: "تاريخ التبرع", value: formattedDate },
  ];
  if (donation.notes) {
    tableRows.push({ label: "ملاحظات", value: donation.notes });
  }

  // Compose the full HTML
  const exportHeader = ReactDOMServer.renderToStaticMarkup(
    <ExportHeader orgInfo={{ ...orgInfo, logo: remoteLogo }} />
  );
  const exportFooter = ReactDOMServer.renderToStaticMarkup(
    <ExportFooter orgInfo={orgInfo} user={user} />
  );

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إيصال تبرع</title>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f0f2f5;
          font-family: 'Tajawal', 'Cairo', sans-serif;
          direction: rtl;
          color: #212529;
        }
        .container {
          width: 794px;
          height: 1123px;
          background: #fff;
          margin: 24px auto;
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(25,135,84,0.10);
          border: 1.5px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
          overflow: hidden;
          padding: 40px;
        }
        .receipt-title {
          font-family: 'Cairo', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin: 16px 0 24px 0;
          color: #198754;
          text-align: center;
        }
        .details-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 24px 0 32px 0;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(25,135,84,0.04);
        }
        .details-table th, .details-table td {
          padding: 16px 14px;
          font-size: 17px;
        }
        .details-table th {
          background: #f8f9fa;
          color: #198754;
          font-weight: 700;
          text-align: right;
          width: 180px;
          border-bottom: 1px solid #e5e7eb;
        }
        .details-table td {
          color: #222;
          font-weight: 500;
          background: #fff;
          border-bottom: 1px solid #f1f3f4;
        }
        .details-table tr:last-child th, .details-table tr:last-child td {
          border-bottom: none;
        }
        .footer {
          margin-top: auto;
          padding-top: 20px;
          border-top: 2px solid #198754;
          text-align: center;
          font-size: 14px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${exportHeader}
        <h2 class="receipt-title">إيصال تبرع</h2>
        <table class="details-table">
          <tbody>
            ${tableRows
              .map(
                (row, idx) => `
                  <tr>
                    <th>${row.label}</th>
                    <td>${row.value}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
        ${exportFooter}
      </div>
    </body>
    </html>
  `;
}
