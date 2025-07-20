/**
 * Modular email footer component with enhanced styling and features
 * @param {string} orgName - Organization name
 * @param {Object} options - Footer options
 * @param {string} options.contactInfo - Contact email or phone
 * @param {string} options.senderName - Name of the sender
 * @param {string} options.senderRole - Role of the sender
 * @param {string} options.logoUrl - Optional logo URL for the footer
 * @param {string} options.website - Organization website URL
 * @param {Array} options.socialLinks - Array of social media links {platform, url, icon?}
 * @param {string} options.address - Physical address
 * @param {string} options.phone - Phone number
 * @param {string} options.brandColor - Brand color for accents
 * @param {string} options.copyrightYear - Copyright year (defaults to current year)
 * @param {boolean} options.compactMode - Use compact layout
 * @returns {string} HTML string for the footer
 */
module.exports = (orgName, options = {}) => {
  const {
    contactInfo,
    senderName,
    senderRole,
    logoUrl,
    website,
    socialLinks = [],
    address,
    phone,
    brandColor = "#1976d2",
    copyrightYear = new Date().getFullYear(),
    compactMode = false,
  } = options;

  // Generate social media icons (using Unicode symbols as fallback)
  const socialIcons = {
    facebook: "📘",
    twitter: "🐦",
    linkedin: "💼",
    instagram: "📷",
    youtube: "📹",
    email: "✉️",
    phone: "📞",
    website: "🌐",
  };

  const socialLinksHtml =
    socialLinks.length > 0
      ? `
    <div style="margin: 8px 0; text-align: center;">
      ${socialLinks
        .map(
          (link) => `
        <a href="${link.url}" style="
          color: ${brandColor}; 
          text-decoration: none; 
          margin: 0 8px;
          font-size: 1.2rem;
        ">
          ${link.icon || socialIcons[link.platform] || "🔗"}
        </a>
      `
        )
        .join("")}
    </div>
  `
      : "";

  if (compactMode) {
    return `
      <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0 8px 0;" />
      <div style="
        background: #f8f9fa; 
        color: #666; 
        text-align: center; 
        padding: 12px 18px; 
        font-size: 0.9rem; 
        border-radius: 0 0 12px 12px;
      ">
        <div style="font-weight: 600; color: ${brandColor}; margin-bottom: 4px;">${orgName}</div>
        ${
          senderName
            ? `<div>${senderName}${senderRole ? ` - ${senderRole}` : ""}</div>`
            : ""
        }
        ${
          contactInfo
            ? `<div><a href="mailto:${contactInfo}" style="color: ${brandColor};">${contactInfo}</a></div>`
            : ""
        }
        <div style="font-size: 0.85rem; color: #999; margin-top: 6px;">© ${copyrightYear} - جميع الحقوق محفوظة</div>
      </div>
    `;
  }

  return `
    <hr style="border:none; border-top:2px solid #e8eaf6; margin:24px 0 0 0;" />
    <div style="
      background: linear-gradient(to bottom, #f8f9fa, #f1f3f4); 
      color: #555; 
      text-align: right; 
      padding: 20px 18px; 
      font-size: 0.95rem; 
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #e0e0e0;
    ">
      <!-- Organization Name -->
      <div style="
        font-weight: bold; 
        color: ${brandColor}; 
        margin-bottom: 8px; 
        font-size: 1.1rem;
        text-align: center;
      ">${orgName}</div>
      
      <!-- Logo -->
      ${
        logoUrl
          ? `
        <div style="text-align: center; margin-bottom: 12px;">
          <img src="${logoUrl}" alt="${orgName}" style="
            width: 80px; 
            height: auto;
            border-radius: 6px;
            opacity: 0.9;
          " />
        </div>
      `
          : ""
      }

      <!-- Sender Information -->
      ${
        senderName
          ? `
        <div style="margin-bottom: 12px; text-align: center;">
          <div style="font-weight: 600; color: #333; margin-bottom: 2px;">
            ${senderName}
            
          </div>
        </div>
      `
          : ""
      }

      <!-- Contact Information Grid -->
      <div style="
        display: table; 
        width: 100%; 
        margin-bottom: 12px;
        border-spacing: 8px 4px;
      ">
        ${
          contactInfo
            ? `
          <div style="display: table-row;">
            <div style="display: table-cell; color: #777; font-size: 0.9em; width: 80px;">البريد:</div>
            <div style="display: table-cell;">
              <a href="mailto:${contactInfo}" style="color: ${brandColor}; text-decoration: none;">${contactInfo}</a>
            </div>
          </div>
        `
            : ""
        }
        ${
          phone
            ? `
          <div style="display: table-row;">
            <div style="display: table-cell; color: #777; font-size: 0.9em; width: 80px;">الهاتف:</div>
            <div style="display: table-cell;">
              <a href="tel:${phone}" style="color: ${brandColor}; text-decoration: none;">${phone}</a>
            </div>
          </div>
        `
            : ""
        }
        ${
          website
            ? `
          <div style="display: table-row;">
            <div style="display: table-cell; color: #777; font-size: 0.9em; width: 80px;">الموقع:</div>
            <div style="display: table-cell;">
              <a href="${website}" style="color: ${brandColor}; text-decoration: none;">${website}</a>
            </div>
          </div>
        `
            : ""
        }
        ${
          address
            ? `
          <div style="display: table-row;">
            <div style="display: table-cell; color: #777; font-size: 0.9em; width: 80px; vertical-align: top;">العنوان:</div>
            <div style="display: table-cell; line-height: 1.4;">${address}</div>
          </div>
        `
            : ""
        }
      </div>

      <!-- Social Links -->
      ${socialLinksHtml}

      <!-- Copyright -->
      <div style="
        font-size: 0.85rem; 
        color: #999; 
        text-align: center;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid #e8eaf6;
      ">
        © ${copyrightYear} ${orgName} - جميع الحقوق محفوظة
      </div>
    </div>
  `;
};
