const nodemailer = require("nodemailer");
const ADMIN_PERMISSIONS_AR = require("./adminPermissionsAr");
const renderHeader = require("./header");
const renderFooter = require("./footer");

/**
 * Send credentials email to a new user using Nodemailer and Gmail.
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.displayName - User's display name
 * @param {string} params.email - User's email
 * @param {string} params.password - User's password
 * @param {string} params.role - User's role
 * @param {Array} params.permissions - User's permissions
 * @param {string} params.contactInfo - Contact email for the sender
 * @param {string} params.senderName - Name of the sender (admin)
 * @param {string} params.senderRole - Role of the sender (admin)
 */
async function sendCredentialsEmail({
  to,
  displayName,
  email,
  password,
  role,
  permissions,
  contactInfo,
  senderName,
  senderRole,
  logoUrl,
  address,
}) {
  // Create a transporter for Gmail
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "3bdulhafeez.sd@gmail.com",
      pass: "nuhw mvio vufr jcly", // <-- your new app password
    },
  });

  // Brand colors and organization info
  const brandColor = "#10b981"; // Use the green from the gradient as main brand color
  const accentColor = "#FFD700"; // Gold
  const orgName = "الصندوق الخيري لابناء السعاتة الدومة بالداخل و الخارج";
  const orgDescription = "";
  const loginUrl = "https://shoply-31172.web.app/login";
  const website = "https://shoply-31172.web.app";
  const phone = "+249115337188"; // Update with real phone if available
  // const address = "المملكة العربية السعودية";
  const socialLinks = [
    { platform: "email", url: `mailto:${contactInfo}` },
    // Add more social links as needed
  ];
  const tagline = "";
  const headerOptions = {
    tagline,
    gradient:
      "linear-gradient(90deg, rgb(14, 165, 233) 0%, rgb(34, 211, 238) 60%, rgb(16, 185, 129) 100%)",
    shadow: true,
    logoSize: "120px",
  };
  // Use the logoUrl parameter, or fallback to default
  const resolvedLogoUrl =
    logoUrl ||
    "https://firebasestorage.googleapis.com/v0/b/shoply-31172.firebasestorage.app/o/logos%2F1752131902280_tempLogo.png?alt=media&token=b5608068-d7a8-4383-afe7-4282e0b25c82";
  const footerOptions = {
    contactInfo,
    senderName,
    senderRole,
    logoUrl: resolvedLogoUrl,
    website,
    phone,
    address, // This now comes from the admin's currentCountry
    brandColor,
    socialLinks,
    compactMode: false,
  };

  // Format permissions as Arabic list
  const permissionsList =
    Array.isArray(permissions) && permissions.length
      ? `<ul style='margin: 0 0 0 20px; padding: 0; color: rgb(0, 162, 148);'>${permissions
          .map((p) => `<li>${ADMIN_PERMISSIONS_AR[p] || p}</li>`)
          .join("")}</ul>`
      : '<span style="color: #888;">لا توجد صلاحيات محددة</span>';

  // Map senderRole to Arabic if possible
  let senderRoleAr = senderRole;
  if (ADMIN_PERMISSIONS_AR[senderRole]) {
    senderRoleAr = ADMIN_PERMISSIONS_AR[senderRole];
  } else if (senderRole === "admin" || senderRole === "مدير النظام") {
    senderRoleAr = "مدير النظام";
  }

  // Map user role to Arabic if possible
  let userRoleAr = role;
  if (ADMIN_PERMISSIONS_AR[role]) {
    userRoleAr = ADMIN_PERMISSIONS_AR[role];
  } else if (role === "super_admin" || role === "مدير النظام") {
    userRoleAr = "مدير النظام";
  }

  // Arabic email content with enhanced modular header and footer
  const htmlContent = `
    <div style=\"direction: rtl; font-family: 'Cairo', Arial, sans-serif; background: #f7f7f7; padding: 9px;\">
      <div style=\"max-width: 500px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08); overflow: hidden;\">
        ${renderHeader(orgName, resolvedLogoUrl, brandColor, headerOptions)}
        <div style=\"padding: 12px 16px 0 16px;\">
          <p style="font-size:1.1rem; color:#1976d2; margin-bottom:8px; text-align:center;">
            السلام عليكم ورحمة الله وبركاته
          </p>
          <p style=\"font-size:1.1rem; color:${brandColor}; margin-bottom:8px;\">مرحباً ${displayName} </p>
          <p style=\"font-size: 1.05rem; color:rgb(4, 4, 4); margin-bottom: 12px; text-align: center;\">
            نشكرك على انضمامك إلى عائلة ${orgName}. نحن سعداء بانضمامك إلينا ونتطلع إلى مساهمتك في تحقيق رسالتنا المجتمعية.
          </p>
        </div>
        <div style=\"padding: 0 16px 12px 16px;\">
          <p style=\"font-size: 1.1rem; color: #222; margin-bottom: 10px;\">تم إنشاء حسابك بنجاح في نظامنا.</p>
          <div style=\"background: ${accentColor}; color: #222; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px;\">
            <p style=\"margin: 0 0 6px 0; font-weight: bold;\">بيانات الدخول الخاصة بك:</p>
            <p style=\"margin: 0;\">البريد الإلكتروني: <span style=\"direction: ltr; unicode-bidi: embed;\">${email}</span></p>
            <p style=\"margin: 0;\">كلمة المرور: <span style=\"direction: ltr; unicode-bidi: embed;\">${password}</span> <span style='color:#1976d2;'>(تم توليدها تلقائياً)</span></p>
          </div>
          <div style=\"margin-bottom: 10px;\">
            <p style=\"margin: 0 0 6px 0; font-weight: bold; color: rgb(0, 162, 148);\">دورك في النظام:</p>
            <p style=\"margin: 0 0 6px 0;\">${
              userRoleAr || '<span style=\\"color: #888;\\">غير محدد</span>'
            }</p>
            <p style=\"margin: 0 0 6px 0; font-weight: bold; color:rgb(0, 162, 148);\">الصلاحيات الممنوحة:</p>
            ${permissionsList}
          </div>
          <div style=\"margin-bottom: 10px; text-align: center;\">
            <a href=\"${loginUrl}\" style=\"display:inline-block; background:${brandColor}; color:#fff; padding:8px 16px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:1.1rem;\">  تسجيل الدخول </a>
          </div>
          <p style=\"font-size:0.98rem; color:#1976d2; margin-top:12px; text-align:center; font-weight:500;\">
            إذا احتجت لأي مساعدة، نحن هنا دائماً لدعمك.
          </p>
          <p style=\"font-size:0.98rem; color:#888; margin-top:8px; text-align:center;\">
            شكراً لك مرة أخرى على ثقتك بنا.
          </p>
          <p style=\"font-size:0.98rem; color:#888; margin-top:8px; text-align:center;\">
            مع أطيب التحيات،<br/>${senderName} 
          </p>
        </div>
        ${renderFooter(orgName, footerOptions)}
      </div>
    </div>
  `;

  // Format permissions for plain text
  const permissionsText =
    Array.isArray(permissions) && permissions.length
      ? permissions
          .map((p, i) => `${i + 1}. ${ADMIN_PERMISSIONS_AR[p] || p}`)
          .join("\n")
      : "لا توجد صلاحيات محددة";

  // Friendly plain text email
  let info = await transporter.sendMail({
    from: `"${orgName}" <3bdulhafeez.sd@gmail.com>`,
    to,
    subject: `بيانات حسابك على ${orgName}`,
    text: `مرحباً ${displayName} ,\n\nنشكرك على انضمامك إلى عائلة ${orgName}. نحن سعداء بانضمامك إلينا ونتطلع إلى مساهمتك في تحقيق رسالتنا المجتمعية.\n\nتم إنشاء حسابك بنجاح في نظامنا.\n\nبيانات الدخول الخاصة بك:\nالبريد الإلكتروني: ${email}\nكلمة المرور: ${password} (تم توليدها تلقائياً)\n\nدورك في النظام: ${
      userRoleAr || "غير محدد"
    }\nالصلاحيات الممنوحة:\n${permissionsText}\n\nيمكنك الآن تسجيل الدخول والبدء في استخدام النظام من خلال الرابط التالي:\n${loginUrl}\n\nإذا احتجت لأي مساعدة، نحن هنا دائماً لدعمك.\n\nشكراً لك مرة أخرى على ثقتك بنا.\n\nمع أطيب التحيات،\n${senderName} ${
      senderRoleAr ? `(${senderRoleAr})` : ""
    }\n\nللتواصل: ${contactInfo}\n\n${orgName} - جميع الحقوق محفوظة`,
    html: htmlContent,
  });

  // Log the messageId for development
  console.log("Message sent: %s", info.messageId);
}

module.exports = sendCredentialsEmail;
