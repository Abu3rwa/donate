# Ideas for Improving sendCredentialsEmail.js

## Objective

Enhance the maintainability, branding, and flexibility of the email template by modularizing the header and footer, and making them reusable across different email types.

---

## 1. Modularize Header and Footer

- **Create separate functions or template strings for the header and footer.**
- Import or require these in `sendCredentialsEmail.js` and other email-related files.
- This allows for consistent branding and easier updates.

### Example Structure

```js
// header.js
module.exports = (orgName, logoUrl, brandColor) => `
  <div style="text-align: center; padding-top: 16px;">
    <img src="${logoUrl}" alt="Logo" style="width: 100px; margin-bottom: 10px;" />
  </div>
  <div style="background: ${brandColor}; color: #fff; padding: 8px 0 6px 0; text-align: center;">
    <h1 style="margin: 0; font-size: 1.5rem; letter-spacing: 1px;">${orgName}</h1>
  </div>
`;

// footer.js (email signature style)
module.exports = (
  orgName,
  { contactInfo, senderName, senderRole, logoUrl }
) => `
  <hr style="border:none; border-top:1px solid #e0e0e0; margin:24px 0 12px 0;" />
  <div style="background: #f1f1f1; color: #888; text-align: right; padding: 12px 18px; font-size: 0.95rem; border-radius: 0 0 12px 12px;">
    <div style="font-weight:bold; color:#1976d2; margin-bottom:2px;">${orgName}</div>
    <div style="margin-bottom:2px;">
      <span style="color:#222;">${senderName || "اسم المرسل"}</span>
      <span style="color:#888; font-size:0.92em;">${
        senderRole ? ` &mdash; ${senderRole}` : ""
      }</span>
    </div>
    <div style="font-size:0.92em; color:#555; margin-bottom:2px;">
      جهة الاتصال: <a href="mailto:${
        contactInfo || ""
      }" style="color:#1976d2; text-decoration:none;">${
  contactInfo || "لم يتم توفير معلومات الاتصال"
}</a>
    </div>
    ${
      logoUrl
        ? `<img src="${logoUrl}" alt="Logo" style="width: 60px; margin-top: 6px;" />`
        : ""
    }
    <div style="font-size:0.9em; color:#aaa; margin-top:6px;">جميع الحقوق محفوظة</div>
  </div>
`;
```

---

## 2. Benefits

- **Consistency:** All emails have the same look and feel.
- **Maintainability:** Update the header/footer in one place to affect all emails.
- **Reusability:** Use the same header/footer for welcome, password reset, notification, and other emails.
- **Branding:** Easily update logo, colors, or org name.

---

## 3. How to Apply

1. **Create `header.js` and `footer.js` in the same directory.**
2. **Replace the inline header/footer HTML in `sendCredentialsEmail.js` with imports from these files.**
3. **Pass orgName, logoUrl, and brandColor as needed.**
4. **For other email types, reuse the same header/footer.**

---

## 4. Further Improvements

- **Support for light/dark mode or multiple themes.**
- **Add social media links or contact info in the footer.**
- **Allow dynamic content in the header/footer (e.g., custom greetings, campaign banners).**
- **Unit test the header/footer rendering.**
- **Consider using a template engine (like Handlebars or EJS) for more complex emails.**

---

## 5. Example Usage in sendCredentialsEmail.js

```js
const renderHeader = require("./header");
const renderFooter = require("./footer");

const htmlContent = `
  <div style="...">
    ${renderHeader(orgName, logoUrl, brandColor)}
    ...body content...
    ${renderFooter(orgName, { contactInfo, senderName, senderRole, logoUrl })}
  </div>
`;
```

---

## 6. Next Steps

- Discuss and agree on the header/footer design.
- Implement the modular files.
- Refactor existing email templates to use them.
