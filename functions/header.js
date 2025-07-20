/**
 * Modular email header component with enhanced features
 * @param {string} orgName - Organization name
 * @param {string} logoUrl - Logo URL
 * @param {string} brandColor - Brand color for the header background
 * @param {Object} options - Optional configuration
 * @param {string} options.tagline - Optional tagline/subtitle
 * @param {string} options.textColor - Custom text color (default: white)
 * @param {string} options.logoSize - Logo size (default: 100px)
 * @param {string} options.gradient - Optional gradient colors "color1,color2"
 * @param {boolean} options.shadow - Add shadow effect
 * @returns {string} HTML string for the header
 */
module.exports = (orgName, logoUrl, brandColor, options = {}) => {
  const {
    tagline = "",
    textColor = "#fff",
    logoSize = "100px",
    gradient = null,
    shadow = false,
  } = options;

  // Create background style - gradient or solid color
  const backgroundStyle = gradient
    ? `background: linear-gradient(135deg, ${gradient.split(",")[0]}, ${
        gradient.split(",")[1] || brandColor
      });`
    : `background: ${brandColor};`;

  // Add shadow if requested
  const shadowStyle = shadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.15);" : "";

  return `
    <div style="text-align: center; padding: 20px 16px 16px 16px; background: #fff;">
      ${
        logoUrl
          ? `
        <img 
          src="${logoUrl}" 
          alt="${orgName} Logo" 
          style="
            width: ${logoSize}; 
            height: auto;
            margin-bottom: 12px; 
            border-radius: 8px;
            ${shadow ? "box-shadow: 0 2px 6px rgba(0,0,0,0.1);" : ""}
          " 
        />
      `
          : ""
      }
    </div>
    <div style="
      ${backgroundStyle}
      color: ${textColor}; 
      padding: 16px 0 12px 0; 
      text-align: center;
      ${shadowStyle}
      position: relative;
    ">
      <h1 style="
        margin: 0; 
        font-size: 1.6rem; 
        font-weight: 600;
        letter-spacing: 0.5px;
        line-height: 1.2;
        text-shadow: ${
          textColor === "#fff" ? "0 1px 2px rgba(0,0,0,0.1)" : "none"
        };
      ">${orgName}</h1>
      ${
        tagline
          ? `
        <p style="
          margin: 8px 0 0 0; 
          font-size: 0.95rem; 
          opacity: 0.9;
          font-weight: 300;
        ">${tagline}</p>
      `
          : ""
      }
    </div>
  `;
};
