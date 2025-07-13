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

export async function generateExportHtml({
  orgInfo,
  stats,
  donations,
  campaigns,
  getStatusText,
  user,
}) {
  // Debug export data
  // console.log("Export - orgInfo:", orgInfo);

  // --- Logo Handling ---
  const localLogoBase64 = getBase64Image(orgInfo?.logo);

  // --- Render React components to static HTML ---
  const headerHtml = ReactDOMServer.renderToStaticMarkup(
    <ExportHeader orgInfo={orgInfo} />
  );
  // Ensure adminInfo fields are always defined for ExportFooter

  const footerHtml = ReactDOMServer.renderToStaticMarkup(
    <ExportFooter orgInfo={orgInfo} user={user} />
  );

  // --- Table Row Generation ---
  // (Removed donations table)

  // --- HTML Structure ---
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تقرير التبرعات</title>
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
        .report-title {
          font-family: 'Cairo', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 24px 0;
          color: #198754;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        .stat-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }
        .stat-card .stat-label {
          font-size: 12px;
          color: #198754;
          margin-bottom: 5px;
        }
        .stat-card .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #198754;
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
        <h2 class="report-title">تقرير التبرعات</h2>
        ${
          stats
            ? `
        <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">إجمالي التبرعات</div>
              <div class="stat-value">${new Intl.NumberFormat("ar-SD").format(
                stats.totalAmount
              )} ج.س</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">عدد المتبرعين</div>
              <div class="stat-value">${stats.uniqueDonors}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">عدد التبرعات</div>
              <div class="stat-value">${stats.totalDonations}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">متوسط التبرع</div>
              <div class="stat-value">${new Intl.NumberFormat("ar-SD").format(
                Math.round(stats.averageAmount)
              )} ج.س</div>
            </div>
        </div>
        `
            : ""
        }
        ${footerHtml}
      </div>
    </body>
    </html>
  `;
}
