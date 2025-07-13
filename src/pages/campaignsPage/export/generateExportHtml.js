import React from "react";
import ReactDOMServer from "react-dom/server";
import ExportFooter from "../../../components/export/ExportFooter";
import ExportHeader from "../../../components/export/ExportHeader";
import tempLogo from "../../../assets/tempLogo.png";

/**
 * Converts an imported image asset into a Base64 data URL.
 * @param {string} imageSrc - The imported image source.
 * @returns {string} The Base64 data URL.
 */
function getBase64Image(imageSrc) {
  if (imageSrc && imageSrc.startsWith("data:image")) {
    return imageSrc;
  }
  return tempLogo;
}

export async function generateExportHtml({ orgInfo, campaigns, user }) {
  // --- Logo Handling ---
  

  // --- Render React components to static HTML ---
  const headerHtml = ReactDOMServer.renderToStaticMarkup(
    <ExportHeader orgInfo={orgInfo} />
  );
  const footerHtml = ReactDOMServer.renderToStaticMarkup(
    <ExportFooter orgInfo={orgInfo} user={user} />
  );

  // --- Stats Calculation ---
  

  // --- Table Row Generation ---
  const campaignsTableRows = campaigns
    .map(
      (campaign) => `
    <tr>
      <td>${campaign.name}</td>
      <td>${getStatusText(campaign.status)}</td>
      <td>${new Intl.NumberFormat("ar-SD").format(campaign.goal)} ج.س</td>
      <td>${new Intl.NumberFormat("ar-SD").format(campaign.raised)} ج.س</td>
      <td>${formatDate(campaign.endDate)}</td>
    </tr>
  `
    )
    .join("");

  // --- HTML Structure ---
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تقرير الحملات</title>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f0f2f5;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          color: #212529;
        }
        .container {
          width: 794px;
          min-height: 1123px;
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
        .report-title {
          font-family: 'Cairo', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 24px 0;
          color: #198754;
          text-align: center;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .report-table th, .report-table td {
          border: 1px solid #dee2e6;
          padding: 8px;
          text-align: right;
        }
        .report-table th {
          background-color: #f8f9fa;
          font-weight: 600;
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
        ${headerHtml}
        <h2 class="report-title">تقرير الحملات</h2>
        <table class="report-table">
          <thead>
            <tr>
              <th>اسم الحملة</th>
              <th>الحالة</th>
              <th>الهدف</th>
              <th>المبلغ المحصل</th>
              <th>تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            ${campaignsTableRows}
          </tbody>
        </table>
        ${footerHtml}
      </div>
    </body>
    </html>
  `;
}

// Helper functions
function getStatusText(status) {
  const statusMap = {
    active: "نشطة",
    completed: "مكتملة",
    paused: "متوقفة",
    planning: "قيد التخطيط",
  };
  return statusMap[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return "غير محدد";
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}