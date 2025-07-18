# AI Implementation Prompt: Modular Nodemailer Email for User Credentials

**Objective:**  
Implement a feature to send an email containing the new user's credentials (email and password) when an admin creates a user, using Nodemailer and Ethereal for testing.

**Constraints:**

- Do NOT modify or clutter the main `functions/index.js` file.
- Keep all new logic modular and separated in its own file.
- Do not change unrelated code.

**Instructions:**

1. **Create a new utility module** (e.g., `functions/sendCredentialsEmail.js`) that exports an async function to send an email using Nodemailer and Ethereal.

   - The function should accept parameters: `to`, `displayName`, `email`, and `password`.
   - Use `nodemailer.createTestAccount()` and a Nodemailer transporter as described in the plan above.
   - Compose an email with the credentials and send it.
   - Log the Ethereal preview URL for development/testing.

2. **Import and use this utility** in `functions/index.js`:

   - After successfully creating a user in `createUserByAdmin`, call the utility function to send the credentials email.
   - Only add the import and function call; do not add the full email logic to `index.js`.

3. **Do not change any other code** or logic in `index.js` or elsewhere.

4. **Security Note:**  
   This is for development/testing only. Never send plain passwords in production.

**Example usage in `index.js`:**

```js
const sendCredentialsEmail = require("./sendCredentialsEmail");
// ... after user creation:
await sendCredentialsEmail({ to: email, displayName, email, password });
```

---

**Summary:**

- All email logic must be in a separate file.
- Only import and call the function in `index.js`.
- No unrelated code should be changed.
