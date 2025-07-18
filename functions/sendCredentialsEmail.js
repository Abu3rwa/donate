const nodemailer = require("nodemailer");

/**
 * Send credentials email to a new user using Nodemailer and Gmail.
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.displayName - User's display name
 * @param {string} params.email - User's email
 * @param {string} params.password - User's password
 * @param {string} params.role - User's role
 * @param {Array} params.permissions - User's permissions
 */
async function sendCredentialsEmail({
  to,
  displayName,
  email,
  password,
  role,
  permissions,
}) {
  // Create a transporter for Gmail
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "3bdulhafeez.sd@gmail.com",
      pass: "nuhw mvio vufr jcly", // <-- your new app password
    },
  });

  // Brand colors
  const brandColor = "#1976d2"; // Main blue
  const accentColor = "#FFD700"; // Gold
  const orgName = "الصندوق الخيري لابناء السعاتة الدومة بالداخل و الخارج";
  const orgDescription =
    "نحن منظمة خيرية غير ربحية مكرسة لتقديم الدعم والإغاثة لأهالي منطقة السعاتة الدومة من خلال مشاريع مستدامة ومبادرات مجتمعية.";
  const loginUrl = "https://shoply-31172.web.app/login";
  const logoUrl =
    "https://firebasestorage.googleapis.com/v0/b/shoply-31172.firebasestorage.app/o/logos%2F1752131902280_tempLogo.png?alt=media&token=b5608068-d7a8-4383-afe7-4282e0b25c82"; // Replace with your real logo URL

  // Format permissions as Arabic list
  const permissionsList =
    Array.isArray(permissions) && permissions.length
      ? `<ul style='margin: 0 0 0 20px; padding: 0; color: #1976d2;'>${permissions
          .map((p) => `<li>${p}</li>`)
          .join("")}</ul>`
      : '<span style="color: #888;">لا توجد صلاحيات محددة</span>';

  // Arabic email content
  const htmlContent = `
    <div style=\"direction: rtl; font-family: 'Cairo', Arial, sans-serif; background: #f7f7f7; padding: 32px;\">
      <div style=\"max-width: 500px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08); overflow: hidden;\">
        <div style=\"text-align: center; padding-top: 24px;\">
          <img src=\"${logoUrl}\" alt=\"Logo\" style=\"width: 100px; margin-bottom: 16px;\" />
        </div>
        <div style=\"background: ${brandColor}; color: #fff; padding: 12px 0 8px 0; text-align: center;\">
          <h1 style=\"margin: 0; font-size: 1.5rem; letter-spacing: 1px;\">${orgName}</h1>
        </div>
        <div style=\"padding: 20px 32px 0 32px;\">
          <p style=\"font-size:1.1rem; color:${brandColor}; margin-bottom:12px;\">مرحباً ${displayName}،</p>
          <p style=\"font-size: 1.05rem; color: #1976d2; margin-bottom: 18px; text-align: center;\">${orgDescription}</p>
        </div>
        <div style=\"padding: 0 32px 24px 32px;\">
          <p style=\"font-size: 1.1rem; color: #222; margin-bottom: 18px;\">تم إنشاء حسابك بنجاح في نظامنا.</p>
          <div style=\"background: ${accentColor}; color: #222; border-radius: 8px; padding: 16px 20px; margin-bottom: 18px;\">
            <p style=\"margin: 0 0 8px 0; font-weight: bold;\">بيانات الدخول الخاصة بك:</p>
            <p style=\"margin: 0;\">البريد الإلكتروني: <span style=\"direction: ltr; unicode-bidi: embed;\">${email}</span></p>
            <p style=\"margin: 0;\">كلمة المرور: <span style=\"direction: ltr; unicode-bidi: embed;\">${password}</span> <span style='color:#1976d2;'>(تم توليدها تلقائياً)</span></p>
          </div>
          <div style=\"margin-bottom: 18px;\">
            <p style=\"margin: 0 0 8px 0; font-weight: bold; color: #1976d2;\">دورك في النظام:</p>
            <p style=\"margin: 0 0 8px 0;\">${
              role || '<span style=\\"color: #888;\\">غير محدد</span>'
            }</p>
            <p style=\"margin: 0 0 8px 0; font-weight: bold; color: #1976d2;\">الصلاحيات الممنوحة:</p>
            ${permissionsList}
          </div>
          <div style=\"margin-bottom: 18px; text-align: center;\">
            <a href=\"${loginUrl}\" style=\"display:inline-block; background:${brandColor}; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:1.1rem;\">تسجيل الدخول للنظام</a>
          </div>
          <p style=\"font-size:0.95rem; color:#888; margin-top:24px; text-align:center;\">
            إذا واجهتك أي مشكلة، يرجى التواصل معنا عبر البريد الإلكتروني:
            <a href=\"mailto:3bdulhafeez.sd@gmail.com\" style=\"color:${brandColor};\">3bdulhafeez.sd@gmail.com</a>
          </p>
        </div>
        <div style=\"background: #f1f1f1; color: #888; text-align: center; padding: 12px 0; font-size: 0.95rem;\">
          ${orgName} - جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  `;

  // Format permissions for plain text
  const permissionsText =
    Array.isArray(permissions) && permissions.length
      ? permissions.map((p, i) => `${i + 1}. ${p}`).join("\n")
      : "لا توجد صلاحيات محددة";

  // Email content
  let info = await transporter.sendMail({
    from: `"${orgName}" <3bdulhafeez.sd@gmail.com>`,
    to,
    subject: `بيانات حسابك على ${orgName}`,
    text: `مرحباً ${displayName},\n\nتم إنشاء حسابك بنجاح في ${orgName}.\n\n${orgDescription}\n\nبيانات الدخول الخاصة بك:\nالبريد الإلكتروني: ${email}\nكلمة المرور: ${password} (تم توليدها تلقائياً)\n\nدورك في النظام: ${
      role || "غير محدد"
    }\nالصلاحيات الممنوحة:\n${permissionsText}\n\nرابط تسجيل الدخول: ${loginUrl}\n\nإذا واجهتك أي مشكلة، يرجى التواصل معنا عبر البريد الإلكتروني: 3bdulhafeez.sd@gmail.com\n\n${orgName} - جميع الحقوق محفوظة`,
    html: htmlContent,
  });

  // Log the messageId for development
  console.log("Message sent: %s", info.messageId);
}

module.exports = sendCredentialsEmail;
